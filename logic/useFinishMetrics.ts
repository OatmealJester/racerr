// logic/useFinishMetrics.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { LatLng, UserLocationChangeEvent } from "react-native-maps";
import { haversineMeters, metersToMiles, mpsToMph } from "./geo_utils";

type Opts = {
  state: "start" | "finish";
  minDistance?: number;   // meters to accept a new segment
  resetOnStart?: boolean; // default true
};

export function useFinishMetrics({ state, minDistance = 3, resetOnStart = true }: Opts) {
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [mph, setMph] = useState(0);
  const lastRef = useRef<{ p: LatLng; t: number } | null>(null);

  useEffect(() => {
    if (state === "start" && resetOnStart) {
      setDistanceMeters(0);
      setMph(0);
      lastRef.current = null;
    }
  }, [state, resetOnStart]);

  const onUserLocationChange = useCallback(
    (e: UserLocationChangeEvent) => {
      if (state !== "finish") return;
      const c = e.nativeEvent?.coordinate;
      if (!c) return;

      const pt: LatLng = { latitude: c.latitude, longitude: c.longitude };
      const nowMs = e.timeStamp ?? Date.now();

      const last = lastRef.current;
      if (!last) {
        lastRef.current = { p: pt, t: nowMs };
        return;
      }

      const d = haversineMeters(last.p, pt);
      if (d < minDistance) return; // significant-move gate

      const dt = Math.max(0.001, (nowMs - last.t) / 1000);
      setDistanceMeters((prev) => prev + d);
      setMph(mpsToMph(d / dt));

      lastRef.current = { p: pt, t: nowMs };
    },
    [state, minDistance]
  );

  return {
    miles: metersToMiles(distanceMeters),
    mph,
    onUserLocationChange,
    reset: () => {
      setDistanceMeters(0);
      setMph(0);
      lastRef.current = null;
    },
  };
}
