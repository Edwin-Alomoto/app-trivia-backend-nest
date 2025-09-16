import { User } from '@MR_CHANGO/shared/auth/domain/model/User';
import { PrismaClient } from '@prisma/client/extension';

export interface AuthRepositoryPort {
  createUser(user: User, prisma: PrismaClient): Promise<User>;
  findRole(prisma: PrismaClient): Promise<string[]>;
  findRoleByUserId(user_id: string, prisma: PrismaClient): Promise<string[]>;
  createUserRole(
    user_id: string,
    role_id: string,
    prisma: PrismaClient,
  ): Promise<any>;
  updateUser(
    userId: string,
    passwordHash: string,
    prisma: PrismaClient,
  ): Promise<User>;
  deleteRefreshTokenByUserId(
    user_id: string,
    prisma: PrismaClient,
  ): Promise<any>;
  deleteRefreshTokens(prisma: PrismaClient): Promise<any>;
  updateRefreshTokenById(id: string, prisma: PrismaClient): Promise<any>;
  findRefreshTokenByUserId(user_id: string, prisma: PrismaClient): Promise<any>;
  findRefreshToken(prisma: PrismaClient): Promise<any>;
  createRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date,
    prisma: PrismaClient,
  ): Promise<any>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(user_id: string): Promise<User | null>;
  createPasswordResetToken(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any>;
  findPasswordResetToken(token: string): Promise<any>;
  updatePasswordResetTokenByUserId(userId: string): Promise<any>;
  updatePasswordResetTokenById(id: string): Promise<any>;
  deletePasswordResetTokenByUserId(userId: string): Promise<void>;
}
