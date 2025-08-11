import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const DATABASE_URL = dbUrl;
export const PORT: number = Number(process.env.PORT) || 3000;
