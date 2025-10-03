import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from './jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    (req as any).user = verifyAccess(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid/expired token' });
  }
}
