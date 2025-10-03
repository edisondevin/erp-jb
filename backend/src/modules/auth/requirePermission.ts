import { Request, Response, NextFunction } from 'express';

export function requirePermission(...codes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { roles?: string[], perms?: string[] };
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (user.roles?.includes('SUPER_ADMIN')) return next();
    const granted = new Set(user.perms || []);
    const ok = codes.every(c => granted.has(c));
    if (!ok) return res.status(403).json({ error: 'Forbidden', need: codes });
    next();
  };
}
