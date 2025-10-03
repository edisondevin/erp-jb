-- =============================================
-- 02_rbac.sql
-- RBAC normalizado + seeds de roles (tus roles + Tutor)
-- =============================================

USE erp_jb;
GO

IF OBJECT_ID('dbo.Role','U') IS NOT NULL DROP TABLE dbo.Role;
CREATE TABLE dbo.Role (
  roleId      INT IDENTITY(1,1) PRIMARY KEY,
  name        VARCHAR(40) NOT NULL UNIQUE,    -- SUPER_ADMIN, DIRECTOR, DOCENTE, ...
  description NVARCHAR(120) NULL
);

IF OBJECT_ID('dbo.Permission','U') IS NOT NULL DROP TABLE dbo.Permission;
CREATE TABLE dbo.Permission (
  permissionId INT IDENTITY(1,1) PRIMARY KEY,
  code         VARCHAR(100) NOT NULL UNIQUE,  -- academic.students.read.school, users.assignRole, ...
  description  NVARCHAR(150) NULL
);

IF OBJECT_ID('dbo.RolePermission','U') IS NOT NULL DROP TABLE dbo.RolePermission;
CREATE TABLE dbo.RolePermission (
  roleId       INT NOT NULL FOREIGN KEY REFERENCES dbo.Role(roleId),
  permissionId INT NOT NULL FOREIGN KEY REFERENCES dbo.Permission(permissionId),
  CONSTRAINT PK_RolePermission PRIMARY KEY (roleId, permissionId)
);

IF OBJECT_ID('dbo.UserRole','U') IS NOT NULL DROP TABLE dbo.UserRole;
CREATE TABLE dbo.UserRole (
  userId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(userId),
  roleId INT NOT NULL FOREIGN KEY REFERENCES dbo.Role(roleId),
  CONSTRAINT PK_UserRole PRIMARY KEY (userId, roleId)
);

-- ====== Seeds de Roles (tus roles + Tutor) ======
INSERT INTO dbo.Role(name, description) VALUES
('SUPER_ADMIN','Control total del sistema'),
('DIRECTOR','Gestión institucional y supervisión general'),
('COORDINADOR_ACADEMICO','Supervisión pedagógica y curricular'),
('ADMINISTRATIVO','Gestión de matrículas y documentos'),
('DOCENTE','Gestión de cursos, notas y material académico'),
('AUXILIAR','Control de asistencia y disciplina'),
('PSICOLOGO','Seguimiento socioemocional de estudiantes'),
('BIBLIOTECARIO','Gestión de recursos educativos'),
('SECRETARIO','Gestión documental y certificaciones'),
('TUTOR','Seguimiento de estudiantes de su sección'),
('ESTUDIANTE','Acceso a cursos y notas'),
('PADRE','Seguimiento del progreso académico');

-- ====== Seeds de Permisos mínimos (puedes ampliar) ======
INSERT INTO dbo.Permission(code, description) VALUES
('users.read.school','Ver usuarios'),
('users.create','Crear usuarios'),
('users.update','Actualizar usuarios'),
('users.assignRole','Asignar roles a usuarios'),

('academic.students.read.school','Ver estudiantes'),
('academic.students.create','Crear estudiantes'),
('academic.enrollments.manage','Gestionar matrículas'),
('academic.structure.manage','Años/Niveles/Grados/Secciones'),

('attendance.mark.section','Marcar asistencia en su sección'),
('attendance.read.school','Ver asistencia de toda la institución'),

('grades.assessments.create','Crear evaluaciones'),
('grades.scores.update.section','Registrar notas en su sección'),
('grades.reportCards.read.school','Ver boletas a nivel institución');

-- ====== Mapeos básicos por rol ======
-- Director
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r CROSS JOIN dbo.Permission p
WHERE r.name = 'DIRECTOR'
  AND p.code IN ('users.read.school','academic.students.read.school','academic.enrollments.manage','academic.structure.manage','grades.reportCards.read.school','attendance.read.school');

-- Coordinador Académico
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('academic.students.read.school','academic.enrollments.manage','academic.structure.manage','grades.assessments.create')
WHERE r.name = 'COORDINADOR_ACADEMICO';

-- Administrativo
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('academic.students.create','academic.enrollments.manage','users.read.school')
WHERE r.name = 'ADMINISTRATIVO';

-- Docente
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('attendance.mark.section','grades.assessments.create','grades.scores.update.section')
WHERE r.name = 'DOCENTE';

-- Auxiliar
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('attendance.mark.section')
WHERE r.name = 'AUXILIAR';

-- Psicólogo
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('academic.students.read.school')
WHERE r.name = 'PSICOLOGO';

-- Bibliotecario (ejemplo mínimo)
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('academic.students.read.school')
WHERE r.name = 'BIBLIOTECARIO';

-- Secretario (ejemplo mínimo)
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('users.read.school','academic.students.read.school')
WHERE r.name = 'SECRETARIO';

-- Tutor
INSERT INTO dbo.RolePermission(roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM dbo.Role r JOIN dbo.Permission p ON p.code IN ('attendance.mark.section','grades.reportCards.read.school','academic.students.read.school')
WHERE r.name = 'TUTOR';
GO

PRINT '✅ RBAC creado y seed básico cargado';
-- =============================================
-- Puedes ampliar permisos y roles según las necesidades específicas de tu institución.
-- Recuerda asignar roles a usuarios en la tabla UserRole.
-- =============================================

