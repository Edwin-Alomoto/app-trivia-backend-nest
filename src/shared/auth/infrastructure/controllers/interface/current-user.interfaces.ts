export interface CurrentUser {
  id: string; // ID del usuario
  email: string; // Email del usuario
  roles: string[]; // Roles del usuario ['admin', 'user']
  iat?: number; // Fecha de creación del token
  exp?: number; // Fecha de expiración del token
}
