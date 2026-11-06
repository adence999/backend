import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RoomsService } from './room.service';
import { RoomsController } from './room.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}