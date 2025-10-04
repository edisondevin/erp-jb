import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { AppDataSource } from '../src/config/data-source';
import User from '../src/modules/users/user.entity';
import { Role } from '../src/modules/auth/role.entity';
import { UserRole } from '../src/modules/auth/user-role.entity';

async function run() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);
  const urRepo   = AppDataSource.getRepository(UserRole);

  // Asegúrate de que estos roles EXISTEN en tu BD (vienen de 02_rbac.sql):
  const roleByName = async (name: string) =>
    roleRepo.findOne({ where: { name } as any });

  const roles = {
    SUPER_ADMIN: await roleByName('SUPER_ADMIN'),
    DIRECTOR: await roleByName('DIRECTOR'),
    ADMINISTRATIVO: await roleByName('ADMINISTRATIVO'),
    DOCENTE: await roleByName('DOCENTE'),
    AUXILIAR: await roleByName('AUXILIAR'),
    PSICOLOGO: await roleByName('PSICOLOGO'),
    BIBLIOTECARIO: await roleByName('BIBLIOTECARIO'),
    SECRETARIO: await roleByName('SECRETARIO'),
    ESTUDIANTE: await roleByName('ESTUDIANTE'),
    PADRE: await roleByName('PADRE'),
  };

  const users = [
    { firstName: 'Super', lastName: 'Admin', email: 'admin@jorgebasadre.edu.pe',    roles: ['SUPER_ADMIN'] },
    { firstName: 'Diana', lastName: 'Dirección', email: 'director@jorgebasadre.edu.pe', roles: ['DIRECTOR'] },
    { firstName: 'Alma',  lastName: 'Adm',      email: 'adm@jorgebasadre.edu.pe',       roles: ['ADMINISTRATIVO'] },
    { firstName: 'Carlos',lastName: 'Docente',  email: 'docente@jorgebasadre.edu.pe',   roles: ['DOCENTE'] },
    { firstName: 'Andrea',lastName: 'Aux',      email: 'aux@jorgebasadre.edu.pe',       roles: ['AUXILIAR'] },
    { firstName: 'Paola', lastName: 'Psico',    email: 'psico@jorgebasadre.edu.pe',     roles: ['PSICOLOGO'] },
    { firstName: 'Beto',  lastName: 'Books',    email: 'biblio@jorgebasadre.edu.pe',    roles: ['BIBLIOTECARIO'] },
    { firstName: 'Soledad',lastName:'Sec',      email: 'secretaria@jorgebasadre.edu.pe',roles: ['SECRETARIO'] },
    { firstName: 'Nadia', lastName: 'Est',      email: 'alumno@jorgebasadre.edu.pe',    roles: ['ESTUDIANTE'] },
    { firstName: 'Luis',  lastName: 'Padre',    email: 'padre@jorgebasadre.edu.pe',     roles: ['PADRE'] },
  ];

  for (const u of users) {
    let ent = await userRepo.findOne({ where: { email: u.email } });
    if (!ent) {
      ent = userRepo.create({
        firstName: u.firstName,
        lastName:  u.lastName,
        email:     u.email,
        isActive:  true,
        passwordHash: bcrypt.hashSync('123456', 10), // clave demo
      });
      ent = await userRepo.save(ent);
      console.log('✔ Usuario creado:', u.email);
    } else {
      console.log('↺ Usuario ya existía:', u.email);
    }

    // asignar roles
    await urRepo.delete({ userId: ent.userId } as any);
    for (const rn of u.roles) {
      const r = (roles as any)[rn];
      if (r) {
        const link = urRepo.create({ userId: ent.userId, roleId: r.roleId });
        await urRepo.save(link);
      }
    }
  }

  await AppDataSource.destroy();
  console.log('✅ Seed terminado. Todos con clave 123456');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
