import { gql } from 'graphql-tag';

export const typeDefs=gql`
  type User {
    name: String!
    email: String!
    id: ID!
  }
  
  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): User!
  }
`;

