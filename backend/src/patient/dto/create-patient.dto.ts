import { IsString, IsDateString, Length, Matches } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsDateString()
  dateOfBirth: string;
}
