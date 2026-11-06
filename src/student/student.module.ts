import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StudentsService } from './student.service';
import { StudentsController } from './student.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}