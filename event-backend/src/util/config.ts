import dotenv from 'dotenv';
dotenv.config();
import { envSchema } from '../schemas/env.schema.js';


const env = envSchema.parse(process.env);

export const DATABASE_URL = 
  process.env.NODE_ENV === 'test'
    ? env.TEST_DATABASE_URL
    : env.DATABASE_URL;
    
export const SECRET = env.SECRET;

export const CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY;

export const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;

export const PORT: number = Number(process.env.PORT) || 3000;
