// backend/scripts/set-password.ts
import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '../src/config/data-source';
import User from '../src/modules/users/user.entity';

(async () => {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const email = 'edison@example.com';
  const plain = '123456';

  const u = await repo.findOne({ where: { email } });
  if (!u) {
    console.log('Usuario no encontrado');
    process.exit(1);
  }

  (u as any).passwordHash = bcrypt.hashSync(plain, 10);
  await repo.save(u);
  console.log('✅ passwordHash actualizado para', email);
  process.exit(0);
})();
