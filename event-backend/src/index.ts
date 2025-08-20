//import app from "./app";
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { makeExecutableSchema } from 'graphql-tools';
import { PORT } from './util/config';
import express from 'express';
//import userRouter from './routes/users';
//import loginRouter from './routes/login';
import { unknownEndpoint } from './middleware/unknownEndpoint';
import { errorHandler } from './middleware/errorHandler';
import { connectToDatabase } from './util/db';
import { typeDefs } from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
//const app = express();
//app.use(express.json());

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  await connectToDatabase();

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  
  await server.start();
  

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {  }),
  );

  app.use(unknownEndpoint);
  app.use(errorHandler);

  httpServer.listen(PORT, () =>
    console.log(`Server is now running port ${PORT}/graphql`)
  );
};

start().catch((err) => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});


//const PORT = 3000;
/*
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
});
*/