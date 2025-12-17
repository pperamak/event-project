import { gql } from 'graphql-tag';

export const typeDefs=gql`
  type User {
    name: String!
    email: String!
    id: ID!
  }

  type Token{
    value: String!
    user: User!
  }
  
  type Event{
    id: ID!
    name: String!
    time: String!
    description: String!
    user: User!
    image: String
    latitude: Float
    longitude: Float
    address: String
  }

  type DiscussionMessage {
  id: ID!
  content: String!
  createdAt: String!
  user: User!
}


  type CloudinarySignature {
    signature: String!
    timestamp: Int!
    cloudName: String!
    apiKey: String!
  }
  
  type Query {
    allUsers: [User!]!
    me: User
    allEvents: [Event!]!
    findEvent(id: ID!): Event
    eventMessages(eventId: ID!): [DiscussionMessage!]!
  }
  
  
  input CreateEventInput {
    name: String!
    description: String!
    time: String!
    image: String
    latitude: Float
    longitude: Float
    address: String
  }
  

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): User!

    createEvent(
      input: CreateEventInput!
    ): Event!

    addMessage(eventId: ID!, content: String!): DiscussionMessage!

    getCloudinarySignature: CloudinarySignature!

    login(
      email: String!
      password: String!
    ): Token!
  }
`;

