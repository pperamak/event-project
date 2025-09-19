import { z } from 'zod';
import { userSchema } from '../schemas/user.schema.js';

export type UserAttributes = z.infer<typeof userSchema>;
