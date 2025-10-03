// src/shared/hash.ts (opcional, por si quieres reutilizar)
import bcrypt from 'bcryptjs';
export const hash = (plain: string) => bcrypt.hashSync(plain, 10);
export const compare = (plain: string, hashed: string) => bcrypt.compareSync(plain, hashed);
