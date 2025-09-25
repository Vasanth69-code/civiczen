'use client';

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { useState, useCallback } from 'react';

type Geolocation = {
  lat: number;
  lng: number;
};

type GoogleMapComponentProps = {
  location: Geolocation;
  infoWindowText?: string;
  zoom?: number;
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

const GoogleMapComponent = ({ location, infoWindowText, zoom = 16 }: GoogleMapComponentProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState(null)
  const [showInfoWindow, setShowInfoWindow] = useState(true);

  const onMapLoad = useCallback(function callback(mapInstance: any) {
    setMap(mapInstance)
  }, [])

  const onMapUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  if (loadError) {
    return (
        <div className="flex items-center justify-center h-full bg-destructive/10 text-destructive">
            <p>Error loading map</p>
        </div>
    );
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={zoom}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{ 
            streetViewControl: false, 
            mapTypeControl: false,
            fullscreenControl: false
        }}
      >
        <Marker position={location} onClick={() => setShowInfoWindow(!showInfoWindow)}>
            {showInfoWindow && infoWindowText && (
                <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                    <div className="p-1">
                        <p className="font-semibold">{infoWindowText}</p>
                    </div>
                </InfoWindow>
            )}
        </Marker>
      </GoogleMap>
  ) : <Skeleton className="h-full w-full" />
};

export default GoogleMapComponent;
