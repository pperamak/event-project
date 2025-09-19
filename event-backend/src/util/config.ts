import dotenv from 'dotenv';
dotenv.config();
import { envSchema } from '../schemas/env.schema.js';


const env = envSchema.parse(process.env);

export const DATABASE_URL = 
  process.env.NODE_ENV === 'test'
    ? env.TEST_DATABASE_URL
    : env.DATABASE_URL;
    
export const SECRET = env.SECRET;

export const PORT: number = Number(process.env.PORT) || 3000;
