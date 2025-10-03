import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../../config/data-source';
import { AcademicYear } from './academic-year.entity';
import { Level } from './level.entity';
import { GradeLevel } from './grade-level.entity';
import { Section } from './section.entity';

const r = Router();

// Years
const yearRepo = () => AppDataSource.getRepository(AcademicYear);
const yearSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isActive: z.boolean().optional()
});
r.get('/years', async (_req,res)=> res.json(await yearRepo().find({ order: { yearId: 'DESC' } })));
r.post('/years', async (req,res)=>{
  const p = yearSchema.safeParse(req.body);
  if(!p.success) return res.status(400).json({error:p.error.flatten()});
  const saved = await yearRepo().save(yearRepo().create(p.data));
  res.status(201).json(saved);
});

// Levels
const levelRepo = () => AppDataSource.getRepository(Level);
const levelSchema = z.object({ name: z.string().min(1) });
r.get('/levels', async (_req,res)=> res.json(await levelRepo().find()));
r.post('/levels', async (req,res)=>{
  const p = levelSchema.safeParse(req.body);
  if(!p.success) return res.status(400).json({error:p.error.flatten()});
  res.status(201).json(await levelRepo().save(levelRepo().create(p.data)));
});

// GradeLevels
const gradeRepo = () => AppDataSource.getRepository(GradeLevel);
const gradeSchema = z.object({
  levelId: z.number().int().positive(),
  name: z.string().min(1),
  orderNo: z.number().int().positive()
});
r.get('/grade-levels', async (_req,res)=> res.json(await gradeRepo().find({ order: { levelId: 'ASC', orderNo: 'ASC' } })));
r.post('/grade-levels', async (req,res)=>{
  const p = gradeSchema.safeParse(req.body);
  if(!p.success) return res.status(400).json({error:p.error.flatten()});
  res.status(201).json(await gradeRepo().save(gradeRepo().create(p.data)));
});

// Sections
const sectionRepo = () => AppDataSource.getRepository(Section);
const sectionSchema = z.object({
  gradeLevelId: z.number().int().positive(),
  code: z.string().min(1).max(10),
  capacity: z.number().int().positive().default(35)
});
r.get('/sections', async (_req,res)=> res.json(await sectionRepo().find({ order: { gradeLevelId:'ASC', code:'ASC' } })));
r.post('/sections', async (req,res)=>{
  const p = sectionSchema.safeParse(req.body);
  if(!p.success) return res.status(400).json({error:p.error.flatten()});
  res.status(201).json(await sectionRepo().save(sectionRepo().create(p.data)));
});

export default r;
