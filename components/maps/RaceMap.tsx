// components/maps/MatrixPathMap.tsx
import * as React from 'react';
import type { LatLng, UserLocationChangeEvent } from 'react-native-maps';
import { Circle, Marker, Polyline } from 'react-native-maps';
import MapParent from './MapParent';

/** ── Public types (no mph) ────────────────────────────────────────────── */
export type MatrixPathStatus = {
  onRoute: boolean;
  deviationMeters: number;
  progressMeters: number;
  progressRatio: number;
  totalRouteMeters: number;
  started: boolean;
  finished: boolean;
  elapsedMs: number;
};

export type MatrixPathMapProps = {
  route: LatLng[];
  /** Forwarded to MapParent; controls its internal mode/UX. */
  state?: 'start' | 'finish';      // <-- NEW (default 'finish')
  corridorWidth?: number;
  startRadius?: number;
  finishRadius?: number;
  ignoreIfAccuracyAbove?: number;
  onStatus?: (s: MatrixPathStatus) => void;
  onFinish?: (s: MatrixPathStatus) => void;
  polylineColor?: string;
  progressColor?: string;
};

/** ── Geodesy helpers (local planar approximation) ─────────────────────── */
const DEG_LAT_M = 110540;
const DEG_LNG_M = (latDeg: number) => 111320 * Math.cos((latDeg * Math.PI) / 180);

function metersBetween(a: LatLng, b: LatLng) {
  const kx = DEG_LNG_M((a.latitude + b.latitude) / 2);
  const dx = (b.longitude - a.longitude) * kx;
  const dy = (b.latitude - a.latitude) * DEG_LAT_M;
  return Math.hypot(dx, dy);
}
function toXY(p: LatLng, origin: LatLng) {
  const kx = DEG_LNG_M((p.latitude + origin.latitude) / 2);
  return { x: (p.longitude - origin.longitude) * kx, y: (p.latitude - origin.latitude) * DEG_LAT_M };
}
function fromXY(x: number, y: number, origin: LatLng) {
  const kx = DEG_LNG_M(origin.latitude);
  return { latitude: origin.latitude + y / DEG_LAT_M, longitude: origin.longitude + x / kx };
}

/** ── Precompute route geometry ────────────────────────────────────────── */
type Precomp = {
  origin: LatLng;
  xy: { x: number; y: number }[];
  segLen: number[];
  cumLen: number[];
  total: number;
};
function precompute(route: LatLng[]): Precomp {
  const origin = route[0];
  const xy = route.map((p) => toXY(p, origin));
  const segLen: number[] = [];
  const cumLen: number[] = [0];
  for (let i = 0; i < xy.length - 1; i++) {
    const len = Math.hypot(xy[i + 1].x - xy[i].x, xy[i + 1].y - xy[i].y);
    segLen.push(len);
    cumLen.push(cumLen[i] + len);
  }
  return { origin, xy, segLen, cumLen, total: cumLen[cumLen.length - 1] };
}

function nearestPointOnRoute(
  pre: Precomp,
  point: LatLng
): { dist: number; segIdx: number; t: number; along: number; proj: LatLng } {
  const p = toXY(point, pre.origin);
  let best = { dist2: Number.POSITIVE_INFINITY, segIdx: 0, t: 0, projX: 0, projY: 0, along: 0 };
  for (let i = 0; i < pre.xy.length - 1; i++) {
    const a = pre.xy[i], b = pre.xy[i + 1];
    const vx = b.x - a.x, vy = b.y - a.y;
    const wx = p.x - a.x, wy = p.y - a.y;
    const vv = vx * vx + vy * vy || 1e-9;
    let t = (vx * wx + vy * wy) / vv;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    const projX = a.x + t * vx, projY = a.y + t * vy;
    const dx = p.x - projX, dy = p.y - projY;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < best.dist2) {
      best = { dist2, segIdx: i, t, projX, projY, along: pre.cumLen[i] + t * pre.segLen[i] };
    }
  }
  return { dist: Math.sqrt(best.dist2), segIdx: best.segIdx, t: best.t, along: best.along, proj: fromXY(best.projX, best.projY, pre.origin) };
}

/** ── Component (pure; no auto-pauses; no mph) ─────────────────────────── */
const OFFROUTE_HYST_COUNT = 2;

