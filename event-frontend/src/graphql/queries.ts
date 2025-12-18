import { gql } from "@apollo/client";




export const GET_EVENTS = gql`
  query getEvents{
    allEvents{
      id
      name
      time
      description
      image
      latitude
      longitude
      address
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
    latitude
    longitude
    address
    user{
        name
        email
        id
      }
  }
}
`;

export const GET_EVENT_MESSAGES = gql`
  query EventMessages($eventId: ID!) {
    eventMessages(eventId: $eventId) {
      id
      content
      createdAt
      user {
        id
        name
      }
    }
  }
`;

