
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { Issue } from '@/lib/types';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

const MapPlaceholder = () => <Skeleton className="h-[400px] w-full" />;

interface IssueClusterMapProps {
    issues: Issue[];
}

export function IssueClusterMap({ issues }: IssueClusterMapProps) {
  if (typeof window === 'undefined' || !issues || issues.length === 0) {
    return <MapPlaceholder />;
  }

  const center: LatLngTuple = [20.5937, 78.9629]; // Center of India

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden z-0">
        <MapContainer center={center} zoom={5} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
                {issues.map(issue => (
                    <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]}>
                        <Popup>
                            <Link href={`/issues/${issue.id}`} className="font-semibold hover:underline">
                                {issue.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">{issue.category}</p>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    </div>
  );
}
