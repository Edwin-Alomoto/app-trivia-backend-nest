import { AuthRepositoryPort } from '@MR_CHANGO/shared/auth/application/Ports/out/auth-repository.port';
import { User } from '@MR_CHANGO/shared/auth/domain/model/User';
import { PrismaService } from '@MR_CHANGO/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../../controllers/mappers/user.mapper';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class AuthRepositoryAdapter implements AuthRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async findRole(prisma?: PrismaClient): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const roles = await prisma.roles.findFirst({
      where: {
        role_name: 'USER',
        status: 'ACTIVE',
      },
    });

    return roles;
  }
  async findRoleByUserId(user_id: string): Promise<any> {
    const role = await this.prismaService.user_roles.findFirst({
      where: {
        user_id: user_id,
      },
      include: {
        roles: true,
      },
    });
    return role;
  }
  async createUserRole(
    user_id: string,
    role_id: string,
    prisma?: PrismaClient,
  ): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const userRole = await prisma.user_roles.create({
      data: {
        user_id: user_id,
        role_id: role_id,
      },
      include: {
        roles: true,
      },
    });
    return userRole;
  }
  async deleteRefreshTokenByUserId(
    user_id: string,
    prisma?: PrismaClient,
  ): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const now = new Date();
    const deletedToken = await prisma.refresh_tokens.deleteMany({
      where: {
        user_id: user_id,
        OR: [
          { is_revoked: true }, // Tokens revocados
          { expires_at: { lt: now } }, // Tokens expirados
        ],
      },
    });
    return deletedToken;
  }
  async updateRefreshTokenById(id: string, prisma: PrismaClient): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const updatedToken = await prisma.refresh_tokens.update({
      where: {
        id: id,
      },
      data: {
        is_revoked: true,
      },
    });
    return updatedToken;
  }

  async createRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date,
    prisma: PrismaClient,
  ): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const newRefreshToken = await prisma.refresh_tokens.create({
      data: {
        token,
        user_id: userId,
        expires_at: expiresAt,
      },
    });
    return newRefreshToken;
  }

  async findRefreshToken(prisma: PrismaClient): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const refreshToken = await prisma.refresh_tokens.findFirst({
      where: {
        is_revoked: false,
      },
    });
    return refreshToken;
  }

  async findRefreshTokenByUserId(
    user_id: string,
    prisma?: PrismaClient,
  ): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const refreshToken = await prisma.refresh_tokens.findFirst({
      where: {
        user_id: user_id,
        is_revoked: false,
      },
    });
    return refreshToken;
  }

  async deleteRefreshTokens(prisma?: PrismaClient): Promise<any> {
    prisma = prisma ?? this.prismaService;
    const now = new Date();
    const deletedTokens = await this.prismaService.refresh_tokens.deleteMany({
      where: {
        OR: [
          { is_revoked: true }, // Tokens revocados
          { expires_at: { lt: now } }, // Tokens expirados
        ],
      },
    });
  }
  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.prismaService.users.findUnique({
      where: { email },
    });

    return UserMapper.toDomain(existingUser);
  }
  findUserById(user_id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  async createPasswordResetToken(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any> {
    await this.prismaService.password_reset_tokens.create({
      data: {
        token: token,
        user_id: userId,
        expires_at: expiresAt,
      },
    });
  }
  async findPasswordResetToken(token: string): Promise<any> {
    const passwordResetToken =
      await this.prismaService.password_reset_tokens.findUnique({
        where: { token },
        include: { users: true },
      });
    return passwordResetToken;
  }
  async updatePasswordResetTokenByUserId(userId: string): Promise<any> {
    await this.prismaService.refresh_tokens.updateMany({
      where: { user_id: userId },
      data: { is_revoked: true },
    });
  }
  async updatePasswordResetTokenById(id: string): Promise<any> {
    await this.prismaService.password_reset_tokens.update({
      where: { id: id },
      data: { used: true },
    });
  }
  async deletePasswordResetTokenByUserId(userId: string): Promise<void> {
    await this.prismaService.password_reset_tokens.updateMany({
      where: {
        user_id: userId,
        used: false,
      },
      data: {
        used: true,
      },
    });
  }
  async createUser(user: User, prisma?: PrismaClient): Promise<User> {
    prisma = prisma ?? this.prismaService;
    const userToPersist = UserMapper.toPersistence(user);

    const newUser = await prisma.users.create({
      data: userToPersist,
    });
    return UserMapper.toDomain(newUser);
  }

  async updateUser(
    userId: string,
    passwordHash: string,
    prisma?: PrismaClient,
  ): Promise<User> {
    prisma = prisma ?? this.prismaService;
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        password_hash: passwordHash,
        updated_at: new Date(),
      },
    });
    return UserMapper.toDomain(updatedUser);
  }
}
