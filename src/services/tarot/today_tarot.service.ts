import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import {
  TodayOpenAIRequest,
  TodayOpenAIResponse,
} from 'src/schemas/service/today.schema';
import { PrismaService } from '../prisma.service';
import { LatestTarot, TarotType } from '@prisma/client';

@Injectable()
export class TodayTarotService {
  static version = 1.0;

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get existing data for today tarot
   * @param userUuid User UUID
   * @returns TodayOpenAIRequest | null
   */
  async getExistingData(userUuid: string): Promise<TodayOpenAIRequest | null> {
    const lastData = await this.prisma.latestTarot.findUnique({
      where: {
        userUuid_type: {
          userUuid,
          type: TarotType.TODAY,
        },
        version: TodayTarotService.version,
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });
    if (!lastData) {
      return null;
    }
    return lastData.data as TodayOpenAIRequest;
  }

  /**
   * Read today tarot message
   * @param data TodayOpenAIRequest
   * @returns TodayOpenAIResponse
   */
  async readTarot(data: TodayOpenAIRequest): Promise<TodayOpenAIResponse> {
    return this.openAIService.getTodayTarotMessage(data);
  }

  /**
   * Save today tarot message
   * @param data TodayOpenAIRequest
   * @returns LatestTarot
   */
  async saveTarot(data: {
    result: TodayOpenAIResponse;
    userUuid: string;
  }): Promise<LatestTarot> {
    return await this.prisma.latestTarot.upsert({
      where: {
        userUuid_type: {
          userUuid: data.userUuid,
          type: TarotType.TODAY,
        },
      },
      create: {
        userUuid: data.userUuid,
        type: TarotType.TODAY,
        version: TodayTarotService.version,
        data: data.result,
      },
      update: {
        data: data.result,
      },
    });
  }
}
