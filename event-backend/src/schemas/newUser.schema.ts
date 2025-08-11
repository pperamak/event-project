import { z } from 'zod';

export const newUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  passwordHash: z.string()
});