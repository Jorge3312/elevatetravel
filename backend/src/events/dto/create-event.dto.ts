import { IsNotEmpty, IsString, MaxLength, IsUrl, IsBoolean, IsOptional, IsNumber, IsDateString, IsUUID, Min } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsUUID()
  destination_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  venue?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  base_price?: number;

  @IsOptional()
  @IsDateString()
  event_date?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  photo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pdf_url?: string;

  @IsOptional()
  includes?: string[];

  @IsOptional()
  not_includes?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}