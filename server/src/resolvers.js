import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();

const channels = [
  {
    id: 1,
    name: 'Soccer',
    messages: [
      {
        id: 1,
        text: 'Soccer is life!'
      }
    ]
  },
  {
    id: 2,
    name: 'Baseball',
    messages: [
      {
        id: 1,
        text: 'Baseball is life!'
      }
    ]
  }
];

let nextId = 3;
let nextMessageId = 2;

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === +id);
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      const welcome = 'Hello! Welcome to the ' + args.name + ' channel.';
      const newChannel = {
        id: nextId++,
        name: args.name,
        messages: [{ id: 1, text: welcome }]
      };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(
        channel => channel.id === +message.channelId
      );
      if (!channel) throw new Error('Channel does not exist.');
      const newMessage = { id: String(nextMessageId++), text: message.text };
      channel.messages.push(newMessage);
      /* Activate the 'messageAdded' subscription */
      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId
      });
      return newMessage;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.channelId === variables.channelId;
        }
      )
    }
  }
};
