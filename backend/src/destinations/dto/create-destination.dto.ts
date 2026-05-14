import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateDestinationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1000)
  photo_url: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
