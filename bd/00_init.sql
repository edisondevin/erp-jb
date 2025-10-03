-- =============================================
-- 00_init.sql
-- Crea la base de datos ERP y ajusta opciones
-- =============================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'erp_jb')
BEGIN
    CREATE DATABASE erp_jb
    COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

ALTER DATABASE erp_jb SET RECOVERY SIMPLE;
ALTER DATABASE erp_jb SET AUTO_CLOSE OFF;
ALTER DATABASE erp_jb SET AUTO_SHRINK OFF;
GO

PRINT '✅ Base de datos erp_jb lista';
GO
-- =============================================
-- Puedes ejecutar este script una sola vez para crear la base de datos.
-- Luego ejecuta los scripts 01_tables_core.sql, 02_rbac.sql, 03_indexes.sql y 04_seed_demo.sql en ese orden.
-- =============================================
