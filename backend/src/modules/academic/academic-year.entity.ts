import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AcademicYear')
export class AcademicYear {
  @PrimaryGeneratedColumn() yearId!: number;
  @Column({ length: 20 }) name!: string;       // '2025'
  @Column({ type: 'date' }) startDate!: string;
  @Column({ type: 'date' }) endDate!: string;
  @Column({ default: false }) isActive!: boolean;
  @CreateDateColumn({ type: 'datetime2' }) createdAt!: Date;
}
