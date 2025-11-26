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
  }
  

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): User!

    createEvent(
      name: String!
      time: String!
      description: String!
      image: String
    ): Event!

    getCloudinarySignature: CloudinarySignature!

    login(
      email: String!
      password: String!
    ): Token!
  }
`;

