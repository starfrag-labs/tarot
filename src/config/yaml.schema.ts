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

// Base YAML schema (all fields optional with defaults)
export const yamlSchema = z.object({
  server: z.object({
    nodeEnv: z
      .string()
      .transform((x) => x.toLowerCase())
      .refine((x) => ['development', 'production', 'test'].includes(x))
      .default('development'),
    port: z.number().int().positive().default(3000),
  }),
  openai: z.object({
    apiKey: z.string().optional(),
    systemMessage: z.object({
      today: z
        .string()
        .default(
          '주어지는 카드에 대하여 오늘의 타로 메시지를 서술해줘.' +
            commonSystemMessage,
        ),
      romance: z
        .string()
        .default(
          '주어지는 카드에 대하여 로맨스 타로 메시지를 서술해줘.' +
            commonSystemMessage,
        ),
      monthlyStudy: z
        .string()
        .default(
          '주어지는 카드에 대하여 월간 공부 타로 메시지를 서술해줘.' +
            'currentStateCard: 현재 상태에 대한 카드' +
            'obstacleCard: 현재 상태의 장애물' +
            'adviceCard: 앞으로의 조언' +
            commonSystemMessage,
        ),
    }),
  }),
});

export type YamlConfig = z.infer<typeof yamlSchema>;
