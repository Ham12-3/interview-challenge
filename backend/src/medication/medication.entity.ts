import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @OneToMany(() => Assignment, (assignment) => assignment.medication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assignments: Relation<Assignment[]>;
}
