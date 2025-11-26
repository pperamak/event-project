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
  mutation addEvent($name: String!, $time: String!, $description: String!, $image: String){
    createEvent(
      name: $name,
      time: $time,
      description: $description 
      image: $image   
    ){
      id
      name
      time
      description
      image
      user{
        name
        email
        id
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query getEvents{
    allEvents{
      id
      name
      time
      description
      image
      user{
        name
        email
        id
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query getEvent($id: ID!) {
  findEvent(id: $id) {
    id
    name
    time
    description
    image
    user{
        name
        email
        id
      }
  }
}
`;

export const GET_SIGNATURE = gql`
  mutation GetSignature {
    getCloudinarySignature {
      signature
      timestamp
      cloudName
      apiKey
    }
  }
`;

