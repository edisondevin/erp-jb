import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Level } from './level.entity';

@Entity('GradeLevel')
export class GradeLevel {
  @PrimaryGeneratedColumn() gradeLevelId!: number;

  @ManyToOne(() => Level, { eager: true })
  @JoinColumn({ name: 'levelId' })
  level!: Level;

  @Column() levelId!: number;
  @Column({ length: 30 }) name!: string;     // 1ro, 2do, ...
  @Column() orderNo!: number;
}

