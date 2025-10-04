// backend/src/modules/users/users.service.ts
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../config/data-source';
import User from './user.entity';
import { Role } from '../auth/role.entity';
import { UserRole } from '../auth/user-role.entity';
import { Like, In } from 'typeorm';
import type { PaginationInput, CreateUserInput, UpdateUserInput } from './users.dto';

const userRepo = () => AppDataSource.getRepository(User);
const roleRepo = () => AppDataSource.getRepository(Role);
const userRoleRepo = () => AppDataSource.getRepository(UserRole);

export async function listUsers(p: PaginationInput) {
  const page = p.page ?? 1;
  const limit = p.limit ?? 10;
  const where: any = {};
  if (typeof p.isActive === 'boolean') where.isActive = p.isActive;
  if (p.search?.trim()) where.email = Like(`%${p.search.trim()}%`);

  const [data, total] = await userRepo().findAndCount({
    where,
    order: { userId: 'DESC' },
    take: limit,
    skip: (page - 1) * limit,
  });

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getUserWithRoles(userId: number) {
  const user = await userRepo().findOne({ where: { userId } });
  if (!user) return null;

  // Trae los enlaces y luego los roles por id (sin depender de ur.role)
  const links = await userRoleRepo().findBy({ userId } as any);
  const roleIds = links.map(l => (l as any).roleId) as number[];
  const roles = roleIds.length ? await roleRepo().findBy({ roleId: In(roleIds) }) : [];

  return { user, roles };
}

export async function createUser(input: CreateUserInput) {
  const exists = await userRepo().exist({ where: { email: input.email } as any });
  if (exists) throw new Error('Email ya registrado');

  const passwordHash = bcrypt.hashSync(input.password, 10);
  const entity = userRepo().create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash,
    isActive: true,
  });

  return userRepo().save(entity);
}

export async function updateUser(userId: number, input: UpdateUserInput) {
  const u = await userRepo().findOne({ where: { userId } });
  if (!u) throw new Error('Usuario no encontrado');

  if (input.email && input.email !== u.email) {
    const emailTaken = await userRepo().exist({ where: { email: input.email } as any });
    if (emailTaken) throw new Error('Email ya registrado');
  }

  Object.assign(u, input);
  return userRepo().save(u);
}

export async function softDeleteUser(userId: number) {
  const u = await userRepo().findOne({ where: { userId } });
  if (!u) throw new Error('Usuario no encontrado');
  u.isActive = false;
  return userRepo().save(u);
}

export async function assignRoles(userId: number, roleIds: number[]) {
  const u = await userRepo().findOne({ where: { userId } });
  if (!u) throw new Error('Usuario no encontrado');

  await userRoleRepo().delete({ userId } as any);
  if (!roleIds?.length) return [];

  const roles = await roleRepo().findBy({ roleId: In(roleIds) });
  const toSave = roleIds.map(roleId => userRoleRepo().create({ userId, roleId }));
  await userRoleRepo().save(toSave);

  return roles;
}

export async function resetPassword(userId: number) {
  const u = await userRepo().findOne({ where: { userId } });
  if (!u) throw new Error('Usuario no encontrado');

  const newPass = Math.random().toString(36).slice(-10);
  u.passwordHash = bcrypt.hashSync(newPass, 10);
  await userRepo().save(u);

  return { tempPassword: newPass };
}
