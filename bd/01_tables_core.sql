-- =============================================
-- 01_tables_core.sql
-- Tablas base: Users + Académico
-- Todas con INT IDENTITY y DATETIME2
-- =============================================

USE erp_jb;
GO

-- ====================
-- USERS (solo crear si no existe para NO perder datos)
IF OBJECT_ID('dbo.Users','U') IS NULL
BEGIN
  CREATE TABLE dbo.Users (
    userId       INT IDENTITY(1,1) PRIMARY KEY,
    firstName    VARCHAR(60)  NOT NULL,
    lastName     VARCHAR(80)  NOT NULL,
    email        VARCHAR(120) NOT NULL UNIQUE,
    isActive     BIT          NOT NULL DEFAULT(1),
    createdAt    DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
    updatedAt    DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
  );
END
GO

-- ====================
-- ACADÉMICO (estructura base para matrícula)
-- ====================

IF OBJECT_ID('dbo.AcademicYear','U') IS NOT NULL DROP TABLE dbo.AcademicYear;
CREATE TABLE dbo.AcademicYear (
  yearId     INT IDENTITY(1,1) PRIMARY KEY,
  name       VARCHAR(20)   NOT NULL,        -- '2025'
  startDate  DATE          NOT NULL,
  endDate    DATE          NOT NULL,
  isActive   BIT           NOT NULL DEFAULT(0),
  createdAt  DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID('dbo.Level','U') IS NOT NULL DROP TABLE dbo.Level;
CREATE TABLE dbo.Level (
  levelId    INT IDENTITY(1,1) PRIMARY KEY,
  name       VARCHAR(30) NOT NULL           -- Inicial | Primaria | Secundaria
);

IF OBJECT_ID('dbo.GradeLevel','U') IS NOT NULL DROP TABLE dbo.GradeLevel;
CREATE TABLE dbo.GradeLevel (
  gradeLevelId INT IDENTITY(1,1) PRIMARY KEY,
  levelId      INT NOT NULL FOREIGN KEY REFERENCES dbo.Level(levelId),
  name         VARCHAR(30) NOT NULL,        -- 1ro, 2do, ...
  orderNo      INT NOT NULL                 -- para ordenar grados por nivel
);

IF OBJECT_ID('dbo.Section','U') IS NOT NULL DROP TABLE dbo.Section;
CREATE TABLE dbo.Section (
  sectionId    INT IDENTITY(1,1) PRIMARY KEY,
  gradeLevelId INT NOT NULL FOREIGN KEY REFERENCES dbo.GradeLevel(gradeLevelId),
  code         VARCHAR(10) NOT NULL,        -- A, B, C
  capacity     INT NOT NULL DEFAULT(35)
);

IF OBJECT_ID('dbo.Student','U') IS NOT NULL DROP TABLE dbo.Student;
CREATE TABLE dbo.Student (
  studentId   INT IDENTITY(1,1) PRIMARY KEY,
  firstName   VARCHAR(60) NOT NULL,
  lastName    VARCHAR(80) NOT NULL,
  dni         CHAR(8)     NOT NULL UNIQUE,
  birthDate   DATE        NOT NULL,
  address     VARCHAR(255) NULL,
  status      VARCHAR(20) NOT NULL DEFAULT('activo') CHECK (status IN ('activo','inactivo','trasladado')),
  createdAt   DATETIME2   NOT NULL DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID('dbo.Enrollment','U') IS NOT NULL DROP TABLE dbo.Enrollment;
CREATE TABLE dbo.Enrollment (
  enrollmentId INT IDENTITY(1,1) PRIMARY KEY,
  yearId       INT NOT NULL FOREIGN KEY REFERENCES dbo.AcademicYear(yearId),
  studentId    INT NOT NULL FOREIGN KEY REFERENCES dbo.Student(studentId),
  sectionId    INT NOT NULL FOREIGN KEY REFERENCES dbo.Section(sectionId),
  enrolledAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  UNIQUE(yearId, studentId)   -- un estudiante por año
);
GO
PRINT '✅ Tablas core creadas: Users + Académico';
GO
-- =============================================
-- Puedes ejecutar este script una sola vez para crear las tablas base.
-- Luego ejecuta los scripts 02_rbac.sql, 03_indexes.sql y 04_seed_demo.sql en ese orden.
-- =============================================
