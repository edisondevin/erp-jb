import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GradeLevel } from './grade-level.entity';

@Entity('Section')
export class Section {
  @PrimaryGeneratedColumn() sectionId!: number;

  @ManyToOne(() => GradeLevel, { eager: true })
  @JoinColumn({ name: 'gradeLevelId' })
  gradeLevel!: GradeLevel;

  @Column() gradeLevelId!: number;
  @Column({ length: 10 }) code!: string;     // A, B, ...
  @Column({ default: 35 }) capacity!: number;
}
