import { z } from 'zod';
import { userInfoSchema } from '../user/user_info.schema';
import {
  arcanaCardSchema,
  arcanaCardWithoutImageSchema,
} from '../arcana/arcana';

export const todayOpenAIRequestSchema = z.object({
  card: arcanaCardWithoutImageSchema,
  userInfo: userInfoSchema,
});

export type TodayOpenAIRequest = z.infer<typeof todayOpenAIRequestSchema>;

export const todayOpenAIResponseSchema = z.object({
  description: z.string().min(1),
});

export type TodayOpenAIResponse = z.infer<typeof todayOpenAIResponseSchema>;

export const todayRequestSchema = z.object({
  card: arcanaCardSchema,
  userInfo: userInfoSchema,
});

export type TodayRequest = z.infer<typeof todayRequestSchema>;
