import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SectionsService } from './section.service';
import { SectionsController } from './section.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}