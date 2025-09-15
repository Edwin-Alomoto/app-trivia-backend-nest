import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginUserDto } from '@MR_CHANGO/shared/auth/infrastructure/controllers/dto/login-user.dto';
import { RegisterUserDto } from '@MR_CHANGO/shared/auth/infrastructure/controllers/dto/register-user.dto';
import { ForgotPasswordDto } from '@MR_CHANGO/shared/auth/infrastructure/controllers/dto/forgot-password.dto';
import { ResetPasswordDto } from '@MR_CHANGO/shared/auth/infrastructure/controllers/dto/reset-password.dto';
import { CurrentUser } from '@MR_CHANGO/shared/auth/infrastructure/controllers/interface/current-user.interfaces';
import { PrismaService } from '@MR_CHANGO/shared/database/prisma.service';
import {
  ResourceAlreadyExistsException,
  UsernameNotFoundException,
} from 'src/common/exceptions';
import { LoggerService } from '@MR_CHANGO/shared/logger/logger.service';
import { BaseResponseDto } from 'src/common/dtos/response.dto';
import { EmailService } from '@MR_CHANGO/shared/email/email.service';
import type { AuthRepositoryPort } from '../Ports/out/auth-repository.port';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,

    @Inject('AuthRepositoryPort')
    private readonly authRepository: AuthRepositoryPort,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      const { email, password } = registerUserDto;

      // Verificar si el usuario ya existe
      const existingUser = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ResourceAlreadyExistsException(
          'El usuario con este email ya existe',
        );
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const {
        password: _,
        birth_date,
        ...userDataWithoutPassword
      } = registerUserDto;

      // Preparar los datos del usuario, convirtiendo birth_date a Date si existe
      const userData: any = {
        ...userDataWithoutPassword,
        password_hash: hashedPassword,
      };

      // Convertir birth_date de string a Date si está presente
      if (birth_date) {
        userData.birth_date = new Date(birth_date);
      }

      // Ejecutar todas las operaciones en una transacción
      const result = await this.prismaService.$transaction(async (prisma) => {
        const newUser = await prisma.users.create({
          data: userData,
        });

        const roles = await prisma.roles.findFirst({
          where: {
            role_name: 'USER',
            status: 'ACTIVE',
          },
        });

        if (!roles) {
          throw new BadRequestException(
            'Error: El rol USER no está definido en la base de datos',
          );
        }

        const rol = await prisma.user_roles.create({
          data: {
            user_id: newUser.user_id,
            role_id: roles.role_id,
          },
          include: {
            roles: true,
          },
        });

        // Limpiar tokens revocados usando el prisma de la transacción
        await this.cleanupRevokedTokens(newUser.user_id, prisma);

        const newUserWithRole = {
          ...newUser,
          rol,
        };

        const tokens = await this.generateTokens(newUserWithRole, prisma);

        return { newUser, rol: newUserWithRole.rol, tokens };
      });

      const { newUser, rol, tokens } = result;

      // Enviar email de bienvenida de forma asíncrona
      this.emailService
        .sendWelcomeEmail(newUser.email, newUser.first_name)
        .catch((error) => {
          this.loggerService.error(
            `Error sending welcome email to ${newUser.email}`,
            error,
          );
        });

      const userResponse = {
        user: {
          id: newUser.user_id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          username: newUser.username,
          email: newUser.email,
          role: rol.roles.role_name,
        },
        ...tokens,
      };

      return {
        status: HttpStatus.CREATED,
        message: 'Usuario registrado exitosamente',
        data: userResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsException) {
        throw error;
      }

      this.loggerService.error('Error en el registro de usuario', error);
      throw new BadRequestException('Error en el registro de usuario');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<BaseResponseDto<any>> {
    try {
      const { email, password } = loginUserDto;

      // Buscar el usuario en la base de datos
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UsernameNotFoundException('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const role = await this.prismaService.user_roles.findFirst({
        where: {
          user_id: user.user_id,
        },
        include: {
          roles: true,
        },
      });

      if (!role) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const userWithRole = {
        ...user,
        rol: role,
      };

      // Ejecutar operaciones de login en una transacción
      const result = await this.prismaService.$transaction(async (prisma) => {
        // Limpiar tokens revocados antes de generar nuevos tokens
        await this.cleanupRevokedTokens(user.user_id, prisma);

        // Generar nuevos tokens
        const tokens = await this.generateTokens(userWithRole, prisma);

        return { tokens };
      });

      const { tokens } = result;

      const userResponse = {
        user: {
          id: user.user_id,
          // name: user.name,
          username: user.username,
          email: user.email,
          role: role.roles.role_name,
        },
        ...tokens,
      };

      return {
        status: HttpStatus.OK,
        message: 'Inicio de sesión exitoso',
        data: userResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof UsernameNotFoundException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.loggerService.error('Error en el inicio de sesión', error);
      throw new BadRequestException('Error en el inicio de sesión');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar el refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      });

      // Verificar que es un refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Tipo de token inválido');
      }

      // Buscar todos los refresh tokens del usuario que no estén revocados
      const storedTokens = await this.prismaService.refresh_tokens.findMany({
        where: {
          user_id: payload.id,
          is_revoked: false,
        },
        include: { users: true },
      });

      // Buscar el token que coincida
      let matchedToken: (typeof storedTokens)[0] | null = null;
      for (const storedToken of storedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, storedToken.token);
        if (isMatch) {
          matchedToken = storedToken;
          break;
        }
      }

      // Si no existe o está revocado, es inválido
      if (!matchedToken) {
        throw new UnauthorizedException(
          'Token de actualización inválido o revocado',
        );
      }

      // Verificar si ha expirado
      if (new Date() > matchedToken.expires_at) {
        // Marcar como revocado si ha expirado
        await this.prismaService.refresh_tokens.update({
          where: { id: matchedToken.id },
          data: { is_revoked: true },
        });
        throw new UnauthorizedException('Token de actualización expirado');
      }

      // Revocar el refresh token usado (one-time use)
      await this.prismaService.refresh_tokens.update({
        where: { id: matchedToken.id },
        data: { is_revoked: true },
      });

      // Generar nuevos tokens
      const user = matchedToken.users;
      const tokens = await this.generateTokens(user);

      return {
        status: HttpStatus.OK,
        message: 'Tokens renovados exitosamente',
        data: {
          user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            //roles: user.role,
          },
          ...tokens,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.loggerService.error('Error renovando tokens', error);
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  async logout(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Token de actualización requerido');
      }

      // Buscar todos los refresh tokens que no estén revocados
      const storedTokens = await this.prismaService.refresh_tokens.findMany({
        where: {
          is_revoked: false,
        },
      });

      // Buscar el token que coincida
      let matchedToken: (typeof storedTokens)[0] | null = null;
      for (const storedToken of storedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, storedToken.token);
        if (isMatch) {
          matchedToken = storedToken;
          break;
        }
      }

      if (matchedToken) {
        // Revocar el refresh token
        await this.prismaService.refresh_tokens.update({
          where: { id: matchedToken.id },
          data: { is_revoked: true },
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Sesión cerrada exitosamente',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.loggerService.error('Error cerrando sesión', error);
      throw new BadRequestException('Error cerrando sesión');
    }
  }

  private async generateTokens(user: any, prismaClient?: any) {
    const prisma = prismaClient || this.prismaService;

    const payload = {
      id: user.user_id,
      email: user.email,
      name: user.first_name,
      role: user.rol.roles.role_name,
    };

    // Access Token (corta duración)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      expiresIn: '60m', // 60 minutos
    });

    // Refresh Token (larga duración)
    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh', // Marca que es un refresh token
      },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
        expiresIn: '7d', // 7 días
      },
    );

    // Guardar el refresh token hasheado en la base de datos
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await prisma.refresh_tokens.create({
      data: {
        token: hashedRefreshToken,
        user_id: user.user_id,
        expires_at: expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 60 * 60, // 60 minutos en segundos
    };
  }

  private async cleanupRevokedTokens(
    userId: string,
    prismaClient?: any,
  ): Promise<void> {
    try {
      const prisma = prismaClient || this.prismaService;
      const now = new Date();

      // Eliminar tokens que están revocados O que han expirado
      const deletedTokens = await prisma.refresh_tokens.deleteMany({
        where: {
          user_id: userId,
          OR: [
            { is_revoked: true }, // Tokens revocados
            { expires_at: { lt: now } }, // Tokens expirados
          ],
        },
      });

      this.loggerService.log(
        `Limpieza de tokens para usuario ${userId}: ${deletedTokens.count} tokens eliminados`,
      );
    } catch (error) {
      this.loggerService.error(
        `Error limpiando tokens para usuario ${userId}`,
        error,
      );
    }
  }

  async cleanupAllRevokedTokens(): Promise<{ deletedCount: number }> {
    try {
      const now = new Date();

      // Eliminar todos los tokens revocados o expirados de todos los usuarios
      const deletedTokens = await this.prismaService.refresh_tokens.deleteMany({
        where: {
          OR: [
            { is_revoked: true }, // Tokens revocados
            { expires_at: { lt: now } }, // Tokens expirados
          ],
        },
      });

      this.loggerService.log(
        `Limpieza global de tokens: ${deletedTokens.count} tokens eliminados`,
      );

      return { deletedCount: deletedTokens.count };
    } catch (error) {
      this.loggerService.error('Error en limpieza global de tokens', error);
      throw new BadRequestException('Error en limpieza de tokens');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      const { email } = forgotPasswordDto;

      const user = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (!user) {
        // Por seguridad, siempre devolvemos el mismo mensaje
        return {
          status: HttpStatus.OK,
          message:
            'Si el email existe, recibirás un enlace para restablecer tu contraseña',
          data: null,
          timestamp: new Date().toISOString(),
        };
      }

      // Invalidar todos los tokens de reset existentes para este usuario
      await this.prismaService.password_reset_tokens.updateMany({
        where: {
          user_id: user.user_id,
          used: false,
        },
        data: {
          used: true,
        },
      });

      // Generar token único
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Token expira en 1 hora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Guardar token en la base de datos
      await this.prismaService.password_reset_tokens.create({
        data: {
          token: resetToken,
          user_id: user.user_id,
          expires_at: expiresAt,
        },
      });

      // Enviar email de forma asíncrona
      this.emailService
        .sendPasswordResetEmail(user.email, user.username, resetToken)
        .catch((error) => {
          this.loggerService.error(
            `Error sending password reset email to ${user.email}`,
            error,
          );
        });

      return {
        status: HttpStatus.OK,
        message:
          'Si el email existe, recibirás un enlace para restablecer tu contraseña',
        data: null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.loggerService.error('Error en forgot password', error);
      throw new BadRequestException('Error procesando la solicitud');
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      const { token, newPassword, confirmPassword } = resetPasswordDto;

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Buscar el token en la base de datos
      const passwordResetToken =
        await this.prismaService.password_reset_tokens.findUnique({
          where: { token },
          include: { users: true },
        });

      if (!passwordResetToken) {
        throw new BadRequestException('Token de restablecimiento inválido');
      }

      if (passwordResetToken.used) {
        throw new BadRequestException('Token de restablecimiento ya utilizado');
      }

      if (new Date() > passwordResetToken.expires_at) {
        throw new BadRequestException('Token de restablecimiento expirado');
      }

      // Verificar que la nueva contraseña sea diferente de la actual
      const isSamePassword = await bcrypt.compare(
        newPassword,
        passwordResetToken.users.password_hash,
      );
      if (isSamePassword) {
        throw new BadRequestException(
          'La nueva contraseña debe ser diferente de la actual',
        );
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Actualizar la contraseña del usuario
      await this.prismaService.users.update({
        where: { user_id: passwordResetToken.user_id },
        data: { password_hash: hashedPassword },
      });

      // Marcar el token como usado
      await this.prismaService.password_reset_tokens.update({
        where: { id: passwordResetToken.id },
        data: { used: true },
      });

      // Invalidar todos los refresh tokens del usuario por seguridad
      await this.prismaService.refresh_tokens.updateMany({
        where: { user_id: passwordResetToken.user_id },
        data: { is_revoked: true },
      });

      return {
        status: HttpStatus.OK,
        message: 'Contraseña restablecida exitosamente',
        data: null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.loggerService.error('Error en reset password', error);
      throw new BadRequestException('Error restableciendo la contraseña');
    }
  }

  /*   async validateUser(payload: any): Promise<CurrentUser> {
    // Aquí puedes hacer validaciones adicionales si es necesario
    return {
      id: payload.id,
      email: payload.email,
      roles: payload.roles || ['user'], // Asegura que siempre tenga roles
    };
  } */
}
