import { z } from 'zod';
import { newUserSchema } from '../schemas/newUser.schema.js';

export type NewUser = z.infer<typeof newUserSchema>;