import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Student')
@Unique(['dni'])
export class Student {
  @PrimaryGeneratedColumn() studentId!: number;
  @Column({ length: 60 }) firstName!: string;
  @Column({ length: 80 }) lastName!: string;
  @Column({ length: 8 })  dni!: string;
  @Column({ type: 'date' }) birthDate!: string;
  @Column({ length: 255, nullable: true }) address?: string;
  @Column({ length: 20, default: 'activo' }) status!: string;
  @CreateDateColumn({ type: 'datetime2' }) createdAt!: Date;
}

