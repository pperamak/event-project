import express from 'express';
import userRouter from './routes/users';
const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/users', userRouter);

export default app;