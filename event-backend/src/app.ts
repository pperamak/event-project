/* eslint-disable @typescript-eslint/no-floating-promises */
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './routes/users';
import { Sequelize } from 'sequelize';
import { unknownEndpoint } from './middleware/unknownEndpoint';
import { errorHandler } from './middleware/errorHandler';
const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL!);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/users', userRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;