

import { join } from "path";
import { error, success } from "consola";
import { PORT, IN_PROD } from "./config";
import { ApolloServer, PubSub } from "apollo-server-express";
import { schemaDirectives } from "./graphql/directives";
import express from "express";
import bodyParser from "body-parser";
import * as AppModels from "./models";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import AuthMiddleware from "./middlewares/auth";
import connectDB from "./config/db";
import http from "http";
import path from 'path'
import dotenv from 'dotenv'


const app = express();
dotenv.config()

// Add Authentication Middleware 
app.use(AuthMiddleware);
// // Remove x-powered-by header
app.disable("x-powered-by");
app.use(bodyParser.json());

// Set Express Static Directory
 app.use(
  '/app/userProfile',
  express.static(path.join(__dirname, 'uploads'))
 );
app.use(express.static(join(__dirname, "./uploads")));

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  uploads: true,
  context: ({ req }) => {
    return { req,pubsub, ...AppModels };
  },
  subscriptions: {
    path: "/graphql",
    onConnect: async (connectionParams, webSocket, context) => {
      console.log("connected");
    },
    onDisconnect: async () => {
      console.log("disc");
    },
  },
  tracing: true,
  // playground: IN_PROD,
  playground: true,
});

const startApp = async () => {
  connectDB();
  try {
    server.applyMiddleware({
      app,
      cors: true,
    });   
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`http://localhost:${PORT}${server.graphqlPath}`);
      // logger.log('info',"hello")
    });
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

startApp();

