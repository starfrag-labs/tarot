import { z } from 'zod';
import { userInfoSchema } from '../user/user_info.schema';
import {
  arcanaCardSchema,
  arcanaCardWithoutImageSchema,
} from '../arcana/arcana';

export const romanceOpenAIRequestSchema = z.object({
  card: arcanaCardWithoutImageSchema,
  userInfo: userInfoSchema,
});

export type RomanceOpenAIRequest = z.infer<typeof romanceOpenAIRequestSchema>;

export const romanceOpenAIResponseSchema = z.object({
  description: z.string().min(1),
});

export type RomanceOpenAIResponse = z.infer<typeof romanceOpenAIResponseSchema>;

export const romanceRequestSchema = z.object({
  card: arcanaCardSchema,
  userInfo: userInfoSchema,
});

export type RomanceRequest = z.infer<typeof romanceRequestSchema>;
