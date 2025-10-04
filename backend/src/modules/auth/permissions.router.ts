// backend/src/modules/auth/permissions.router.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Permission } from './permission.entity';
import { requireAuth } from './requireAuth';
import { requirePermission } from './requirePermission';

const r = Router();
const permRepo = () => AppDataSource.getRepository(Permission);

r.use(requireAuth, requirePermission('users.read.school'));

r.get('/', async (_req, res) => {
  const perms = await permRepo().find({ order: { permissionId: 'ASC' } as any });
  res.json(perms);
});

export default r;
