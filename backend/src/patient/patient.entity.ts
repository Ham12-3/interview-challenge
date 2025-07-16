import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assignments: Relation<Assignment[]>;
}
