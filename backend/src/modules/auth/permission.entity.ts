import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Permission')
@Unique(['code'])
export class Permission {
  @PrimaryGeneratedColumn() permissionId!: number;
  @Column({ length: 100 }) code!: string;
  @Column({ type: 'nvarchar', length: 150, nullable: true }) description?: string;
}
