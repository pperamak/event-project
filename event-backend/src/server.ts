import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from 'graphql-tools';
import http from 'http';
import cors from 'cors';
import express from 'express';
import { formatGraphQLError } from './util/errorFormatter.js';
import { unknownEndpoint } from './middleware/unknownEndpoint.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectToDatabase } from './util/db.js';
import { typeDefs } from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

export async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  await connectToDatabase();

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: formatGraphQLError
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, { }),
  );

  app.use(unknownEndpoint);
  app.use(errorHandler);

  return { app, httpServer, server };
}