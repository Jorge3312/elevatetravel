import { IsString, MaxLength, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateVisaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsUUID()
  destination_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  visa_type?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  photo_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}