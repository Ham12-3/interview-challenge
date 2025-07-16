import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['assignments', 'assignments.medication'],
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);

    if (typeof updatePatientDto.name === 'string') {
      patient.name = updatePatientDto.name;
    }
    if (typeof updatePatientDto.dateOfBirth === 'string') {
      patient.dateOfBirth = new Date(updatePatientDto.dateOfBirth);
    }

    return this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);

    // First remove all assignments for this patient
    if (patient.assignments && patient.assignments.length > 0) {
      await this.patientRepository
        .createQueryBuilder()
        .delete()
        .from('assignment')
        .where('patientId = :patientId', { patientId: id })
        .execute();
    }

    // Then remove the patient
    await this.patientRepository.remove(patient);
  }
}
