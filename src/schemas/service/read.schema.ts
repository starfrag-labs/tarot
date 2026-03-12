import { z } from 'zod';

export const readResponseSchema = z.object({
  title: z.string().min(1),
  titleKR: z.string().min(1),
  keywords: z.array(z.string()).min(1),
  advice: z.string().min(1),
});

export type ReadResponse = z.infer<typeof readResponseSchema>;

// 요청 없음 - 서버에서 랜덤 카드/키워드 선택
export const readRequestSchema = z.object({});

export type ReadRequest = z.infer<typeof readRequestSchema>;
