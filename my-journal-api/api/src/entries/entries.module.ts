import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';

@Module({
  imports: [AuthModule],   
  providers: [EntriesService],
  controllers: [EntriesController],
})
export class EntriesModule {}
