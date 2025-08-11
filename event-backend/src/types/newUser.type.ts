import { z } from 'zod';
import { newUserSchema } from '../schemas/newUser.schema';

export type NewUser = z.infer<typeof newUserSchema>;