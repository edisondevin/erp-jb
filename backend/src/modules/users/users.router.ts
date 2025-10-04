// backend/src/modules/users/users.router.ts
import { Router } from 'express';
import { PaginationDTO, CreateUserDTO, UpdateUserDTO, AssignRolesDTO } from './users.dto';
import { listUsers, getUserWithRoles, createUser, updateUser, softDeleteUser, assignRoles, resetPassword } from './users.service';
import { requireAuth } from '../auth/requireAuth';
import { requirePermission } from '../auth/requirePermission';

const r = Router();

r.get('/', requireAuth, requirePermission('users.read.school'), async (req, res) => {
  const parsed = PaginationDTO.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const result = await listUsers(parsed.data);
  res.json(result);
});

r.get('/:id', requireAuth, requirePermission('users.read.detail'), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
  const out = await getUserWithRoles(id);
  if (!out) return res.status(404).json({ error: 'No encontrado' });
  res.json(out);
});

r.post('/', requireAuth, requirePermission('users.create'), async (req, res) => {
  const parsed = CreateUserDTO.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const saved = await createUser(parsed.data);
    res.status(201).json(saved);
  } catch (e: any) {
    if (String(e.message).includes('Email ya registrado')) return res.status(409).json({ error: e.message });
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

r.put('/:id', requireAuth, requirePermission('users.update'), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
  const parsed = UpdateUserDTO.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const saved = await updateUser(id, parsed.data);
    res.json(saved);
  } catch (e: any) {
    if (String(e.message).includes('Email ya registrado')) return res.status(409).json({ error: e.message });
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

r.delete('/:id', requireAuth, requirePermission('users.delete'), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
  try {
    const saved = await softDeleteUser(id);
    res.json(saved);
  } catch (e: any) {
    res.status(500).json({ error: 'Error al desactivar' });
  }
});

r.post('/:id/roles', requireAuth, requirePermission('users.assignRole'), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
  const parsed = AssignRolesDTO.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const roles = await assignRoles(id, parsed.data.roleIds);
    res.json(roles);
  } catch (e: any) {
    res.status(500).json({ error: 'Error al asignar roles' });
  }
});

r.post('/:id/reset-password', requireAuth, requirePermission('users.password.reset'), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
  try {
    const out = await resetPassword(id);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: 'Error al resetear contraseña' });
  }
});

export default r;
