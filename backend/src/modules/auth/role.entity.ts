import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Role')
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn() roleId!: number;
  @Column({ length: 40 }) name!: string;
  @Column({ type: 'nvarchar', length: 120, nullable: true }) description?: string;
}
