import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

export const typeDefs = `
type Channel {
    id: ID! # !required field
    name: String
    messages: [Message]!
}

type Message {
  id: ID!
  text: String
}

input MessageInput {
  channelId: ID!
  text: String
}

type Query {
    channels: [Channel]
    channel(id: ID!): Channel
}

# The mutation root type, used to define all mutations
type Mutation {
  # A mutation to add a new channel to the list of channels
  addChannel(name: String!): Channel
  addMessage(message: MessageInput!): Message
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
