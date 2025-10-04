USE erp_jb;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.delete')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.delete', 'Desactivar usuarios (soft delete)');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.read.detail')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.read.detail', 'Ver detalle completo de usuario');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.password.reset')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.password.reset', 'Resetear contraseña de usuario');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.create')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.create', 'Crear usuarios');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.update')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.update', 'Actualizar usuarios');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.read.school')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.read.school', 'Listar/leer usuarios de la institución');
IF NOT EXISTS (SELECT 1 FROM dbo.Permission WHERE code = 'users.assignRole')
    INSERT INTO dbo.Permission(code, [description]) VALUES ('users.assignRole', 'Asignar/Quitar roles a usuarios');

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes i 
  JOIN sys.tables t ON i.object_id = t.object_id
  WHERE t.name = 'Users' AND i.name = 'IX_Users_IsActive'
)
BEGIN
  CREATE INDEX IX_Users_IsActive ON dbo.Users(isActive);
END
GO

DECLARE @rid INT, @pid INT;

-- SUPER_ADMIN: users.*
SELECT @rid = roleId FROM dbo.Role WHERE name = 'SUPER_ADMIN';
IF @rid IS NOT NULL
BEGIN
  DECLARE cur CURSOR FOR SELECT permissionId FROM dbo.Permission WHERE code LIKE 'users.%';
  OPEN cur; FETCH NEXT FROM cur INTO @pid;
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.RolePermission WHERE roleId = @rid AND permissionId = @pid)
      INSERT INTO dbo.RolePermission(roleId, permissionId) VALUES(@rid, @pid);
    FETCH NEXT FROM cur INTO @pid;
  END
  CLOSE cur; DEALLOCATE cur;
END

-- DIRECTOR
SELECT @rid = roleId FROM dbo.Role WHERE name = 'DIRECTOR';
IF @rid IS NOT NULL
BEGIN
  DECLARE @codes TABLE(code NVARCHAR(100));
  INSERT INTO @codes(code) VALUES
    ('users.read.school'),('users.read.detail'),('users.create'),('users.update'),('users.assignRole');
  DECLARE c2 CURSOR FOR SELECT p.permissionId FROM dbo.Permission p JOIN @codes c ON p.code = c.code;
  OPEN c2; FETCH NEXT FROM c2 INTO @pid;
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.RolePermission WHERE roleId = @rid AND permissionId = @pid)
      INSERT INTO dbo.RolePermission(roleId, permissionId) VALUES(@rid, @pid);
    FETCH NEXT FROM c2 INTO @pid;
  END
  CLOSE c2; DEALLOCATE c2;
END

-- ADMINISTRATIVO
SELECT @rid = roleId FROM dbo.Role WHERE name = 'ADMINISTRATIVO';
IF @rid IS NOT NULL
BEGIN
  DECLARE @codes3 TABLE(code NVARCHAR(100));
  INSERT INTO @codes3(code) VALUES ('users.read.school'),('users.create');
  DECLARE c3 CURSOR FOR SELECT p.permissionId FROM dbo.Permission p JOIN @codes3 c ON p.code = c.code;
  OPEN c3; FETCH NEXT FROM c3 INTO @pid;
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.RolePermission WHERE roleId = @rid AND permissionId = @pid)
      INSERT INTO dbo.RolePermission(roleId, permissionId) VALUES(@rid, @pid);
    FETCH NEXT FROM c3 INTO @pid;
  END
  CLOSE c3; DEALLOCATE c3;
END

PRINT '✅ 05_users_permissions.sql aplicado';
GO
