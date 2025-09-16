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
    const deletedToken = await prisma.refresh_tokens.deleteMany({
      where: {
        user_id: user_id,
      },
    });
    return deletedToken;
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
    const deletedTokens = await prisma.refresh_tokens.deleteMany({});
    return deletedTokens;
    throw new Error('Method not implemented.');
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
  createPasswordResetToken(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findPasswordResetToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updatePasswordResetTokenByUserId(userId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updatePasswordResetTokenUsed(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async createUser(user: User, prisma?: PrismaClient): Promise<User> {
    prisma = prisma ?? this.prismaService;
    const userToPersist = UserMapper.toPersistence(user);

    const newUser = await prisma.users.create({
      data: userToPersist,
    });
    return UserMapper.toDomain(newUser);
  }
}
