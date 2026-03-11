import { z } from 'zod';
import { directionSchema } from './direction.schema';

export enum MinorArcanaSuitEnum {
  WANDS = 'wands',
  CUPS = 'cups',
  SWORDS = 'swords',
  PENTACLES = 'pentacles',
}

export const minorArcanaSuitSchema = z.nativeEnum(MinorArcanaSuitEnum);

export type MinorArcanaSuit = z.infer<typeof minorArcanaSuitSchema>;

export enum MinorArcanaNumberEnum {
  ACE = 'ace',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five',
  SIX = 'six',
  SEVEN = 'seven',
  EIGHT = 'eight',
  NINE = 'nine',
  TEN = 'ten',
  PAGE = 'page',
  KNIGHT = 'knight',
  QUEEN = 'queen',
  KING = 'king',
}

export const minorArcanaNumberSchema = z.nativeEnum(MinorArcanaNumberEnum);

export type MinorArcanaNumber = z.infer<typeof minorArcanaNumberSchema>;

export const minorArcanaCardSchema = z.object({
  image: z.string().min(1),
  direction: directionSchema,
  suit: minorArcanaSuitSchema,
  number: minorArcanaNumberSchema,
});

export type MinorArcanaCard = z.infer<typeof minorArcanaCardSchema>;
