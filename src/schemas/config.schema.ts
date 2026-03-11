import { z } from 'zod';

const commonSystemMessage =
  '한국어로 서술해줘.' +
  '적절한 조언이 담긴 메시지를 서술해줘.' +
  '실제로 점술가가 말하는 것처럼 자연스럽게 설명해줘' +
  '직접적인 사용자의 정보는 사용하지마.' +
  '특수 문자 또한 사용하지마.' +
  '카드는 영어로 읽고 방향은 정방향, 역방향을 사용해 (eg. Five of Wands)' +
  '카드 설명시 카드의 영어이름을 말하고 정방향 또는 역방향의 의미를 알려줘' +
  '어투는 차갑게 해줘. ';

export const configSchema = z.object({
  server: z.object({
    nodeEnv: z
      .string()
      .min(1)
      .transform((x) => x.toLowerCase())
      .refine((x) => ['development', 'production', 'test'].includes(x), {
        message:
          'NODE_ENV must be one of "development", "production", or "test"',
      })
      .default('development'),
    port: z.number().int().positive().default(3000),
  }),
  eventBus: z.object({
    client: z.object({
      clientId: z.string().min(1).default('tarot.tarot-core'),
      brokers: z.array(z.string().min(1)),
    }),
    consumer: z.object({
      groupId: z.string().min(1).default('tarot.tarot-core'),
    }),
    dlt: z.object({
      retry: z.object({
        maxAttempts: z.number().int().nonnegative().default(3),
        delay: z.number().int().nonnegative().default(1000),
      }),
    }),
  }),
  openai: z.object({
    api_key: z.string().min(1),
    system_message: z.object({
      today: z
        .string()
        .min(1)
        .default(
          '주어지는 카드에 대하여 오늘의 타로 메시지를 서술해줘.' +
            commonSystemMessage,
        ),
      romance: z
        .string()
        .min(1)
        .default(
          '주어지는 카드에 대하여 로맨스 타로 메시지를 서술해줘.' +
            commonSystemMessage,
        ),
      monthly_study: z
        .string()
        .min(1)
        .default(
          '주어지는 카드에 대하여 월간 공부 타로 메시지를 서술해줘.' +
            'currentStateCard: 현재 상태에 대한 카드' +
            'obstacleCard: 현재 상태의 장애물' +
            'adviceCard: 앞으로의 조언' +
            commonSystemMessage,
        ),
    }),
  }),
  auth: z.object({
    gatewayJwtHeader: z.string().min(1).default('x-gateway-jwt'),
    gatewayJwtSecret: z.string().min(1),
  }),
});

export type Config = z.infer<typeof configSchema>;
