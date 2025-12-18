import { GET_EVENTS } from "../../graphql/queries";
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

  const sortedEvents = [...events].sort(
  (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
);

  return (
    <div className="flex justify-center mt-24">
    <ol className="grid grid-cols-4 w-3/4">
     {sortedEvents.map(event =><li key={event.id}>
      <Link to={`/events/${event.id}`} ><article className="p-2 m-2 rounded bg-red-200 hover:bg-red-400"><p>{event.name}</p><p>{new Date(event.time).toLocaleString()}</p></article></Link></li> )} 
    </ol>
    </div>
  );
};

export default EventList;