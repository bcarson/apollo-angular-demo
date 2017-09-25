const channels = [
  {
    id: 1,
    name: 'Soccer',
    messages: [
      {
        id: 2,
        text: 'Soccer is life!'
      }
    ]
  },
  {
    id: 2,
    name: 'Baseball',
    messages: [
      {
        id: 4,
        text: 'Baseball is life!'
      }
    ]
  }
];

let nextId = 3;
let nextMessageId = 3;

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
      const newChannel = { id: nextId++, name: args.name };
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
      return newMessage;
    }
  }
};
