import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: number;
      email: string;
      roles: string[];
      perms: string[];
    };
  }
}
