// MapParent.tsx
import * as Location from 'expo-location';
import React, { forwardRef, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';

type MapParentProps = React.PropsWithChildren<{}>;

const MapParent = forwardRef<MapView, MapParentProps>(function MapParent(
  { children },
  ref
) {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      if (!alive) return;
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
    return () => { alive = false; };
  }, []);

  if (!initialRegion) return null;

  return (
    <MapView
      ref={ref}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {children}
    </MapView>
  );
});

export default MapParent;

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});
