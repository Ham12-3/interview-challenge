import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      startDate: new Date(createAssignmentDto.startDate),
    });
    return this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      relations: ['patient', 'medication'],
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = await this.findOne(id);

    if (typeof updateAssignmentDto.patientId === 'number') {
      assignment.patientId = updateAssignmentDto.patientId;
    }
    if (typeof updateAssignmentDto.medicationId === 'number') {
      assignment.medicationId = updateAssignmentDto.medicationId;
    }
    if (typeof updateAssignmentDto.startDate === 'string') {
      assignment.startDate = new Date(updateAssignmentDto.startDate);
    }
    if (typeof updateAssignmentDto.days === 'number') {
      assignment.days = updateAssignmentDto.days;
    }

    return this.assignmentRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }

  async findAllWithRemainingDays(): Promise<any[]> {
    const assignments = await this.findAll();
    return assignments.map((assignment) => ({
      ...assignment,
      remainingDays: this.calculateRemainingDays(
        assignment.startDate,
        assignment.days,
      ),
    }));
  }

  async findOneWithRemainingDays(id: number): Promise<any> {
    const assignment = await this.findOne(id);
    return {
      ...assignment,
      remainingDays: this.calculateRemainingDays(
        assignment.startDate,
        assignment.days,
      ),
    };
  }

  calculateRemainingDays(startDate: Date, totalDays: number): number {
    const today = new Date();
    const start = new Date(startDate);

    // Reset time to avoid timezone issues
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    const elapsedDays = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const remainingDays = totalDays - elapsedDays;

    return Math.max(0, remainingDays);
  }
}
