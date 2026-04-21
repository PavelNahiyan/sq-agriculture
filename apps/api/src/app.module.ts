import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LeadsModule } from './modules/leads/leads.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { DealersModule } from './modules/dealers/dealers.module';
import { BlogModule } from './modules/blog/blog.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { MailModule } from './modules/mail/mail.module';
import { HealthModule } from './modules/health/health.module';
import { ActivityModule } from './modules/activity/activity.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { PageConfigModule } from './modules/page-config/page-config.module';
import { FloatingButtonModule } from './modules/floating-button/floating-button.module';
import { SeedModule } from './modules/seed/seed.module';
import { SeedPartnersModule } from './modules/seed-partners/seed-partners.module';
import { SyncMaterialsService } from './scripts/sync-materials';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuditModule } from './common/audit.module';

import { PrismaModule } from './prisma/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),

    PrismaModule,
    AuditModule,

    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    LeadsModule,
    InquiriesModule,
    DealersModule,
    BlogModule,
    UploadsModule,
    NewsletterModule,
    WishlistModule,
    MailModule,
    HealthModule,
    ActivityModule,
    HomepageModule,
    PageConfigModule,
    FloatingButtonModule,
    SeedModule,
    SeedPartnersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    SyncMaterialsService,
  ],
})
export class AppModule {}