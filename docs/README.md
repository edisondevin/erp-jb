
# ERP Jorge Basadre — Monorepo (Backend + Frontend)

## 📌 Estado actual (lo que ya funciona)

**Backend**
- Stack: **Node 18+**, **Express**, **TypeScript**, **TypeORM**, **SQL Server**.
- Configuración: `.env` con variables de BD, JWT y CORS.
- Conexión a SQL Server funcionando (verificada en consola).
- **Autenticación**: `POST /api/v1/auth/login` y `POST /api/v1/auth/refresh` con **JWT** (access + refresh).
- **Autorización** por **roles** y **permisos** (middlewares `requireAuth` y `requirePermission`).
- **Módulos disponibles**:
  - Health: `GET /api/v1/health`.
  - Users (placeholder actual, entidad creada / router básico).
  - Academic:
    - `GET /api/v1/academic/years`
    - `GET /api/v1/academic/levels`
    - `GET /api/v1/academic/grade-levels`
    - `GET /api/v1/academic/sections`
  - Students:
    - `GET /api/v1/students`
    - `POST /api/v1/students` (valida DNI único, esquema Zod)
    - `GET /api/v1/students/enrollments`
    - `POST /api/v1/students/enrollments`
- **Scripts SQL** ejecutados con éxito: `00_init.sql`, `01_tables_core.sql`, `02_rbac.sql`, `03_indexes.sql`, `04_seed_demo.sql` (base de datos `erp_jb` creada y poblada).

**Frontend**
- Stack: **React + Vite + TypeScript + Tailwind v4**.
- **Login** funcional contra `/api/v1/auth/login` (usuario: `edison@example.com` / clave: `123456`).  
- **Intercepción Axios** con **refresh token** automático (`/auth/refresh`).
- **Rutas protegidas** con `ProtectedRoute`.
- **Permisos en UI** con `RequirePermission` y helpers `hasRole`/`can`.
- **Módulos UI**:
  - Dashboard (`/`)
  - Students list (`/students`) → `GET /api/v1/students`
  - Academic Years (`/academic/years`) → `GET /api/v1/academic/years`
  - Users (placeholder) (`/users`)
- **Layout**: Topbar + Sidebar responsivos con Tailwind.

---

## 🧭 Estructura de carpetas

```
erp-jb/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ config/
│  │  │  └─ data-source.ts
│  │  ├─ modules/
│  │  │  ├─ auth/
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ jwt.ts
│  │  │  │  ├─ requireAuth.ts
│  │  │  │  ├─ requirePermission.ts
│  │  │  │  ├─ role.entity.ts
│  │  │  │  ├─ permission.entity.ts
│  │  │  │  ├─ role-permission.entity.ts
│  │  │  │  └─ user-role.entity.ts
│  │  │  ├─ users/
│  │  │  │  ├─ user.entity.ts
│  │  │  │  └─ users.router.ts
│  │  │  ├─ academic/
│  │  │  │  ├─ year.entity.ts, level.entity.ts, grade-level.entity.ts, section.entity.ts
│  │  │  │  └─ academic.routes.ts
│  │  │  └─ students/
│  │  │     ├─ student.entity.ts, enrollment.entity.ts
│  │  │     └─ students.routes.ts
│  │  └─ ...
│  ├─ .env
│  └─ package.json
├─ bd/
│  ├─ 00_init.sql
│  ├─ 01_tables_core.sql
│  ├─ 02_rbac.sql
│  ├─ 03_indexes.sql
│  └─ 04_seed_demo.sql
└─ frontend/
   ├─ .env
   ├─ src/
   │  ├─ app/
   │  │  ├─ App.tsx, routes.tsx
   │  │  ├─ guard/ProtectedRoute.tsx, RequirePermission.tsx
   │  │  └─ layout/MainLayout.tsx, Sidebar.tsx, Topbar.tsx
   │  ├─ auth/
   │  │  ├─ AuthProvider.tsx
   │  │  └─ login/LoginPage.tsx
   │  ├─ modules/
   │  │  ├─ dashboard/DashboardPage.tsx
   │  │  ├─ students/StudentsList.tsx
   │  │  ├─ academic/YearsList.tsx
   │  │  └─ users/UsersList.tsx
   │  ├─ services/api.ts
   │  ├─ main.tsx
   │  └─ index.css
   ├─ postcss.config.js (Tailwind v4)
   ├─ tailwind.config.js
   ├─ vite.config.ts
   └─ package.json
```

