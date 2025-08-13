import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  passwordHash: z.string(),
});