import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../const/roles.enum';

export const ROLES_KEY = 'user_roles';

export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
