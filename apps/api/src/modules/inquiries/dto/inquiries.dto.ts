import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserType, UserTypeType, InquiryStatusType } from '@/common/constants';

export class CreateInquiryDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  name: string;

  @IsString()
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
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  productInterest?: string;

  @IsString()
  @MaxLength(2000)
  @ApiProperty({ maxLength: 2000 })
  message: string;
}

export class UpdateInquiryDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @IsString()
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
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  productInterest?: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 2000 })
  message?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  status?: InquiryStatusType;

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

export class InquiryQueryDto {
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
  @ApiPropertyOptional({ default: 20 })
  limit?: number = 20;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  status?: InquiryStatusType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ enum: UserType })
  userType?: UserTypeType;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  endDate?: string;
}
