import { z } from 'zod';
import { newUserInputSchema } from '../schemas/newUserInput.schema.js';

export type NewUserInput = z.infer<typeof newUserInputSchema>;