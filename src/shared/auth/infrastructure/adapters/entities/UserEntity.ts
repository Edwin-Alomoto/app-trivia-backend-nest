export class UserEntity {
  constructor(
    public user_id: string,
    public status?: string,
    public first_name?: string,
    public last_name?: string,
    public address?: string,
    public username?: string,
    public email?: string,
    public password_hash?: string,
    public phone?: string,
    public birth_date?: Date,
    public gender?: string,
    public email_verified?: boolean,
    public created_at?: Date,
    public updated_at?: Date,
    public is_active?: boolean,
    public expires_at?: Date,
  ) {}
}
