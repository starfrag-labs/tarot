import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import type { Config } from './config/config.schema';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { PrismaExceptionFilter } from './filters/prisma_exception.filter';
import { ZodExceptionFilter } from './filters/zod_exception.filter';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Config, true>);

  // app kafka transporter
  const eventBusConfig = config.get('eventBus', { infer: true });
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: eventBusConfig.client.clientId,
        brokers: eventBusConfig.client.brokers,
      },
      consumer: {
        groupId: eventBusConfig.consumer.groupId,
        retry: {
          retries: 3,
          initialRetryTime: 300,
        },
      },
    },
  });

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(config.get('server').port);

  // Implement global exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );
}
bootstrap().catch(console.error);
