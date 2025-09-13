
'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import type { Map } from 'leaflet';
import { Geolocation } from './report-issue-form';
import { Skeleton } from './ui/skeleton';

export default function ReportMap({ geolocation }: { geolocation: Geolocation | null }) {
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapRef.current && geolocation) {
            mapRef.current.setView([geolocation.latitude, geolocation.longitude], 16);
        }
    }, [geolocation]);

    if (!geolocation) {
        return <Skeleton className="h-48 w-full" />;
    }

    return (
        <div className="h-48 w-full rounded-md mt-2 overflow-hidden z-0">
            <MapContainer
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
                center={[geolocation.latitude, geolocation.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[geolocation.latitude, geolocation.longitude]} />
            </MapContainer>
        </div>
    );
}
