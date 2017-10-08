import gql from 'graphql-tag';

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
