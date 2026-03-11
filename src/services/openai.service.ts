import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ChatModel } from 'openai/resources';
import type { Config } from 'src/schemas/config.schema';
import type {
  MonthlyStudyOpenAIRequest,
  MonthlyStudyOpenAIResponse,
} from 'src/schemas/service/monthly_study.schema';
import { monthlyStudyOpenAIResponseSchema } from 'src/schemas/service/monthly_study.schema';
import type {
  RomanceOpenAIRequest,
  RomanceOpenAIResponse,
} from 'src/schemas/service/romance.schema';
import type {
  TodayOpenAIRequest,
  TodayOpenAIResponse,
} from 'src/schemas/service/today.schema';

@Injectable()
export class OpenAIService {
  private chatModel: ChatModel = 'gpt-4o-mini';

  private openAI: OpenAI;
  private openAIConfig: Config['openai'];

  constructor(private readonly config: ConfigService<Config, true>) {
    this.openAIConfig = this.config.get<Config['openai']>('openai');
  }

  onModuleInit() {
    this.openAI = new OpenAI({
      apiKey: this.openAIConfig.api_key,
    });
  }

  /**
   * Get today tarot message
   * @param request TodayOpenAIRequest
   * @returns TodayOpenAIResponse
   */
  async getTodayTarotMessage(
    request: TodayOpenAIRequest,
  ): Promise<TodayOpenAIResponse> {
    const response = await this.openAI.chat.completions.create({
      model: this.chatModel,
      messages: [
        {
          role: 'system',
          content: this.openAIConfig.system_message.today,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
    });

    if (!response.choices[0].message.content) {
      throw new InternalServerErrorException('OpenAI request failed');
    }

    return {
      description: response.choices[0].message.content,
    };
  }

  /**
   * Get romance tarot message
   * @param request RomanceOpenAIRequest
   * @returns RomanceOpenAIResponse
   */
  async getRomanceTarotMessage(
    request: RomanceOpenAIRequest,
  ): Promise<RomanceOpenAIResponse> {
    const response = await this.openAI.chat.completions.create({
      model: this.chatModel,
      messages: [
        {
          role: 'system',
          content: this.openAIConfig.system_message.romance,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
    });

    if (!response.choices[0].message.content) {
      throw new InternalServerErrorException('OpenAI request failed');
    }

    return {
      description: response.choices[0].message.content,
    };
  }

  /**
   * Get monthly study tarot message
   * @param request MonthlyStudyOpenAIRequest
   * @returns MonthlyStudyOpenAIResponse
   */
  async getMonthlyStudyTarotMessage(
    request: MonthlyStudyOpenAIRequest,
  ): Promise<MonthlyStudyOpenAIResponse> {
    const response = await this.openAI.chat.completions.parse({
      model: this.chatModel,
      messages: [
        {
          role: 'system',
          content: this.openAIConfig.system_message.monthly_study,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
      response_format: zodResponseFormat(
        monthlyStudyOpenAIResponseSchema,
        'MonthlyStudyOpenAIResponse',
      ),
    });

    if (!response.choices[0].message.parsed) {
      throw new InternalServerErrorException('OpenAI request failed');
    }

    return response.choices[0].message.parsed;
  }
}
