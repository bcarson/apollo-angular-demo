import gql from 'graphql-tag';

export const typeDefs = `
type Channel {
  id: ID! # !required field
  name: String
  messages: Message[]!
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

export interface Message {
  id: number;
  text: string;
}

export interface MessageInput {
  channelId: number;
  text: String;
}

export interface Channel {
  id: number;
  name: string;
  messages: Message[];
}

export interface QueryResponse {
  channel: Channel;
}

export const messagesSubscription = gql`
  subscription messageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`;

export const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

export const channelDetailQuery = gql`
  query ChannelDetailQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;

export const addMessage = gql`
  mutation addMessage($messageInput: MessageInput!) {
    addMessage(message: $messageInput) {
      id
      text
    }
  }
`;

export const addChannel = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;
