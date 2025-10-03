import { Entity, PrimaryColumn } from 'typeorm';

@Entity('UserRole')
export class UserRole {
  @PrimaryColumn() userId!: number;
  @PrimaryColumn() roleId!: number;
}
