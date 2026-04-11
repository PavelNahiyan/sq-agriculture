import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '@/common/constants';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@sqagriculture.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  password: string;
}

export class RegisterDto {
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

export class RefreshTokenDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiProperty({ minLength: 6, maxLength: 100 })
  newPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  @ApiProperty()
  token: string;
}

export class ResendVerificationDto {
  @IsString()
  @ApiProperty()
  userId: string;
}

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
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class ProfileResponseDto extends UserResponseDto {}