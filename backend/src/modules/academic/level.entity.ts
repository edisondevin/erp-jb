import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Level')
export class Level {
  @PrimaryGeneratedColumn() levelId!: number;
  @Column({ length: 30 }) name!: string;      // Inicial | Primaria | Secundaria
}
