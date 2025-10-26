import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import MapView, { LatLng, Polyline } from 'react-native-maps';
import MapParent from './MapParent';

type MapTrailProps = {
  /** keep camera centered on the user */
  follow?: boolean;
  /** minimum meters moved before adding a point to the trail */
  minDistance?: number;
  /** polyline width */
  lineWidth?: number;
  /** polyline color */
  lineColor?: string;
  /** optional target zoom for animateCamera (platform-dependent) */
  zoom?: number;
};

export default function MapTrail({
  follow = true,
  minDistance = 3,
  lineWidth = 6,
  lineColor = '#007AFF',
  zoom,
}: MapTrailProps) {
  const mapRef = useRef<MapView>(null);
  const [path, setPath] = useState<LatLng[]>([]);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    let last: LatLng | null = null;
    let cancelled = false;

    (async () => {
      // Ensure we have permission even if parent already asked (safe + idempotent)
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        const req = await Location.requestForegroundPermissionsAsync();
        if (req.status !== 'granted') {
          console.warn('Location permission not granted.');
          return;
        }
      }

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 1000,       // ~1 Hz
          distanceInterval: minDistance,
        },
        (pos) => {
          if (cancelled) return;

          const point: LatLng = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          // Filter tiny jitter but still re-center if follow=true
          if (last) {
            const d = haversineMeters(last, point);
            if (d < minDistance) {
              if (follow && mapRef.current) animateTo(mapRef.current, point, zoom);
              return;
            }
          }

          last = point;

          setPath((cur) =>
            cur.length === 0 ||
            cur[cur.length - 1].latitude !== point.latitude ||
            cur[cur.length - 1].longitude !== point.longitude
              ? [...cur, point]
              : cur
          );

          if (follow && mapRef.current) {
            animateTo(mapRef.current, point, zoom);
          }
        }
      );
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [follow, minDistance, zoom]);

  return (
    <MapParent ref={mapRef}>
      {path.length >= 2 && (
        <Polyline coordinates={path} strokeWidth={lineWidth} strokeColor={lineColor} />
      )}
    </MapParent>
  );
}

/** Smooth camera recenter to the user */
function animateTo(map: MapView, center: LatLng, zoom?: number) {
  const anyMap = map as any;
  if (typeof anyMap.animateCamera === 'function') {
    const camera: any = { center };
    if (typeof zoom === 'number') camera.zoom = zoom; // honored on Google provider
    anyMap.animateCamera(camera, { duration: 500 });
  } else {
    // Fallback for providers without camera API
    map.animateToRegion(
      { ...center, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      500
    );
  }
}

/** Haversine distance in meters */
function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = deg2rad(b.latitude - a.latitude);
  const dLon = deg2rad(b.longitude - a.longitude);
  const lat1 = deg2rad(a.latitude);
  const lat2 = deg2rad(b.latitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function deg2rad(x: number) {
  return (x * Math.PI) / 180;
}
