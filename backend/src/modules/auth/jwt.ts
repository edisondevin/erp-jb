import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;
const accessExp = process.env.JWT_EXPIRES || '15m';
const refreshExp = process.env.JWT_REFRESH_EXPIRES || '7d';

export interface AccessPayload {
  sub: number;        // userId
  email: string;
  roles: string[];    // ['DOCENTE', ...]
  perms: string[];    // ['academic.students.read.school', ...]
}

const accessOpts = { expiresIn: accessExp as jwt.SignOptions['expiresIn'] };
const refreshOpts = { expiresIn: refreshExp as jwt.SignOptions['expiresIn'] };

export const signAccess = (p: AccessPayload) =>
  jwt.sign(p, secret, accessOpts);

export const verifyAccess = (token: string): AccessPayload => {
  const decoded = jwt.verify(token, secret); // string | JwtPayload
  if (typeof decoded === 'string' || !decoded) {
    throw new Error('Invalid token payload');
  }
  const { sub, email, roles, perms } = decoded as any;
  if (typeof sub !== 'number' || typeof email !== 'string') {
    throw new Error('Invalid token claims');
  }
  return {
    sub,
    email,
    roles: Array.isArray(roles) ? roles : [],
    perms: Array.isArray(perms) ? perms : [],
  };
};

export interface RefreshPayload {
  sub: number;
}

export const signRefresh = (p: RefreshPayload) =>
  jwt.sign(p, secret, refreshOpts);
