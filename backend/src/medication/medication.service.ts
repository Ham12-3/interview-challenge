import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationRepository.create(createMedicationDto);
    return this.medicationRepository.save(medication);
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find({
      relations: ['assignments', 'assignments.patient'],
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.patient'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  async update(
    id: number,
    updateMedicationDto: UpdateMedicationDto,
  ): Promise<Medication> {
    const medication = await this.findOne(id);
    Object.assign(medication, updateMedicationDto);
    return this.medicationRepository.save(medication);
  }

  async remove(id: number): Promise<void> {
    const medication = await this.findOne(id);

    // First remove all assignments for this medication
    if (medication.assignments && medication.assignments.length > 0) {
      await this.medicationRepository
        .createQueryBuilder()
        .delete()
        .from('assignment')
        .where('medicationId = :medicationId', { medicationId: id })
        .execute();
    }

    // Then remove the medication
    await this.medicationRepository.remove(medication);
  }
}
