import { Controller, Get } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response.interface';
import { ReadResponse } from 'src/schemas/service/read.schema';
import { TarotService } from 'src/services/tarot.service';

@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Get('read')
  async readTarot(): Promise<ResponseData<ReadResponse>> {
    const result = await this.tarotService.readTarot();
    return {
      message: 'success',
      data: result,
    };
  }
}
