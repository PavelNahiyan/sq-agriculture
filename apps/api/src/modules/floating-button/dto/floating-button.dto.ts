import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateFloatingButtonDto {
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  showWhatsapp?: boolean;

  @IsBoolean()
  @IsOptional()
  showFacebook?: boolean;

  @IsBoolean()
  @IsOptional()
  showEmail?: boolean;

  @IsString()
  @IsOptional()
  position?: string;
}