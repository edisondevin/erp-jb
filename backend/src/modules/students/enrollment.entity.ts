import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AcademicYear } from '../academic/academic-year.entity';
import { Student } from './student.entity';
import { Section } from '../academic/section.entity';

@Entity('Enrollment')
@Unique(['yearId','studentId'])
export class Enrollment {
  @PrimaryGeneratedColumn() enrollmentId!: number;

  @ManyToOne(() => AcademicYear, { eager: true })
  @JoinColumn({ name: 'yearId' })
  year!: AcademicYear;
  @Column() yearId!: number;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student!: Student;
  @Column() studentId!: number;

  @ManyToOne(() => Section, { eager: true })
  @JoinColumn({ name: 'sectionId' })
  section!: Section;
  @Column() sectionId!: number;

  @CreateDateColumn({ type: 'datetime2' }) enrolledAt!: Date;
}
// Un estudiante puede estar inscrito solo una vez por año académico
// Un estudiante puede cambiar de sección (sectionId) dentro del mismo año académico (yearId)
// La sección (sectionId) debe pertenecer al año académico (yearId)
// La capacidad de la sección (section.capacity) no debe ser excedida al inscribir un estudiante
// El estado del estudiante (student.status) debe ser 'activo' para inscribirlo
// El año académico (year.isActive) debe ser true para inscribir estudiantes
// La sección (section) debe pertenecer a un nivel y grado existente
// El estudiante (student) debe existir en la tabla Student
// El año académico (year) debe existir en la tabla AcademicYear
// La sección (section) debe existir en la tabla Section
// El nivel (level) debe existir en la tabla Level
// El grado (gradeLevel) debe existir en la tabla GradeLevel
// La inscripción (enrollment) debe registrar la fecha y hora de inscripción (enrolledAt)

