import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InstructorsService } from './instructor.service';
import { InstructorsController } from './instructor.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [InstructorsController],
  providers: [InstructorsService],
  exports: [InstructorsService],
})
export class InstructorsModule {}