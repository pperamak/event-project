import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_EVENT_BY_ID } from "../queries/queries";
import { GoogleMap, Marker } from "@react-google-maps/api";

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
  image: string;
  latitude: number;
  longitude: number;
  address: string;
  user: EventUser;
}

interface GetEventData {
  findEvent: Event;
}

const Event = () =>{
  
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetEventData>(GET_EVENT_BY_ID, {
    variables: { id: id },
  });

  const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dqm9cv8nj/image/upload/v1764240724/780-7801295_celebration-download-png-celebration-background_iezywq.jpg";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.findEvent) return <p>No event found.</p>;
  
  const event = data.findEvent;

  return (
    <div className="mt-24 flex justify-center">
    <div className="w-full max-w-xl border-red-900 p-2 rounded bg-red-200">
      <img src={event.image ? event.image : DEFAULT_IMAGE_URL} alt="Uploaded" className="rounded shadow" />
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>{new Date(event.time).toLocaleString()}</p>
      <p>Hosted by: {event.user.name}</p>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "300px" }}
        center={{ lat: event.latitude, lng: event.longitude }}
        zoom={14}
      >
        <Marker position={{ lat: event.latitude, lng: event.longitude }} />
      </GoogleMap>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>

    </div>
    </div>
  );
};
  
export default Event;