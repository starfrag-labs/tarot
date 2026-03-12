import { Controller, HttpCode, Post } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response.interface';
import { ReadResponse } from 'src/schemas/service/read.schema';
import { TarotService } from 'src/services/tarot.service';

@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Post('read')
  @HttpCode(200)
  async readTarot(): Promise<ResponseData<ReadResponse>> {
    const result = await this.tarotService.readTarot();
    return {
      message: 'success',
      data: result,
    };
  }
}
