import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { UserRole, VALID_ROLES } from './user-roles.enum';

// Type for role from database
export interface RoleFromDB {
  role_id: string;
  status: string;
  role_name: string;
  role_description: string;
}

// Type alias for role names (now uses enum)
export type RoleName = UserRole;

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  // Get all active roles from database
  async getAllRoles(): Promise<RoleFromDB[]> {
    return this.prisma.roles.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  // Get role by name
  async getRoleByName(roleName: string): Promise<RoleFromDB | null> {
    return this.prisma.roles.findFirst({
      where: {
        role_name: roleName,
        status: 'ACTIVE',
      },
    });
  }

  // Get all role names for validation
  async getValidRoleNames(): Promise<string[]> {
    const roles = await this.getAllRoles();
    return roles.map((role) => role.role_name);
  }

  // Utility function for runtime role validation
  async isValidRole(role: string): Promise<boolean> {
    const validRoles = await this.getValidRoleNames();
    return validRoles.includes(role);
  }

  // Check if user has specific role
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    const userRole = await this.prisma.user_roles.findFirst({
      where: {
        user_id: userId,
        roles: {
          role_name: roleName,
          status: 'ACTIVE',
        },
      },
    });
    return !!userRole;
  }
}
