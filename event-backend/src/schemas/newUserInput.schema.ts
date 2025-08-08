import { z } from 'zod';

export const newUserInputSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
});