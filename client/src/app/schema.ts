export const typeDefs = `

type Channel {
    id: ID! # !required field
    name: String
}

type Query {
    channels: [Channel]
}

`;

/*
query ChannelsListQuery {
  channels {
    id
    name
  }
}
*/
