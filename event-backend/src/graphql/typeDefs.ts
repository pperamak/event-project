export const typeDefs=`
  type User {
    name: String!
    email: String!
    passwordHash: String!
    id: ID!
  }
  
  type Query {
    allUsers: [User!]!
  }
`;

