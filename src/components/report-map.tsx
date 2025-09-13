
'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Geolocation } from './report-issue-form';

export default function ReportMap({ geolocation }: { geolocation: Geolocation | null }) {
    const position = geolocation ? [geolocation.latitude, geolocation.longitude] : [20.5937, 78.9629]; // Default to India center
    const zoom = geolocation ? 16 : 5;

    return (
        <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geolocation && <Marker position={position} />}
        </MapContainer>
    );
}
