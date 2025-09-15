import { UserRole } from '../enums/user-roles.enum';

export interface CurrentUser {
  id: string; // ID del usuario
  email: string; // Email del usuario
  name?: string; // Nombre del usuario
  role: UserRole; // Rol único del usuario
  iat?: number; // Fecha de creación del token
  exp?: number; // Fecha de expiración del token
}
