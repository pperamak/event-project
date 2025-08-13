import dotenv from 'dotenv';
dotenv.config();
import { envSchema } from '../schemas/env.schema';


const env = envSchema.parse(process.env);

export const DATABASE_URL = env.DATABASE_URL;
export const SECRET = env.SECRET;
/*
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const secret = process.env.SECRET;
if (!secret) {
  throw new Error('SECRET environment variable is not set');
}
export const SECRET: string = secret;
export const DATABASE_URL = dbUrl;*/
export const PORT: number = Number(process.env.PORT) || 3000;
