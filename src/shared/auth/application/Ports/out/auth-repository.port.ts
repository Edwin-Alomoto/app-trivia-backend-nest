import { User } from '@MR_CHANGO/shared/auth/domain/model/User';

export interface AuthRepositoryPort {
  createUser(user: User): Promise<User>;
}
