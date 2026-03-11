import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response.interface';
import { ZodValidationPipe } from 'src/pipes/zod_validation.pipe';
import {
  monthlyStudyRequestSchema,
  type MonthlyStudyRequest,
} from 'src/schemas/service/monthly_study.schema';
import {
  romanceRequestSchema,
  type RomanceRequest,
} from 'src/schemas/service/romance.schema';
import {
  todayRequestSchema,
  type TodayRequest,
} from 'src/schemas/service/today.schema';
import { MonthlyStudyTarotService } from 'src/services/tarot/monthly_study_tarot.service';
import { RomanceTarotService } from 'src/services/tarot/romance_tarot.service';
import { TodayTarotService } from 'src/services/tarot/today_tarot.service';

@Controller('read')
export class TarotController {
  constructor(
    private readonly todayTarotService: TodayTarotService,
    private readonly romanceTarotService: RomanceTarotService,
    private readonly monthlyStudyTarotService: MonthlyStudyTarotService,
  ) {}

  @Post('today')
  @HttpCode(200)
  async getTodayTarotMessage(
    @Body(new ZodValidationPipe(todayRequestSchema)) data: TodayRequest,
  ): Promise<
    ResponseData<{
      description: string;
    }>
  > {
    const result = await this.todayTarotService.readTarot(data);
    return {
      message: 'success',
      data: result,
    };
  }

  @Post('romance')
  @HttpCode(200)
  async getRomanceTarotMessage(
    @Body(new ZodValidationPipe(romanceRequestSchema)) data: RomanceRequest,
  ): Promise<
    ResponseData<{
      description: string;
    }>
  > {
    const result = await this.romanceTarotService.readTarot(data);
    return {
      message: 'success',
      data: result,
    };
  }

  @Post('monthly-study')
  @HttpCode(200)
  async getMonthlyStudyTarotMessage(
    @Body(new ZodValidationPipe(monthlyStudyRequestSchema))
    data: MonthlyStudyRequest,
  ): Promise<
    ResponseData<{
      currentState: string;
      obstacle: string;
      advice: string;
      summary: string;
    }>
  > {
    const result = await this.monthlyStudyTarotService.readTarot(data);
    return {
      message: 'success',
      data: result,
    };
  }
}
