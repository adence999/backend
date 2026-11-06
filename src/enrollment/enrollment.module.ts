import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EnrollmentsService } from './enrollment.service';
import { EnrollmentsController } from './enrollment.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}