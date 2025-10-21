import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_EVENT_BY_ID } from "../queries";

interface EventUser {
  id: string;
  email: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  time: string;
  description: string;
  user: EventUser;
}

interface GetEventData {
  findEvent: Event;
}

const Event = () =>{
  
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetEventData>(GET_EVENT_BY_ID, {
    variables: { id: Number(id) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.findEvent) return <p>No event found.</p>;
  
  const event = data.findEvent;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>{new Date(event.time).toLocaleString()}</p>
      <p>Hosted by: {event.user.name}</p>
    </div>
  );
};
  
export default Event;