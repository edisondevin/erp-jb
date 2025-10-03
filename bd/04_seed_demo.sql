-- =============================================
-- 04_seed_demo.sql
-- Datos de ejemplo: año, niveles, grados, secciones y un usuario
-- =============================================

USE erp_jb;
GO

-- AÑO ESCOLAR
INSERT INTO dbo.AcademicYear(name, startDate, endDate, isActive)
VALUES ('2025','2025-03-01','2025-12-15',1);

-- NIVELES
INSERT INTO dbo.Level(name) VALUES ('Inicial'), ('Primaria'), ('Secundaria');

-- GRADOS (ejemplo para Primaria y Secundaria)
DECLARE @primaria INT = (SELECT levelId FROM dbo.Level WHERE name='Primaria');
DECLARE @secundaria INT = (SELECT levelId FROM dbo.Level WHERE name='Secundaria');

INSERT INTO dbo.GradeLevel(levelId, name, orderNo)
VALUES
(@primaria,'1ro',1),(@primaria,'2do',2),(@primaria,'3ro',3),(@primaria,'4to',4),(@primaria,'5to',5),(@primaria,'6to',6),
(@secundaria,'1ro',1),(@secundaria,'2do',2),(@secundaria,'3ro',3),(@secundaria,'4to',4),(@secundaria,'5to',5);

-- SECCIONES (A, B) para algunos grados
INSERT INTO dbo.Section(gradeLevelId, code, capacity)
SELECT gradeLevelId, 'A', 35 FROM dbo.GradeLevel WHERE name IN ('1ro','2do','3ro');
INSERT INTO dbo.Section(gradeLevelId, code, capacity)
SELECT gradeLevelId, 'B', 35 FROM dbo.GradeLevel WHERE name IN ('1ro','2do','3ro');

-- USUARIO DEMO
INSERT INTO dbo.Users(firstName,lastName,email,isActive)
VALUES ('Super','Admin','admin@jorgebasadre.edu.pe',1);

-- Rol SUPER_ADMIN para el usuario 1
DECLARE @userId INT = SCOPE_IDENTITY();
DECLARE @roleId INT = (SELECT roleId FROM dbo.Role WHERE name='SUPER_ADMIN');
INSERT INTO dbo.UserRole(userId, roleId) VALUES (@userId, @roleId);

PRINT '✅ Seeds de demo cargados';
-- =============================================
-- Puedes añadir más datos de prueba según necesites.
-- Recuerda cambiar la contraseña del usuario admin en tu aplicación.
-- =============================================