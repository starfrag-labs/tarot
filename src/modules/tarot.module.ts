import { Module } from '@nestjs/common';
import { TarotController } from 'src/controllers/tarot.controller';
import { OpenAIModule } from './openai.module';
import { TarotService } from 'src/services/tarot.service';

@Module({
  imports: [OpenAIModule],
  controllers: [TarotController],
  providers: [TarotService],
})
export class TarotModule {}
