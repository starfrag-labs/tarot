import { z } from 'zod';
import { directionSchema } from './direction.schema';

export enum MajorArcanaEnum {
  THE_FOOL = 'theFool',
  THE_MAGICIAN = 'theMagician',
  THE_HIGH_PRIESTESS = 'theHighPriestess',
  THE_EMPRESS = 'theEmpress',
  THE_EMPEROR = 'theEmperor',
  THE_HIEROPHANT = 'theHierophant',
  THE_LOVERS = 'theLovers',
  THE_CHARIOT = 'theChariot',
  STRENGTH = 'strength',
  THE_HERMIT = 'theHermit',
  WHEEL_OF_FORTUNE = 'wheelOfFortune',
  JUSTICE = 'justice',
  THE_HANGED_MAN = 'theHangedMan',
  DEATH = 'death',
  TEMPERANCE = 'temperance',
  THE_DEVIL = 'theDevil',
  THE_TOWER = 'theTower',
  THE_STAR = 'theStar',
  THE_MOON = 'theMoon',
  THE_SUN = 'theSun',
  JUDGEMENT = 'judgement',
  THE_WORLD = 'theWorld',
}

export const majorArcanaSchema = z.nativeEnum(MajorArcanaEnum);

export type MajorArcana = z.infer<typeof majorArcanaSchema>;

export const majorArcanaCardSchema = z.object({
  card: majorArcanaSchema,
  image: z.string().min(1),
  direction: directionSchema,
});

export type MajorArcanaCard = z.infer<typeof majorArcanaCardSchema>;
