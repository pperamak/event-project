//import app from "./app";
import { PORT } from "./util/config";
import express from 'express';
import userRouter from './routes/users';
import loginRouter from './routes/login';
import { unknownEndpoint } from './middleware/unknownEndpoint';
import { errorHandler } from './middleware/errorHandler';
import { connectToDatabase } from "./util/db";
const app = express();
app.use(express.json());

//const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
};

start().catch((err) => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});;
