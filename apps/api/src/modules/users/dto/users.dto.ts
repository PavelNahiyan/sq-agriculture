import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role, RoleType } from '@/common/constants';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiProperty({ minLength: 6, maxLength: 100 })
  password: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  name: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  nameBn?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 20 })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  role?: RoleType;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ minLength: 6, maxLength: 100 })
  password?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  nameBn?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 20 })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  role?: RoleType;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;
}

export class UserQueryDto {
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
  role?: RoleType;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  isActive?: boolean;
}

// Response DTOs
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  nameBn?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({ type: 'string' })
  role: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
