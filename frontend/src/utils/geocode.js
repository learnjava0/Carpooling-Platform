/**
 * Geocode a place name using OSM Nominatim (no API key required).
 * Returns { lat, lng } or null on failure.
 */
export async function geocode(query) {
  if (!query || query.trim().length < 2) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

/** Known city shortcuts for instant results without geocoding delay */
const KNOWN = {
  iskcon:          { lat: 23.0302, lng: 72.5067 },
  infinity:        { lat: 23.0473, lng: 72.5073 },
  satellite:       { lat: 23.0273, lng: 72.5322 },
  'sg highway':    { lat: 23.0565, lng: 72.5303 },
  'gift city':     { lat: 23.1611, lng: 72.6820 },
  bopal:           { lat: 23.0234, lng: 72.4659 },
  'hsr layout':    { lat: 12.9116, lng: 77.6389 },
  'manyata tech':  { lat: 13.0477, lng: 77.6222 },
  ahmedabad:       { lat: 23.0225, lng: 72.5714 },
  bangalore:       { lat: 12.9716, lng: 77.5946 },
  'btm layout':    { lat: 12.9166, lng: 77.6101 },
};

export function knownCoords(place) {
  if (!place) return null;
  return KNOWN[place.toLowerCase().trim()] || null;
}

/**
 * Resolve a drivable route between two points using OSRM's public demo server.
 * Returns [[lat, lng], ...] or null so callers can gracefully fall back.
 */
export async function getRoutePoints(fromCoord, toCoord, signal) {
  if (!fromCoord || !toCoord) return null;

  const coords = `${fromCoord.lng},${fromCoord.lat};${toCoord.lng},${toCoord.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;

    const data = await res.json();
    const route = data.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(route) || route.length < 2) return null;

    return route.map(([lng, lat]) => [lat, lng]);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return null;
  }
}
