import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsEmail,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LeadStatusType, UserTypeType } from '@/common/constants';

export class CreateLeadDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ maxLength: 20 })
  phone: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  company?: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  userType: UserTypeType;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  productInterest?: string;

  @IsString()
  @MaxLength(2000)
  @ApiProperty({ maxLength: 2000 })
  message: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  source?: string;
}

export class UpdateLeadDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 20 })
  phone?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  company?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  userType?: UserTypeType;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  productInterest?: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 2000 })
  message?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  status?: LeadStatusType;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 2000 })
  notes?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  assignedToId?: string;
}

export class LeadQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  status?: LeadStatusType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  userType?: UserTypeType;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  assignedToId?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  endDate?: string;
}

// Response DTOs
export class LeadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  company?: string;

  @ApiProperty({ type: 'string' })
  userType: UserTypeType;

  @ApiPropertyOptional()
  productInterest?: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: 'string' })
  status: LeadStatusType;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  source?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}
