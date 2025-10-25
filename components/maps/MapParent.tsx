import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';

export default function MapComponent() {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getLocation();
  }, []);

  if (!initialRegion) return null;

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    />
  );
}

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});
