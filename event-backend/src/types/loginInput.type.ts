import { z } from 'zod';
import { loginInputSchema } from '../schemas/loginInput.schema';

export type LoginInput = z.infer<typeof loginInputSchema>;