---

## 🔐 Roles, permisos y módulos (requisitos institucionales)

**Roles Administrativos**
- Super Administrador (control total del sistema)
- Director
- Coordinador Académico
- Administrativo
- **Tutor** (añadido y soportado)

**Roles Educativos**
- Docente
- Auxiliar de Educación
- Psicólogo
- Bibliotecario
- Secretario

**Roles de Usuario Final**
- Estudiante
- Padre de Familia

**Módulos Principales**
1. **Gestión de Usuarios** (en progreso)
2. **Gestión Académica** (años, niveles, grados, secciones) ✅
3. **Sistema de Evaluaciones** (pendiente)
4. **Control de Asistencia** (pendiente)
5. **Biblioteca Digital** (pendiente)
6. **Seguimiento Psicopedagógico** (pendiente)
7. **Comunicaciones** (pendiente)

> **Permisos**: el backend define permisos jerárquicos (por ejemplo `academic.students.read.school`, `academic.students.create`, etc.).  
> En frontend, se consumen vía token (claims `roles` y `perms`) y se controlan con `RequirePermission` y helpers de `AuthProvider`.

---

## ⚙️ Backend — Configuración y ejecución

### 1) Variables de entorno (`backend/.env` ejemplo)
```
PORT=4000
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=tu_password
DB_NAME=erp_jb

JWT_SECRET=super-secret-jb-erp
JWT_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 2) Scripts SQL (orden de ejecución)
1. `00_init.sql` → crea BD `erp_jb` (una vez).
2. `01_tables_core.sql` → tablas base (users, academic, students, roles, permisos, relaciones).
3. `02_rbac.sql` → inserta roles y permisos institucionales (incluye **Tutor**).
4. `03_indexes.sql` → índices recomendados.
5. `04_seed_demo.sql` → datos de ejemplo (p. ej. usuario `edison@example.com` y académicos base).

> **Nota**: `synchronize` en TypeORM está **desactivado** en producción para evitar cambios automáticos peligrosos. Usar **migraciones** si se alteran entidades.

### 3) Levantar API
```bash
cd backend
npm i
npm run dev
# http://localhost:4000/api/v1
```

### 4) Endpoints implementados (resumen)
- `GET /api/v1/health`
- `POST /api/v1/auth/login`  → body: `{email, password}`
- `POST /api/v1/auth/refresh` → body: `{refreshToken}`
- `GET /api/v1/academic/years|levels|grade-levels|sections`
- `GET /api/v1/students`
- `POST /api/v1/students`
- `GET /api/v1/students/enrollments`
- `POST /api/v1/students/enrollments`

### 5) Probar con PowerShell (Invoke-RestMethod)
```powershell
# LOGIN
Invoke-RestMethod http://localhost:4000/api/v1/auth/login `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"edison@example.com","password":"123456"}'

# Con token
$token = "<ACCESS_TOKEN>"
Invoke-RestMethod http://localhost:4000/api/v1/students -Headers @{ Authorization = "Bearer $token" }
```

---

## 🎨 Frontend — Configuración y ejecución

### 1) Variables de entorno (`frontend/.env`)
```
VITE_API_URL=http://localhost:4000/api/v1
```

### 2) Instalar y correr
```bash
cd frontend
npm i
npm run dev
# http://localhost:5173
```

### 3) Tailwind v4 (importante)
- `postcss.config.js` debe usar **`@tailwindcss/postcss`**:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```
- En `src/index.css` deben estar:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4) Autenticación en UI
- Pantalla `/login` llama a `POST /auth/login`.
- Guarda `accessToken` y `refreshToken` en `localStorage`.
- Rutas protegidas con `ProtectedRoute`.
- Interceptor Axios renueva token de acceso con `POST /auth/refresh` si recibe `401`.

### 5) Módulos en UI (ahora)
- `/` Panel (cards placeholders).
- `/students` Lista de estudiantes (GET real).
- `/academic/years` Lista de años (GET real).
- `/users` Placeholder (próximo CRUD).

---

## ✅ Checklist de verificación rápida

