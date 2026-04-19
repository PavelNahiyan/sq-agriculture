import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdatePageConfigDto {
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @IsString()
  @IsOptional()
  heroSubtitle?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsString()
  @IsOptional()
  features?: string;

  @IsString()
  @IsOptional()
  customConfig?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreatePageConfigDto {
  @IsString()
  pageName: string;

  @IsString()
  @IsOptional()
  heroTitle?: string;

  @IsString()
  @IsOptional()
  heroSubtitle?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsString()
  @IsOptional()
  features?: string;

  @IsString()
  @IsOptional()
  customConfig?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}