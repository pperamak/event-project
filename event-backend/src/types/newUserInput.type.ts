import { z } from 'zod';
import { newUserInputSchema } from '../schemas/newUserInput.schema';

export type NewUserInput = z.infer<typeof newUserInputSchema>;