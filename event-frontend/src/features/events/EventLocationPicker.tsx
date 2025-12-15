// src/components/maps/EventLocationPicker.tsx
import { useRef, useState } from "react";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";


export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface Props {
  onChange: (loc: LocationData | null) => void;
}

const containerStyle = {
  width: "100%",
  height: "250px",
};
//
export default function EventLocationPicker({ onChange }: Props) {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const handlePlaceChanged = () => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();
    if (!places || !places.length) return;

    const place = places[0];
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    const address = place.formatted_address || "";

    if (!lat || !lng) return;

    const loc = { lat, lng, address };
    setLocation(loc);
    onChange(loc);
  };

  return (
    <div className="mt-2">
      <label className="block font-medium">Location</label>

      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a place"
          className="bg-red-100 w-full"
        />
      </StandaloneSearchBox>

      {location && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: location.lat, lng: location.lng }}
          zoom={15}
        >
          <Marker position={{ lat: location.lat, lng: location.lng }} />
        </GoogleMap>
      )}
    </div>
  );
}