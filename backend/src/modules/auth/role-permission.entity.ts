import { Entity, PrimaryColumn } from 'typeorm';

@Entity('RolePermission')
export class RolePermission {
  @PrimaryColumn() roleId!: number;
  @PrimaryColumn() permissionId!: number;
}
