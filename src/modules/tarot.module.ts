import { Module } from '@nestjs/common';
import { TarotController } from 'src/controllers/tarot.controller';
import { OpenAIModule } from './openai.module';
import { TarotService } from 'src/services/tarot.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [TarotController],
  providers: [TarotService],
})
export class TarotModule {}
