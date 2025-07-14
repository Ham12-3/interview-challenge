import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Patient', 'assignments')
  @JoinColumn({ name: 'patientId' })
  patient: any;

  @Column()
  patientId: number;

  @ManyToOne('Medication', 'assignments')
  @JoinColumn({ name: 'medicationId' })
  medication: any;

  @Column()
  medicationId: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  days: number;
}
