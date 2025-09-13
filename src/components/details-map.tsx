
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Issue } from '@/lib/types';

export default function DetailsMap({ issue }: { issue: Issue }) {
    return (
        <MapContainer
            center={[issue.location.lat, issue.location.lng]}
            zoom={16}
            scrollWheelZoom={false}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[issue.location.lat, issue.location.lng]}>
                <Popup>{issue.title}</Popup>
            </Marker>
        </MapContainer>
    );
}
