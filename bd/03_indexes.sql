-- =============================================
-- 03_indexes.sql
-- Índices recomendados para rendimiento
-- =============================================

USE erp_jb;
GO

-- Users
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Users_Email')
  CREATE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(email);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Users_IsActive')
  CREATE NONCLUSTERED INDEX IX_Users_IsActive ON dbo.Users(isActive);

-- Student
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Student_DNI')
  CREATE NONCLUSTERED INDEX IX_Student_DNI ON dbo.Student(dni);

-- AcademicYear activo
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_AcademicYear_isActive')
  CREATE NONCLUSTERED INDEX IX_AcademicYear_isActive ON dbo.AcademicYear(isActive);

-- Grade/Section lookups
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_GradeLevel_Level')
  CREATE NONCLUSTERED INDEX IX_GradeLevel_Level ON dbo.GradeLevel(levelId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Section_GradeLevel')
  CREATE NONCLUSTERED INDEX IX_Section_GradeLevel ON dbo.Section(gradeLevelId);

-- Enrollment consultas típicas
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Enrollment_Year')
  CREATE NONCLUSTERED INDEX IX_Enrollment_Year ON dbo.Enrollment(yearId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Enrollment_Student')
  CREATE NONCLUSTERED INDEX IX_Enrollment_Student ON dbo.Enrollment(studentId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Enrollment_Section')
  CREATE NONCLUSTERED INDEX IX_Enrollment_Section ON dbo.Enrollment(sectionId);

PRINT '✅ Índices creados';
-- =============================================
-- Puedes ajustar o añadir índices según las consultas más frecuentes en tu aplicación.
-- Revisa planes de ejecución para optimizar.
-- =============================================