- [x] BD `erp_jb` creada (`00_init.sql`).
- [x] Estructura y seed básicos (`01..04.sql`).
- [x] Backend levanta en `http://localhost:4000/api/v1`.
- [x] `POST /auth/login` devuelve `accessToken` y `refreshToken`.
- [x] Frontend levanta en `http://localhost:5173`.
- [x] Login OK con `edison@example.com / 123456`.
- [x] Navegación a **Estudiantes** y **Años Académicos** muestra datos reales.

---

## 🧪 Troubleshooting

- **PowerShell “Cannot GET /api/v1/auth/login”**  
  Es una ruta **POST**; usar `Invoke-RestMethod -Method Post` (ver ejemplos).

- **Tailwind error “use `@tailwindcss/postcss`”**  
  Instalar `@tailwindcss/postcss` y actualizar `postcss.config.js` como arriba.

- **401 en llamadas autenticadas**  
  Revisa que el token esté en `localStorage` y que `Authorization: Bearer <token>` se adjunte (Axios interceptor).  
  Confirma que `JWT_SECRET` del backend es el mismo usado para firmar/validar.

- **No salen estudiantes/años**  
  Backend debe estar corriendo y BD poblada; abre `http://localhost:4000/api/v1` para ver el índice con rutas expuestas.

---

## 🗺️ Roadmap (próximos pasos)

**Prioridad Alta**
1. **CRUD de Usuarios** (UI + API): crear/editar/bloquear; asignación de roles; reset de contraseña.
2. **Evaluaciones**: notas, tareas, exámenes (modelado y endpoints).
3. **Asistencia**: registro diario por curso + reportes + notificaciones a padres.
4. **Paginación/Filtros** en listados (students, years, users) + exportaciones CSV.

**Prioridad Media**
5. **Biblioteca**: catálogo, préstamos/devoluciones, recursos digitales.
6. **Seguimiento Psicopedagógico**: fichas, casos, reportes.
7. **Comunicaciones**: comunicados, notificaciones por rol, mensajería interna.
8. **Auditoría**: logs de acceso/acciones (tabla `audit_logs` + middleware).

**Infraestructura**
- **Migrations** TypeORM (no `synchronize` en prod).
- **PM2**/Docker para backend; **Nginx** o similar para servir frontend build.
- **Backups** automáticos de SQL Server.
- **.env** por entorno (`.env.production`, `.env.staging`).

**Seguridad**
- Cifrado de contraseñas con `bcrypt` (ya ok) y políticas de complejidad.
- Revocación de refresh tokens (lista de tokens válidos, invalidación por usuario).
- Rate limiting a `/auth/*`.
- Sanitización y validación con Zod/DTOs.

---

## 🧩 Decisiones de diseño

- **Mantener lo avanzado**: No se migró de stack; se consolidó sobre Express + TypeORM + SQL Server por compatibilidad y rapidez.
- **Versionado de API**: prefijo `/api/v1` para estabilidad.
- **RBAC**: roles + permisos atómicos para controlar granularidad (docente/tutor/administrativo, etc.).
- **Frontend desacoplado**: el cliente solo depende de `VITE_API_URL` y claims del JWT.

---

## 📎 Snippets útiles

**CORS múltiple origen (backend)**
```ts
const ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({ origin: ORIGINS.map(s => s.trim()), credentials: true }));
```

**Axios baseURL con fallback (frontend)**
```ts
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';
export const api = axios.create({ baseURL });
```

**Protección por permiso en UI**
```tsx
<RequirePermission perm="academic.students.create">
  <Button>Nuevo</Button>
</RequirePermission>
```

---

## 🧰 Requerimientos de entorno

- **Node.js** 18+
- **SQL Server** 2019+ (o compatible)
- **VS Code** con extensiones:
  - ESLint, Prettier (opcional)
  - REST Client / Thunder Client (para tests HTTP)
  - Tailwind CSS IntelliSense

---

## 👤 Acceso inicial

- Usuario: `edison@example.com`
- Contraseña: `123456`
- (Ajustable vía script temporal de hash o seed SQL)

---

## 📦 Deploy (visión general)

- **Backend**: PM2 con `ecosystem.config.js`, logs, `.env` seguros.
- **Frontend**: `npm run build` → servir estáticos con Nginx / IIS / Vercel (intranet).
- **BD**: accesos restringidos por IP, backups automáticos y monitoreo.

---

Si quieres, puedo incluir **CRUD completo de Usuarios** y **paginación** en Students en el siguiente sprint. Solo dime y lo anclo al repositorio.
