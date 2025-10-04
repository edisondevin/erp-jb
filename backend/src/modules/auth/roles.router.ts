// backend/src/modules/auth/roles.router.ts
import { Router } from 'express';
import { In } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Permission } from './permission.entity';
import { requireAuth } from './requireAuth';
import { requirePermission } from './requirePermission';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

const r = Router();

const roleRepo = () => AppDataSource.getRepository(Role);
const rpRepo = () => AppDataSource.getRepository(RolePermission);
const permRepo = () => AppDataSource.getRepository(Permission);

// Protege el módulo completo: cualquiera que entre aquí debe tener este permiso
r.use(requireAuth, requirePermission('users.read.school'));

// Listar roles
r.get('/', async (_req, res) => {
  const roles = await roleRepo().find({ order: { roleId: 'ASC' } as any });
  res.json(roles);
});

// Permisos de un rol
r.get('/:id/permissions', async (req, res) => {
  const roleId = Number(req.params.id);
  if (Number.isNaN(roleId)) return res.status(400).json({ error: 'id inválido' });

  // 1) Trae las filas rol-permiso
  const links = await rpRepo().find({ where: { roleId } as any });

  // 2) Extrae permissionId
  const permIds = links.map(l => (l as any).permissionId).filter(Boolean);

  // 3) Busca los permisos
  const perms = permIds.length
    ? await permRepo().findBy({ permissionId: In(permIds as any) })
    : [];

  res.json(perms);
});

export default r;
