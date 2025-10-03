import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../../config/data-source';
import User from './user.entity';

const router = Router();
const repo = () => AppDataSource.getRepository(User);

const schema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  email:     z.string().email(),
});

router.get('/', async (_req, res) => {
  const users = await repo().find({ order: { userId: 'DESC' } });
  res.json(users);
});

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (await repo().exists({ where: { email: parsed.data.email } }))
    return res.status(409).json({ error: 'Email ya registrado' });

  const saved = await repo().save(repo().create(parsed.data));
  res.status(201).json(saved);
});

export default router;
