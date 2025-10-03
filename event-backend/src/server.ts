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
import jwt from "jsonwebtoken";
import { SECRET } from './util/config.js';
import User from './models/user.js';
import { JwtPayload } from 'jsonwebtoken';
import { MyContext } from './types/context.type.js';
import { GraphQLError } from 'graphql';

interface JwtPayloadWithId extends JwtPayload {
  id: number;
  email: string;
}

export async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  await connectToDatabase();

  const server = new ApolloServer<MyContext>({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: formatGraphQLError
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> =>{
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')){
          try {
            const decodedToken = jwt.verify(auth.substring(7), SECRET) as JwtPayloadWithId;
            const currentUser = await User.findByPk(decodedToken.id);
            return { currentUser };
          }catch (_err){
             throw new GraphQLError("Invalid token", {
                extensions: { code: "UNAUTHENTICATED" },
            });           
          }
        }
        return { currentUser: null};
      }
     }),
  );

  app.use(unknownEndpoint);
  app.use(errorHandler);

  return { app, httpServer, server };
}