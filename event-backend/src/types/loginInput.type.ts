import { z } from 'zod';
import { loginInputSchema } from '../schemas/loginInput.schema.js';

export type LoginInput = z.infer<typeof loginInputSchema>;