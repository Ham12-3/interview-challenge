import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.assignments)
  @JoinColumn({ name: 'patientId' })
  patient: Relation<Patient>;

  @Column()
  patientId: number;

  @ManyToOne(() => Medication, (medication) => medication.assignments)
  @JoinColumn({ name: 'medicationId' })
  medication: Relation<Medication>;

  @Column()
  medicationId: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  days: number;
}
