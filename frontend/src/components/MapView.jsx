import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

/**
 * MapView — Leaflet/OSM map component.
 *
 * Props:
 *  height        – CSS height string (default '300px')
 *  center        – [lat, lng] (default Ahmedabad)
 *  zoom          – initial zoom (default 12)
 *  markers       – [{ lat, lng, label, color }]  (optional)
 *  routePoints   – [[lat, lng], ...]  draws a polyline (optional)
 *  className     – extra class on wrapper
 */
function MapView({
  height = '300px',
  center = [23.0225, 72.5714],   // Ahmedabad default
  zoom = 12,
  markers = [],
  routePoints = [],
  className = '',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const polyRef = useRef(null);
  const markerRefs = useRef([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let map;

    async function init() {
      try {
        // Dynamic import so leaflet CSS loads once
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        leafletRef.current = L;

        // Fix default icon paths broken by bundlers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!containerRef.current || mapRef.current) return;

        map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: true }).setView(center, zoom);
        mapRef.current = map;

        // Dark tile layer (CartoDB Dark Matter)
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }
        ).addTo(map);

        setTimeout(() => map.invalidateSize(), 0);
      } catch (e) {
        console.error('Map init failed:', e);
        setError(true);
      }
    }

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];

    if (polyRef.current) {
      polyRef.current.remove();
      polyRef.current = null;
    }

    markers
      .filter(m => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      .forEach(m => {
        const color = m.color === 'green' ? '#4ade80' : '#f4b000';
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:28px;border-radius:50% 50% 50% 0;
            background:${color};transform:rotate(-45deg);
            border:2px solid rgba(255,255,255,0.35);
            box-shadow:0 3px 12px rgba(0,0,0,0.5);
          "></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });
        const marker = L.marker([m.lat, m.lng], { icon });
        if (m.label) marker.bindPopup(`<strong>${m.label}</strong>`);
        marker.addTo(map);
        markerRefs.current.push(marker);
      });

    if (routePoints.length >= 2) {
      polyRef.current = L.polyline(routePoints, {
        color: '#f4b000',
        weight: 5,
        opacity: 0.92,
      }).addTo(map);
      map.fitBounds(polyRef.current.getBounds(), { padding: [40, 40] });
    } else if (markerRefs.current.length > 0) {
      const bounds = L.latLngBounds(markerRefs.current.map(marker => marker.getLatLng()));
      if (markerRefs.current.length === 1) {
        map.setView(markerRefs.current[0].getLatLng(), zoom);
      } else {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      map.setView(center, zoom);
    }

    setTimeout(() => map.invalidateSize(), 0);
  }, [center, markers, routePoints, zoom]);

  if (error) {
    return (
      <div style={{
        height, borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-3)', gap: 8,
      }}>
        <MapPin size={28} style={{ opacity: 0.4 }} />
        <span style={{ fontSize: '0.82rem' }}>Map unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default MapView;
