import {
  IsOptional,
  IsString,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
