
'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type GoogleMapProps = {
  location: Geolocation;
  popupText?: string;
  zoom?: number;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const GoogleMapComponent = ({ location, popupText, zoom = 16 }: GoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat: location.latitude,
    lng: location.longitude,
  };

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        streetViewControl: false,
        mapTypeControl: true,
      }}
    >
      <Marker position={center} title={popupText} />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
