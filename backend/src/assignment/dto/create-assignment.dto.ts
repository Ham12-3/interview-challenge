import { IsNumber, IsDateString, Min, Max, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
  @IsNumber()
  @IsPositive()
  patientId: number;

  @IsNumber()
  @IsPositive()
  medicationId: number;

  @IsDateString()
  startDate: string;

  @IsNumber()
  @Min(1)
  @Max(365)
  days: number;
}
