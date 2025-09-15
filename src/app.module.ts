import { Module } from '@nestjs/common';
import { AuthModule } from './shared/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
