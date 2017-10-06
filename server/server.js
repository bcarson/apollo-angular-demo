import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { SubscriptionServer } from 'add-graphql-subscriptions';
import cors from 'cors';
import { schema } from './src/schema';

const PORT = 4000;
const server = express();
const subPath = '/subscriptions';

// Wrap the Express server
const ws = createServer(server);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  console.log(`GraphQL Subscriptions: http://localhost:${PORT}${subPath}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  {
    server: ws;
    path: '/subscriptions';
  }
});

server.use('*', cors({ origin: 'http://localhost:4200' }));

server.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema
  })
);

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}${subPath}`
  })
);

// eslint-disable-next-line no-unused-vars
// new SubscriptionServer(
//   {
//     schema: schema,
//     execute,
//     subscribe
//   },
//   {
//     server: graphQLServer,
//     path: subPath
//   }
// );
