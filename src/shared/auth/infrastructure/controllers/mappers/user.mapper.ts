import { User } from '../../../domain/model/User';

export class UserMapper {
  static toDomain(user: any): User {
    return new User(
      user.user_id,
      user.status,
      user.first_name,
      user.last_name,
      user.address,
      user.username,
      user.email,
      user.password_hash,
      user.phone,
      user.birth_date ? new Date(user.birth_date) : undefined,
      user.gender,
      user.email_verified,
      user.created_at ? new Date(user.created_at) : undefined,
      user.updated_at ? new Date(user.updated_at) : undefined,
      user.is_active,
      user.expires_at ? new Date(user.expires_at) : undefined,
    );
  }

  static toPersistence(user: User): any {
    return {
      user_id: user.user_id,
      status: user.status,
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      phone: user.phone,
      birth_date: user.birth_date,
      gender: user.gender,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_active: user.is_active,
      expires_at: user.expires_at,
    };
  }
}
