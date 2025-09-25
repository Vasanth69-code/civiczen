
'use client';

import { useEffect, useRef, useState } from 'react';
import { useIssues } from '@/context/issue-context';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'leaflet.markercluster';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Wrench, Zap, Trash2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Issue } from '@/lib/types';


// Fix for default icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});


const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const categoryConfig = {
    Roads: {
        categories: ['Pothole', 'Damaged Signage'],
        color: 'red',
        Icon: Wrench,
    },
    Utilities: {
        categories: ['Streetlight Outage', 'Electrical Line Damage'],
        color: 'blue',
        Icon: Zap,
    },
    Sanitation: {
        categories: ['Garbage Overflow', 'Sewage Overflow'],
        color: 'green',
        Icon: Trash2,
    },
    Other: {
        categories: ['Graffiti', 'Tree Damage', 'Other'],
        color: 'orange',
        Icon: Shield,
    }
}

type CategoryName = keyof typeof categoryConfig;

const getIssueCategory = (issue: Issue): CategoryName => {
    for (const catName in categoryConfig) {
        if (categoryConfig[catName as CategoryName].categories.includes(issue.category)) {
            return catName as CategoryName;
        }
    }
    return 'Other';
}

export function IssuesMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { issues } = useIssues();
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<Record<CategoryName, boolean>>({
      Roads: true,
      Utilities: true,
      Sanitation: true,
      Other: true,
  });

  const clusterLayersRef = useRef<Record<CategoryName, L.MarkerClusterGroup>>({} as Record<CategoryName, L.MarkerClusterGroup>);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
          center: [center.lat, center.lng],
          zoom: 12,
          maxZoom: 18,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Initialize cluster groups for each category
      for (const catName in categoryConfig) {
          const category = categoryConfig[catName as CategoryName];
          const clusterGroup = L.markerClusterGroup({
              spiderfyOnMaxZoom: true,
              showCoverageOnHover: false,
              zoomToBoundsOnClick: true,
              iconCreateFunction: function(cluster) {
                  const childCount = cluster.getChildCount();
                  let c = ' marker-cluster-';
                  if (childCount < 10) c += 'small';
                  else if (childCount < 100) c += 'medium';
                  else c += 'large';
                  
                  return new L.DivIcon({
                      html: '<div><span>' + childCount + '</span></div>',
                      className: `marker-cluster marker-cluster-${category.color}` + c,
                      iconSize: new L.Point(40, 40)
                  });
              }
          });
          clusterLayersRef.current[catName as CategoryName] = clusterGroup;
          map.addLayer(clusterGroup);
      }

      // Add markers to the corresponding category cluster group
      issues.forEach(issue => {
        const issueCat = getIssueCategory(issue);
        const marker = L.marker([issue.location.lat, issue.location.lng]);
        marker.bindPopup(`<b>${issue.title}</b><br>${issue.description.substring(0, 50)}...<br/><a href="/issues/${issue.id}" class="text-primary hover:underline">View Details</a>`);
        
        marker.on('click', (e) => {
            const map = mapRef.current;
            if (map) {
                map.flyTo(e.latlng, 16);
            }
        });

        if(clusterLayersRef.current[issueCat]) {
            clusterLayersRef.current[issueCat].addLayer(marker);
        }
      });
    }
  }, []); // Initial map setup

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const catName in activeCategories) {
        const categoryKey = catName as CategoryName;
        const clusterGroup = clusterLayersRef.current[categoryKey];
        if (clusterGroup) {
            if (activeCategories[categoryKey]) {
                if (!map.hasLayer(clusterGroup)) {
                    map.addLayer(clusterGroup);
                }
            } else {
                if (map.hasLayer(clusterGroup)) {
                    map.removeLayer(clusterGroup);
                }
            }
        }
    }
  }, [activeCategories, issues]);


  const toggleCategory = (category: CategoryName) => {
    setActiveCategories(prev => ({
        ...prev,
        [category]: !prev[category]
    }));
  };

  return (
    <div className="relative w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-lg flex gap-2">
            {Object.keys(categoryConfig).map(catName => {
                const category = categoryConfig[catName as CategoryName];
                const isActive = activeCategories[catName as CategoryName];
                return (
                    <Button
                        key={catName}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(catName as CategoryName)}
                        className={cn("flex items-center gap-2", {
                            'bg-red-500 hover:bg-red-600 text-white': catName === 'Roads' && isActive,
                            'bg-blue-500 hover:bg-blue-600 text-white': catName === 'Utilities' && isActive,
                            'bg-green-500 hover:bg-green-600 text-white': catName === 'Sanitation' && isActive,
                            'bg-orange-500 hover:bg-orange-600 text-white': catName === 'Other' && isActive,
                        })}
                    >
                        <category.Icon className="h-4 w-4" />
                        <span>{catName}</span>
                    </Button>
                )
            })}
        </div>
    </div>
  );
};
