// logic/useFinishMetrics.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { LatLng, UserLocationChangeEvent } from "react-native-maps";
import { haversineMeters, metersToMiles, mpsToMph } from "./geo_utils";

type Opts = {
  state: "start" | "finish";
  minDistance?: number;        // meters to accept a new segment (base)
  resetOnStart?: boolean;      // default true

  // NEW (optional) robustness knobs
  minTimeSec?: number;         // reject if dt < this (e.g., 0.8)
  maxAccuracy?: number;        // reject if accuracy > this (e.g., 25 m)
  accFactor?: number;          // require d >= accFactor * accuracy (e.g., 1.2)
  windowSec?: number;          // rolling window for speed (e.g., 6 s)
  maxMph?: number;             // clamp final mph (e.g., 150)
  preferNativeSpeed?: boolean; // trust coordinate.speed when sane
};

export function useFinishMetrics({
  state,
  minDistance = 3,
  resetOnStart = true,
  minTimeSec = 0.8,
  maxAccuracy = 35,         // ignore very noisy fixes
  accFactor = 1.2,          // scale accuracy into distance gate
  windowSec = 6,
  maxMph = 150,
  preferNativeSpeed = true,
}: Opts) {
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [mph, setMph] = useState(0);

  // Last accepted point (for distance accumulation)
  const lastRef = useRef<{ p: LatLng; t: number } | null>(null);

  // Rolling window of accepted samples to smooth speed
  // store small chain of points to compute distance over window
  const winRef = useRef<Array<{ p: LatLng; t: number }>>([]);

  useEffect(() => {
    if (state === "start" && resetOnStart) {
      setDistanceMeters(0);
      setMph(0);
      lastRef.current = null;
      winRef.current = [];
    }
  }, [state, resetOnStart]);

  const onUserLocationChange = useCallback(
    (e: UserLocationChangeEvent) => {
      if (state !== "finish") return;
      const c = e.nativeEvent?.coordinate;
      if (!c) return;

      const pt: LatLng = { latitude: c.latitude, longitude: c.longitude };
      const nowMs = e.timeStamp ?? Date.now();

      // Accuracy gating
      const acc = (c as any).accuracy as number | undefined; // meters
      if (typeof acc === "number" && acc > maxAccuracy) return;

      const last = lastRef.current;
      if (!last) {
        lastRef.current = { p: pt, t: nowMs };
        winRef.current = [{ p: pt, t: nowMs }];
        return;
      }

      const d = haversineMeters(last.p, pt);
      const dt = Math.max(0.001, (nowMs - last.t) / 1000);

      // Time gate to avoid tiny-dt spikes
      if (dt < minTimeSec) return;

      // Adaptive distance gate: require movement beyond both minDistance and accuracy
      const accGate = typeof acc === "number" ? acc * accFactor : 0;
      const effMin = Math.max(minDistance, accGate);
      if (d < effMin) return;

      // Accept this segment
      setDistanceMeters((prev) => prev + d);
      lastRef.current = { p: pt, t: nowMs };

      // Update rolling window
      const w = winRef.current;
      w.push({ p: pt, t: nowMs });
      const cutoff = nowMs - windowSec * 1000;
      while (w.length > 1 && w[0].t < cutoff) w.shift();

      // Prefer native speed if provided & sane (uses device odometry)
      let mphVal: number | undefined;
      if (preferNativeSpeed && typeof (c as any).speed === "number") {
        const sp = (c as any).speed; // m/s
        // some platforms report -1 or 0 when unknown; also reject if acc is large
        if (sp >= 0 && (!acc || acc <= maxAccuracy)) {
          mphVal = mpsToMph(sp);
        }
      }

      if (mphVal === undefined) {
        // Fallback: rolling-window speed (total distance over window / window duration)
        let dist = 0;
        for (let i = 1; i < w.length; i++) {
          dist += haversineMeters(w[i - 1].p, w[i].p);
        }
        const winDt = Math.max(0.001, (w[w.length - 1].t - w[0].t) / 1000);
        mphVal = mpsToMph(dist / winDt);
      }

      // Clamp unrealistic spikes
      setMph(Math.min(mphVal, maxMph));
    },
    [
      state,
      minDistance,
      minTimeSec,
      maxAccuracy,
      accFactor,
      windowSec,
      maxMph,
      preferNativeSpeed,
    ]
  );

  return {
    miles: metersToMiles(distanceMeters),
    mph,
    onUserLocationChange,
    reset: () => {
      setDistanceMeters(0);
      setMph(0);
      lastRef.current = null;
      winRef.current = [];
    },
  };
}
