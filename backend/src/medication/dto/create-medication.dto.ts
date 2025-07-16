import { IsString, Length, Matches } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9\s\-.]+$/, {
    message:
      'Medication name must contain only letters, numbers, spaces, hyphens, and dots',
  })
  name: string;

  @IsString()
  @Length(1, 50)
  @Matches(/^[0-9]+(mg|g|ml|mcg)$/, {
    message:
      'Dosage must be in format: number followed by unit (mg, g, ml, mcg)',
  })
  dosage: string;

  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Frequency must contain only letters and spaces',
  })
  frequency: string;
}
