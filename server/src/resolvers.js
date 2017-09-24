const channels = [
  {
    id: 1,
    name: 'soccer',
    messages: [
      {
        id: 2,
        text: 'soccer is life'
      }
    ]
  },
  {
    id: 2,
    name: 'baseball',
    messages: [
      {
        id: 4,
        text: 'baseball is life'
      }
    ]
  }
];

let nextId = 3;

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
    addMessage: (root, args) => {
      const newMessage = { id: nextId++, text: args.text };
      const channel = channels[args.channelID];
      channel.push(newMessage);
      return newChannel;
    }
  }
};
