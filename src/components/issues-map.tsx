
'use client';

import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { useIssues } from '@/context/issue-context';
import { useRouter } from 'next/navigation';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

export function IssuesMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const { issues } = useIssues();
  const router = useRouter();

  const handleMarkerClick = (issueId: string) => {
    router.push(`/issues/${issueId}`);
  };

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: true,
      }}
    >
      <MarkerClusterer
        options={{
            gridSize: 80,
            styles: [
                {
                    textColor: 'white',
                    url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
                    height: 53,
                    width: 53,
                },
                {
                    textColor: 'white',
                    url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
                    height: 56,
                    width: 56,
                },
                {
                    textColor: 'white',
                    url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
                    height: 66,
                    width: 66,
                },
            ]
        }}
      >
        {(clusterer) =>
          issues.map((issue) => (
            <Marker
              key={issue.id}
              position={{ lat: issue.location.lat, lng: issue.location.lng }}
              clusterer={clusterer}
              onClick={() => handleMarkerClick(issue.id)}
            />
          ))
        }
      </MarkerClusterer>
    </GoogleMap>
  );
};
