import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validator: z.ZodType) {}
  async transform(value: unknown): Promise<z.infer<typeof this.validator>> {
    return await this.validator.parseAsync(value).catch((error) => {
      Logger.error(
        `ZodValidationPipe: Validation failed for value ${JSON.stringify(
          value,
        )}: ${error}`,
        'ZodValidationPipe',
      );
      throw new BadRequestException('Validation failed');
    });
  }
}
