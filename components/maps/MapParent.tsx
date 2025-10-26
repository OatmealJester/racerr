import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  LatLng,
  MapViewProps,
  PROVIDER_GOOGLE,
  UserLocationChangeEvent,
} from 'react-native-maps';

import { haversineMeters } from '../../logic/geo_utils';
import { useFinishMetrics } from '../../logic/useFinishMetrics';

type Props = Omit<MapViewProps, 'onUserLocationChange' | 'style'> & {
  state: 'start' | 'finish';
  minDistance?: number;
  onMetrics?: (miles: number, mph: number) => void;
  onUserLocationChangeAlso?: (e: UserLocationChangeEvent) => void;
  children?: React.ReactNode;
};

const MapParent = forwardRef<MapView, Props>(function MapParent(
  {
    state,
    minDistance = 3,
    onMetrics,
    onUserLocationChangeAlso,
    children,
    provider = PROVIDER_GOOGLE,
    ...rest
  },
  ref
) {
  // last point that cleared the significance gate
  const lastSig = useRef<LatLng | null>(null);

  // your metrics hook (also uses minDistance internally)
  const { miles, mph, onUserLocationChange: metricsOnChange, reset } =
    useFinishMetrics({ state, minDistance });

  // bubble metrics up
  useEffect(() => {
    onMetrics?.(miles, mph);
  }, [miles, mph, onMetrics]);

  // reset local gate + metrics when entering "start"
  useEffect(() => {
    if (state === 'start') {
      lastSig.current = null;
      reset();
    }
  }, [state, reset]);

  const handle = useCallback(
    (e: UserLocationChangeEvent) => {
      const c = e.nativeEvent?.coordinate;
      if (!c) return;
      const pt: LatLng = { latitude: c.latitude, longitude: c.longitude };

      // accept first fix immediately
      if (!lastSig.current) {
        lastSig.current = pt;
        metricsOnChange(e);            // primes hook
        onUserLocationChangeAlso?.(e); // let children draw first point
        return;
      }

      // significance gate
      const d = haversineMeters(lastSig.current, pt);
      if (d < minDistance) return;

      lastSig.current = pt;
      metricsOnChange(e);            // updates miles/mph
      onUserLocationChangeAlso?.(e); // tells RecordingMap to extend trail
    },
    [minDistance, metricsOnChange, onUserLocationChangeAlso]
  );

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFillObject}
      provider={provider}
      showsUserLocation
      onUserLocationChange={handle}
      // you can add initialRegion / camera defaults here if you want
      {...rest}
    >
      {children}
    </MapView>
  );
});

export default MapParent;
