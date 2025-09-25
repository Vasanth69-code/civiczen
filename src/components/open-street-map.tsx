
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default icon issue with Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type OpenStreetMapComponentProps = {
  location: Geolocation;
  popupText?: string;
  zoom?: number;
};

const OpenStreetMapComponent = ({ location, popupText, zoom = 16 }: OpenStreetMapComponentProps) => {

  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  if (!location) {
    return null;
  }

  return (
    <MapContainer 
        center={[location.latitude, location.longitude]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.latitude, location.longitude]}>
        {popupText && 
            <Popup>
                {popupText}
            </Popup>
        }
      </Marker>
    </MapContainer>
  );
};

export default OpenStreetMapComponent;
