import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';

// Routers
import usersRouter from './modules/users/users.router';
import academicRoutes from './modules/academic/academic.routes';
import studentsRoutes from './modules/students/students.routes';
import authRoutes from './modules/auth/auth.routes';

dotenv.config();

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('✅ Conectado a SQL Server');

  const app = express();

  // CORS configurable por .env
  const ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
  app.use(cors({
    origin: ORIGINS.map(s => s.trim()),
    credentials: true,
  }));

  // Body parser
  app.use(express.json());

  // Health
  app.get('/api/v1/health', (_req, res) =>
    res.json({ ok: true, name: 'ERP JB API' })
  );

  // Índice
  app.get('/api/v1', (_req, res) => {
    res.json({
      ok: true,
      name: 'ERP JB API',
      endpoints: [
        '/api/v1/health',
        '/api/v1/auth/login',
        '/api/v1/auth/refresh',
        '/api/v1/users',
        '/api/v1/academic/years',
        '/api/v1/academic/levels',
        '/api/v1/academic/grade-levels',
        '/api/v1/academic/sections',
        '/api/v1/students',
        '/api/v1/students/enrollments',
      ],
    });
  });

  // Routers versionados
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/academic', academicRoutes);
  app.use('/api/v1/students', studentsRoutes);

  // 404 y manejador de errores (opcional pero recomendable)
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('❌', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  });

// error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('❌', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Servidor backend en http://localhost:${PORT}/api/v1`)
  );
}

bootstrap().catch((e) => {
  console.error('❌ Error al iniciar:', e);
  process.exit(1);
});
