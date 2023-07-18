import { RoleEntity } from '@/domains/entities';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (roles: RoleEntity[]) => SetMetadata(ROLES_KEY, roles);
