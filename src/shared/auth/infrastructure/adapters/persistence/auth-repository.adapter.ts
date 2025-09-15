import { AuthRepositoryPort } from '@MR_CHANGO/shared/auth/application/Ports/out/auth-repository.port';
import { User } from '@MR_CHANGO/shared/auth/domain/model/User';
import { PrismaService } from '@MR_CHANGO/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../../controllers/mappers/user.mapper';

@Injectable()
export class AuthRepositoryAdapter implements AuthRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}
  findRoles(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  findRoleByUserId(user_id: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  createUserRole(user_id: string, role_id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteRefreshTokenByUserId(user_id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteRefreshTokens(): Promise<any> {
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
  createUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
