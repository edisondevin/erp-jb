import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('Users')
export default class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ length: 60 })
  firstName!: string;

  @Column({ length: 80 })
  lastName!: string;

  @Column({ length: 120, unique: true })
  email!: string;

  @Column({ default: true })
  isActive!: boolean;

  // 👇 AÑADE ESTO
  @Column({ length: 255, nullable: true })
  passwordHash?: string;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;
}
