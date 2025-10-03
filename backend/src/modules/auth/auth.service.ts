// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import { In } from 'typeorm';
import { AppDataSource } from '../../config/data-source';

import User from '../users/user.entity';
import { UserRole } from './user-role.entity';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';
import { Permission } from './permission.entity';

// --- helpers ---
export async function getUserByEmail(email: string) {
  return AppDataSource.getRepository(User).findOne({ where: { email } });
}

export async function validatePassword(plain: string, hash: string | null) {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

// --- roles + permisos ---
export async function getRolesAndPerms(userId: number) {
  const urRepo = AppDataSource.getRepository(UserRole);
  const rRepo  = AppDataSource.getRepository(Role);
  const rpRepo = AppDataSource.getRepository(RolePermission);
  const pRepo  = AppDataSource.getRepository(Permission);

  // Roles del usuario
  const userRoles = await urRepo.find({ where: { userId } });
  const roleIds = userRoles.map(x => x.roleId);
  if (roleIds.length === 0) return { roles: [], perms: [] };

  const roles = await rRepo.findBy({ roleId: In(roleIds) });
  const roleNames = roles.map(r => r.name);

  // Permisos por rol (cargamos role-permission por los roleIds)
  const rp = await rpRepo.find(); // sencillo; si quieres optimizar, usa query builder por roleIds
  const permIds = Array.from(new Set(rp.filter(x => roleIds.includes(x.roleId)).map(x => x.permissionId)));

  const perms = permIds.length ? await pRepo.findBy({ permissionId: In(permIds) }) : [];
  const permCodes = perms.map(p => p.code);

  return { roles: roleNames, perms: permCodes };
}
