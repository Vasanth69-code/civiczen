
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type OpenStreetMapProps = {
  location: Geolocation;
  popupText?: string;
};

const OpenStreetMap = ({ location, popupText }: OpenStreetMapProps) => {
    const position: LatLngExpression = [location.latitude, location.longitude];
    const defaultZoom = 16;
    const minZoom = 10;
    const maxZoom = 18;

  return (
    <MapContainer center={position} zoom={defaultZoom} scrollWheelZoom={true} className="h-full w-full z-0" minZoom={minZoom} maxZoom={maxZoom}>
        <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Standard">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                    url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                    maxZoom={20}
                    subdomains={['mt1','mt2','mt3']}
                    attribution='&copy; Google Maps'
                />
            </LayersControl.BaseLayer>
             <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                    url='https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
                    maxZoom={20}
                    subdomains={['mt1','mt2','mt3']}
                    attribution='&copy; Google Maps'
                />
            </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={position}>
            {popupText && <Popup>{popupText}</Popup>}
        </Marker>
    </MapContainer>
  );
};

export default OpenStreetMap;
