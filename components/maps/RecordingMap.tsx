// components/RecordingMap.tsx
import { useCallback, useRef, useState } from "react";
import MapView, {
    LatLng,
    Polyline,
    UserLocationChangeEvent,
} from "react-native-maps";
import MapParent from "./MapParent";

type RecordingMapProps = {
  state: "start" | "finish";
  minDistance?: number;   // passed to MapParent
  lineWidth?: number;
  lineColor?: string;
  zoom?: number;          // Google provider zoom
  onMetrics?: (miles: number, mph: number) => void;
  /** Optional: also forward raw significant events (e.g., enqueue for Mapbox) */
  onSignificantEventAlso?: (e: UserLocationChangeEvent) => void;
};

export default function RecordingMap({
  state,
  minDistance = 3,
  lineWidth = 6,
  lineColor = "#007AFF",
  zoom = 17,
  onMetrics,
  onSignificantEventAlso,
}: RecordingMapProps) {
  const mapRef = useRef<MapView>(null);
  const [path, setPath] = useState<LatLng[]>([]);

  const handleSignificantMove = useCallback(
    (e: UserLocationChangeEvent) => {
      onSignificantEventAlso?.(e); // e.g., push into locationQueue for Mapbox

      const c = e.nativeEvent?.coordinate;
      if (!c) return;
      const pt: LatLng = { latitude: c.latitude, longitude: c.longitude };

      setPath((prev) => {
        const last = prev[prev.length - 1];
        const same =
          last &&
          last.latitude === pt.latitude &&
          last.longitude === pt.longitude;
        return same ? prev : [...prev, pt];
      });

      // Follow camera only in finish
      if (state === "finish" && mapRef.current) {
        animateTo(mapRef.current, pt, zoom);
      }
    },
    [onSignificantEventAlso, state, zoom]
  );

  // When you switch to "start", MapParent resets metrics; you may also
  // want to clear the trail. Do it here if needed:
  // useEffect(() => { if (state === "start") setPath([]); }, [state]);

  return (
    <MapParent
      ref={mapRef}
      state={state}
      minDistance={minDistance}
      onMetrics={onMetrics}
      onUserLocationChangeAlso={handleSignificantMove}
    >
      {path.length >= 2 && (
        <Polyline coordinates={path} strokeWidth={lineWidth} strokeColor={lineColor} />
      )}
    </MapParent>
  );
}

/** Smooth cross-platform camera recenter */
function animateTo(map: MapView, center: LatLng, zoom?: number) {
  const anyMap = map as any;
  if (typeof anyMap.animateCamera === "function") {
    const camera: any = { center };
    if (typeof zoom === "number") camera.zoom = zoom;
    anyMap.animateCamera(camera, { duration: 450 });
  } else {
    map.animateToRegion(
      { ...center, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      450
    );
  }
}
