import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import http from 'http';
/*
prebaci da se poziva na id a ne name
middleware
apollo graphql
*/
//mongo
import { MongoClient } from 'mongodb';
import * as bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const charactersCollection = "charactersTest";
const playersCollection = "playersTest";
const itemsCollection = "itemsTest";
const databaseName = "velmarshal";


//expressa
const app = express();
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.listen(port, () => {})

async function startApolloServer(typeDefs, resolvers) {
  const client = new MongoClient("mongodb://localhost:27017/dndbackend?retryWrites=true&w=majority");
  await client.connect();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return {
        db: client.db('dndbackend')
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
//
