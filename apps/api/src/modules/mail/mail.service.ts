import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private compileTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    
    try {
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      this.logger.warn(`Template ${templateName} not found, using default`);
      return this.getDefaultTemplate(templateName, context);
    }
  }

  private getDefaultTemplate(template: string, context: Record<string, any>): string {
    const templates: Record<string, string> = {
      welcome: `<h1>Welcome ${context.name}!</h1><p>Thank you for registering with SQ Agriculture.</p>`,
      passwordReset: `<h1>Password Reset</h1><p>Click here to reset your password: ${context.resetUrl}</p>`,
      emailVerification: `<h1>Verify Your Email</h1><p>Click here to verify your email: ${context.verifyUrl}</p>`,
    };
    return templates[template] || '<p>Email content</p>';
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const html = this.compileTemplate(options.template, options.context);

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM', 'noreply@sqagriculture.com'),
      to: options.to,
      subject: options.subject,
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to SQ Agriculture',
      template: 'welcome',
      context: { name },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('APP_URL')}/reset-password?token=${resetToken}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      context: { resetUrl },
    });
  }

  async sendVerificationEmail(email: string, verifyToken: string): Promise<void> {
    const verifyUrl = `${this.configService.get<string>('APP_URL')}/verify-email?token=${verifyToken}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      template: 'emailVerification',
      context: { verifyUrl },
    });
  }
}
