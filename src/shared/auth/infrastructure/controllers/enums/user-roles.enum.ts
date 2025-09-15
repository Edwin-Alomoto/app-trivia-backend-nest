export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

export const VALID_ROLES = Object.values(UserRole);

// Tipo para mayor seguridad
export type RoleName = keyof typeof UserRole;
