import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// Users
import User from '../modules/users/user.entity';

// Academic
import { AcademicYear } from '../modules/academic/academic-year.entity';
import { Level } from '../modules/academic/level.entity';
import { GradeLevel } from '../modules/academic/grade-level.entity';
import { Section } from '../modules/academic/section.entity';

// Students
import { Student } from '../modules/students/student.entity';
import { Enrollment } from '../modules/students/enrollment.entity';

// RBAC
import { Role } from '../modules/auth/role.entity';
import { Permission } from '../modules/auth/permission.entity';
import { RolePermission } from '../modules/auth/role-permission.entity';
import { UserRole } from '../modules/auth/user-role.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 1433),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  options: { encrypt: false },
  synchronize: false,
  logging: false,
  entities: [
    User,
    AcademicYear, Level, GradeLevel, Section,
    Student, Enrollment,
    Role, Permission, RolePermission, UserRole,
  ],
});
