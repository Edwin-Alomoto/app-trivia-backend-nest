import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthGuard } from './infrastructure/controllers/guards/auth.guard';
import { RolesGuard } from './infrastructure/controllers/guards/roles.guard';
import { PrismaModule } from '@MR_CHANGO/shared/database/prisma.module';
import { LoggerService } from '@MR_CHANGO/shared/logger/logger.service';
import { EmailModule } from '@MR_CHANGO/shared/email/email.module';
import { AuthRepositoryAdapter } from './infrastructure/adapters/persistence/auth-repository.adapter';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    RolesGuard,
    LoggerService,
    {
      provide: 'AuthRepositoryPort',
      useClass: AuthRepositoryAdapter,
    },
  ],
  exports: [AuthService, AuthGuard, RolesGuard, LoggerService],
})
export class AuthModule {}
