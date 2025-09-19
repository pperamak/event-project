import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  TEST_DATABASE_URL: z.string().url(),
  SECRET: z.string().min(1),
});
