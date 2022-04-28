import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import http from 'http';

//mongo
import { MongoClient } from 'mongodb';
import * as bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

//expressa
const app = express();
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function startApolloServer(typeDefs, resolvers) {
  const client = new MongoClient("mongodb+srv://Velmarshal:pepsi@cluster0.xjn0f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  await client.connect();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return {
        db: client.db("velmarshal")
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  console.log("server starting");
  server.applyMiddleware({ app });

  httpServer.listen({ port: port });

  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
}
startApolloServer(typeDefs, resolvers);