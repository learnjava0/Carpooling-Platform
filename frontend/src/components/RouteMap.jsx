import { useEffect, useState } from 'react';
import MapView from './MapView';
import { Loader2 } from 'lucide-react';
import { geocode, getRoutePoints, knownCoords } from '../utils/geocode';

/**
 * RouteMap — resolves two place names to coords and renders a MapView
 * with markers + a straight dashed line between them.
 *
 * Props:
 *  from      – place name string (pickup)
 *  to        – place name string (destination)
 *  height    – CSS height string
 *  fallback  – fallback center [lat, lng] when nothing is resolved
 */
function RouteMap({ from, to, height = '300px', fallback = [23.0225, 72.5714] }) {
  const [state, setState] = useState({
    loading: false,
    fromCoord: null,
    toCoord: null,
    routePoints: [],
  });

  useEffect(() => {
    if (!from && !to) {
      setState({ loading: false, fromCoord: null, toCoord: null, routePoints: [] });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setState(s => ({ ...s, loading: true }));

    async function resolve(place) {
      const quick = knownCoords(place);
      if (quick) return quick;
      return geocode(place);
    }

    (async () => {
      try {
        const [fc, tc] = await Promise.all([
          from ? resolve(from) : Promise.resolve(null),
          to   ? resolve(to)   : Promise.resolve(null),
        ]);

        let routedPoints = [];
        if (fc && tc) {
          routedPoints = await getRoutePoints(fc, tc, controller.signal)
            || [[fc.lat, fc.lng], [tc.lat, tc.lng]];
        }

        if (!cancelled) {
          setState({
            loading: false,
            fromCoord: fc,
            toCoord: tc,
            routePoints: routedPoints,
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !cancelled) {
          setState({ loading: false, fromCoord: null, toCoord: null, routePoints: [] });
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [from, to]);

  const { loading, fromCoord, toCoord, routePoints } = state;

  if (loading) {
    return (
      <div style={{
        height, borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-3)', gap: 8, fontSize: '0.82rem',
      }}>
        <Loader2 size={18} className="spin-icon" />
        Locating on map…
      </div>
    );
  }

  const markers = [];
  if (fromCoord) markers.push({ ...fromCoord, label: from || 'Pickup', color: 'green' });
  if (toCoord)   markers.push({ ...toCoord,   label: to   || 'Drop-off', color: 'brand' });

  const center = fromCoord
    ? [fromCoord.lat, fromCoord.lng]
    : toCoord
      ? [toCoord.lat, toCoord.lng]
      : fallback;

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {((from && from.trim().length > 2 && !fromCoord) || (to && to.trim().length > 2 && !toCoord)) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
          Unable to find exact location. Check spelling.
        </div>
      )}
      <MapView
        height={height}
        center={center}
        zoom={12}
        markers={markers}
        routePoints={routePoints}
        className="w-full h-full"
      />
    </div>
  );
}

export default RouteMap;
