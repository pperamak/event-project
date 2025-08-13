import { z } from 'zod';
import { userSchema } from '../schemas/user.schema';

export type UserAttributes = z.infer<typeof userSchema>;
