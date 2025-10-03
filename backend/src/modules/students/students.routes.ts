import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../../config/data-source';
import { Student } from './student.entity';
import { Enrollment } from './enrollment.entity';
import { requireAuth } from '../auth/requireAuth';
import { requirePermission } from '../auth/requirePermission';

const r = Router();

// Repos
const studentRepo = () => AppDataSource.getRepository(Student);
const enrRepo = () => AppDataSource.getRepository(Enrollment);

// Schemas
const studentSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  dni:       z.string().length(8),
  birthDate: z.string().min(1),
  address:   z.string().optional()
});

const enrollSchema = z.object({
  yearId: z.number().int().positive(),
  studentId: z.number().int().positive(),
  sectionId: z.number().int().positive()
});

// ===== Students =====

// LIST (protegido)
r.get(
  '/',
  requireAuth,
  requirePermission('academic.students.read.school'),
  async (_req, res) => {
    const list = await studentRepo().find({ order: { studentId: 'DESC' } });
    res.json(list);
  }
);

// CREATE (puedes protegerlo si ya tienes el permiso correspondiente)
r.post(
  '/',
  // requireAuth,
  // requirePermission('academic.students.create'),
  async (req, res) => {
    const p = studentSchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: p.error.flatten() });

    // DNI único
    const exists = await studentRepo().exists({ where: { dni: p.data.dni } });
    if (exists) return res.status(409).json({ error: 'DNI ya registrado' });

    const saved = await studentRepo().save(studentRepo().create(p.data));
    res.status(201).json(saved);
  }
);

// ===== Enrollments =====

r.get(
  '/enrollments',
  // requireAuth,
  // requirePermission('academic.enrollments.read.school'),
  async (_req, res) => {
    const list = await enrRepo().find({ order: { enrollmentId: 'DESC' } });
    res.json(list);
  }
);

r.post(
  '/enrollments',
  // requireAuth,
  // requirePermission('academic.enrollments.create'),
  async (req, res) => {
    const p = enrollSchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: p.error.flatten() });

    try {
      const saved = await enrRepo().save(enrRepo().create(p.data));
      res.status(201).json(saved);
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.includes('UNIQUE') || msg.includes('UQ_') || msg.includes('IX_Enrollment'))
        return res.status(409).json({ error: 'El estudiante ya está matriculado en ese año' });
      return res.status(500).json({ error: 'Error al matricular' });
    }
  }
);

export default r;
