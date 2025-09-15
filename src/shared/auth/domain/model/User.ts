export class User {
  constructor(
    public readonly user_id: string,
    public readonly status?: string,
    public readonly first_name?: string,
    public readonly last_name?: string,
    public readonly address?: string,
    public readonly username?: string,
    public readonly email?: string,
    public readonly password_hash?: string,
    public readonly phone?: string,
    public readonly birth_date?: Date,
    public readonly gender?: string,
    public readonly email_verified?: boolean,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly is_active?: boolean,
    public readonly expires_at?: Date,
  ) {}
}
