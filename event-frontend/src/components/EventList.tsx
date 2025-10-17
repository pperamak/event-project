import { GET_EVENTS } from "../queries";
import { useQuery } from "@apollo/client";

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

interface GetEventsData {
  allEvents: Event[];
}

const EventList = () => {
  const { loading, error, data } = useQuery<GetEventsData>(GET_EVENTS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const events = data ? data.allEvents : [];

  return (
    <ul>
     {events.map(event =><li key={event.id}>{event.name}</li> )} 
    </ul>
    
  );
};

export default EventList;