export default function MatrixPathMap({
  route,
  state = 'finish',                 // <-- NEW default
  corridorWidth = 20,
  startRadius = 15,
  finishRadius = 15,
  ignoreIfAccuracyAbove = 35,
  onStatus,
  onFinish,
  polylineColor = '#FF6B00',
  progressColor = '#00D28E',
}: MatrixPathMapProps) {
  const hasRoute = route && route.length >= 2;
  const pre = React.useMemo(() => (hasRoute ? precompute(route) : null), [hasRoute, route]);

  // State + refs
  const [progressMeters, _setProgressMeters] = React.useState(0);
  const [onRoute, setOnRoute] = React.useState(true);
  const [finished, setFinished] = React.useState(false);

  const progressRef = React.useRef(0);
  const setProgressMeters = (v: number) => { progressRef.current = v; _setProgressMeters(v); };

  const startedAtRef = React.useRef<number | null>(null);
  const offRouteCountRef = React.useRef(0);
  const finishedRef = React.useRef(false);
  React.useEffect(() => { finishedRef.current = finished; }, [finished]);

  const nowElapsedMs = React.useCallback((now: number) => {
    const t0 = startedAtRef.current;
    return t0 ? Math.max(0, now - t0) : 0;
  }, []);

  const progressCoords = React.useMemo<LatLng[]>(() => {
    if (!pre || progressMeters <= 0) return hasRoute ? [route[0]] : [];
    const coords: LatLng[] = [];
    let remaining = progressMeters;

    for (let i = 0; i < route.length - 1; i++) {
      const seg = pre.segLen[i];
      if (remaining >= seg) {
        coords.push(route[i]);
        remaining -= seg;
      } else {
        const t = seg > 0 ? remaining / seg : 0;
        const a = pre.xy[i], b = pre.xy[i + 1];
        const x = a.x + t * (b.x - a.x);
        const y = a.y + t * (b.y - a.y);
        coords.push(route[i]);
        coords.push(fromXY(x, y, pre.origin));
        break;
      }
    }
    if (coords.length === 0) coords.push(route[0]);
    return coords;
  }, [pre, route, hasRoute, progressMeters]);

  const handleMove = React.useCallback((e: UserLocationChangeEvent) => {
    if (!pre || !hasRoute) return;

    const c = e.nativeEvent.coordinate;
    if (!c) return;

    const move = {
      coord: { latitude: c.latitude, longitude: c.longitude } as LatLng,
      accuracy: c.accuracy,
      timestamp: c.timestamp ?? Date.now(),
    };

    if (move.accuracy && move.accuracy > ignoreIfAccuracyAbove) return;

    const now = move.timestamp;

    // Auto-start when entering the start gate
    if (!startedAtRef.current) {
      const dStart = metersBetween(move.coord, route[0]);
      if (dStart <= startRadius) startedAtRef.current = now;
    }

    // Projection + deviation
    const nearest = nearestPointOnRoute(pre, move.coord);
    const deviation = nearest.dist;
    const isOnRoute = deviation <= corridorWidth;

    // Hysteresis for clean status
    if (!isOnRoute) offRouteCountRef.current += 1;
    else offRouteCountRef.current = 0;
    const declaredOnRoute = offRouteCountRef.current < OFFROUTE_HYST_COUNT;
    setOnRoute(declaredOnRoute);

    // Monotonic progress
    const newProgress = Math.max(progressRef.current, nearest.along);
    if (newProgress !== progressRef.current) setProgressMeters(newProgress);

    // Finish gate by along-route proximity
    if (!finishedRef.current && startedAtRef.current) {
      const remainingAlong = (pre.total - newProgress);
      if (remainingAlong <= finishRadius) {
        setFinished(true);
        onFinish?.({
          onRoute: declaredOnRoute,
          deviationMeters: deviation,
          progressMeters: pre.total,
          progressRatio: 1,
          totalRouteMeters: pre.total,
          started: true,
          finished: true,
          elapsedMs: nowElapsedMs(now),
        });
      }
    }

    // Live status
    onStatus?.({
      onRoute: declaredOnRoute,
      deviationMeters: deviation,
      progressMeters: newProgress,
      progressRatio: pre.total > 0 ? Math.min(1, newProgress / pre.total) : 0,
      totalRouteMeters: pre.total,
      started: !!startedAtRef.current,
      finished: finishedRef.current,
      elapsedMs: nowElapsedMs(now),
    });
  }, [
    pre,
    hasRoute,
    ignoreIfAccuracyAbove,
    route,
    startRadius,
    corridorWidth,
    finishRadius,
    nowElapsedMs,
    onFinish,
    onStatus,
  ]);

  return (
    <MapParent
      state={state}                             // <-- forward required prop
      onUserLocationChangeAlso={handleMove}
      showsUserLocation
    >
      {hasRoute && <Polyline coordinates={route} strokeColor={polylineColor} strokeWidth={6} />}

      {hasRoute && progressCoords.length >= 2 && (
        <Polyline coordinates={progressCoords} strokeColor={progressColor} strokeWidth={8} />
      )}

      {hasRoute && (
        <>
          <Marker coordinate={route[0]} title="Start" />
          <Circle center={route[0]} radius={startRadius} strokeWidth={1} strokeColor="#2ecc71" />
          <Marker coordinate={route[route.length - 1]} title="Finish" />
          <Circle center={route[route.length - 1]} radius={finishRadius} strokeWidth={1} strokeColor="#e74c3c" />
        </>
      )}
    </MapParent>
  );
}
