
'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Map } from 'leaflet';
import type { Issue } from '@/lib/types';

export default function DetailsMap({ issue }: { issue: Issue }) {
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([issue.location.lat, issue.location.lng], 16);
        }
    }, [issue]);

    return (
        <div className="h-80 w-full rounded-md overflow-hidden z-0">
            <MapContainer
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
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
        </div>
    );
}
