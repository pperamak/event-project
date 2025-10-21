import { GET_EVENTS } from "../queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router";

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
     {events.map(event =><li key={event.id}>
      <Link to={`/events/${event.id}`}>{event.name}</Link></li> )} 
    </ul>
    
  );
};

export default EventList;