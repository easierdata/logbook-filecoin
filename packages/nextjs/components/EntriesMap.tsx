"use client";

/**
 * Interactive map component for displaying entries
 * Displays entries interactively using Mapbox GL JS.
 */

import React from 'react';
import mapboxgl from '!mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize Mapbox with access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Default map settings
const DEFAULT_CENTER: [number, number] = [8.40556, 50.06392];
const DEFAULT_ZOOM = 1;

interface Entry {
  id: string;
  coordinates: [number, number];
  timestamp: string;
  memo: string;
  uid: string;
}

interface EntriesMapProps {
  entries: Entry[];
  onMarkerClick: (entry: Entry) => void;
  onMarkerHover: (entry: Entry, event: MouseEvent) => void;
  onMarkerLeave: () => void;
}

 // Creates HTML content for marker popups
const createPopupContent = (entry: Entry) => `
  <div class="p-2 min-w-[200px]">
    <h3 class="font-bold mb-1">Location Details</h3>
    ${entry.timestamp ? `
      <p class="text-sm mb-1">
        <span class="font-semibold">Time:</span> 
        ${new Date(entry.timestamp).toLocaleString()}
      </p>` : ''}
    ${entry.memo ? `
      <p class="text-sm">
        <span class="font-semibold">Memo:</span> ${entry.memo}
      </p>` : ''}
  </div>
`;

 // Marker creation, popup display, and map interactions
const EntriesMap: React.FC<EntriesMapProps> = ({ entries, onMarkerClick, onMarkerHover, onMarkerLeave }) => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markersRef = React.useRef<mapboxgl.Marker[]>([]);
  const isHoveringRef = React.useRef(false);
  const initialBoundsSet = React.useRef(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Mouse move handler to clear hover state when not over markers
  React.useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('h-3')) {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          onMarkerLeave();
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [onMarkerLeave]);

  React.useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false
    }).on('load', () => setIsLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when entries change
  React.useEffect(() => {
    if (!map.current || !isLoaded || !entries.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    // Create new markers for each entry
    entries.forEach(entry => {
      const [lng, lat] = entry.coordinates;
      if (isNaN(lng) || isNaN(lat) || lat < -90 || lat > 90) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'h-3 w-3 bg-[#009900] rounded-full cursor-pointer hover:bg-[#007700] transition-colors';

      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map.current!);

        el.addEventListener('click', () => onMarkerClick(entry));
        el.addEventListener('mouseenter', (event) => {
          isHoveringRef.current = true;
          onMarkerHover(entry, event as MouseEvent);
        });
        el.addEventListener('mousemove', (event) => {
          if (isHoveringRef.current) {
            onMarkerHover(entry, event as MouseEvent);
          }
        });
        el.addEventListener('mouseleave', () => {
          isHoveringRef.current = false;
          onMarkerLeave();
        });
        
        bounds.extend([lng, lat]);
        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

    // Only adjust map view on initial load or when new entries are added
    if (!initialBoundsSet.current && markersRef.current.length > 0) {
      if (markersRef.current.length > 1) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15
        });
      } else {
        const lngLat = markersRef.current[0].getLngLat();
        map.current.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 12
        });
      }
      initialBoundsSet.current = true;
    }
  }, [entries, isLoaded, onMarkerClick, onMarkerHover, onMarkerLeave]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded overflow-hidden shadow-lg"
    />
  );
};

export default EntriesMap;