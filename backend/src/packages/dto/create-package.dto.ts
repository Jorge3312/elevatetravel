import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  destination_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string; // era "title"

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_from?: number; // era "price"

  @IsOptional()
  @IsNumber()
  days?: number;

  @IsOptional()
  @IsNumber()
  nights?: number;

  @IsOptional()
  @IsString()
  hotel?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(1000)
  photo_url?: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  includes?: string[];

  @IsOptional()
  not_includes?: string[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
