import { AuthRepositoryPort } from '@MR_CHANGO/shared/auth/application/Ports/out/auth-repository.port';
import { User } from '@MR_CHANGO/shared/auth/domain/model/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepositoryAdapter implements AuthRepositoryPort {
  constructor() {}
  createUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
