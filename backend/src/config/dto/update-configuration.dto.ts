import { IsString, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class UpdateConfigurationDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instagram_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  facebook_url?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contact_email?: string;
}
