import {
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsPositive,
} from 'class-validator';

export class UpdateAssignmentDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  patientId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  medicationId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;
}
