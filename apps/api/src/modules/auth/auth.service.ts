import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { User } from '@prisma/client';
import { Role } from '@/common/constants';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        nameBn: dto.nameBn,
        phone: dto.phone,
        role: dto.role || Role.USER,
      },
    });

    try {
      await this.mailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.log('Failed to send welcome email:', error);
    }

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: dto.refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      role: user.role,
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'If the email exists, a reset link will be sent' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { secret: this.configService.get<string>('JWT_RESET_SECRET', 'reset-secret'), expiresIn: '1h' },
    );

    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    try {
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.log('Failed to send password reset email:', error);
    }

    return { message: 'If the email exists, a reset link will be sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET', 'reset-secret'),
      });

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid token');
      }

      const resetRecord = await this.prisma.passwordResetToken.findFirst({
        where: { token, userId: payload.sub },
      });

      if (!resetRecord || resetRecord.expiresAt < new Date()) {
        throw new BadRequestException('Invalid or expired token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      await this.prisma.passwordResetToken.deleteMany({
        where: { userId: payload.sub },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_VERIFY_SECRET', 'verify-secret'),
      });

      if (payload.type !== 'email-verification') {
        throw new BadRequestException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { emailVerified: true },
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async resendVerification(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new ConflictException('Email already verified');
    }

    const verifyToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'email-verification' },
      { secret: this.configService.get<string>('JWT_VERIFY_SECRET', 'verify-secret'), expiresIn: '24h' },
    );

    try {
      await this.mailService.sendVerificationEmail(user.email, verifyToken);
    } catch (error) {
      console.log('Failed to send verification email:', error);
    }

    return { message: 'Verification email sent' };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  }

  private async generateTokens(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
