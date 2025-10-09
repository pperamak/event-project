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

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!){
    login(
      email: $email,
      password: $password
    ){
      value
      user{
        name
        email
        id
      }
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation addEvent($name: String!, $time: String!, $description: String!){
    createEvent(
      name: $name,
      time: $time,
      description: $description    
    ){
      id
      name
      time
      description
      user{
        name
        email
        id
      }
    }
  }
`;
