import { Router } from 'express';
import { signAccess, signRefresh } from './jwt';
import { getRolesAndPerms, getUserByEmail, validatePassword } from './auth.service';
import { requireAuth } from './requireAuth';
import * as jwt from 'jsonwebtoken';


const r = Router();
// Rutas públicas

r.get('/ping', (_req, res) => res.json({ ok: true, msg: 'auth alive' }));
r.get('/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json(user);
});

// Refrescar token

r.post('/login', async (req, res) => {
  try {
    console.log('[LOGIN] body:', req.body);

    const { email, password } = req.body || {};
    if (!email || !password) {
      console.log('[LOGIN] faltan credenciales');
      return res.status(400).json({ error: 'email y password requeridos' });
    }

    const user = await getUserByEmail(email);
    console.log('[LOGIN] user:', user?.userId);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await validatePassword(password, (user as any).passwordHash || null);
    console.log('[LOGIN] password ok?', ok);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const { roles, perms } = await getRolesAndPerms(user.userId);
    console.log('[LOGIN] roles:', roles, 'perms:', perms);

    const access = signAccess({ sub: user.userId, email: user.email, roles, perms });
    const refresh = signRefresh({ sub: user.userId });

    res.json({ accessToken: access, refreshToken: refresh, roles, perms });
  } catch (err) {
    console.error('[LOGIN] ERROR:', err);
    res.status(500).json({ error: 'LOGIN_ERROR', detail: String(err) });
  }
});

// debug para verificar que el body llega
r.post('/echo', (req, res) => res.json({ got: req.body }));

export default r;
