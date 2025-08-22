import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation  addUser($name: String!, $email: String!, $password: String!){
    createUser(
      name: $name,
      email: $email,
      password: $password
    ){
      name
      email
      id
    }
  }
`;
/*
export const LOGIN_USER = gql`
  mutation
`
*/