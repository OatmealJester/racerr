import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Interactables4Map from '../components/Interactables4Map';
import MapComponent from '../components/maps/RecordingMap';

function MapScreenContent() {
  const insets = useSafeAreaInsets();
  const [miles, setMiles] = useState(0);
  const [mph, setMph] = useState(0);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <MapComponent
          state="finish"
          onMetrics={(mi, spd) => { setMiles(mi); setMph(spd); }}
        />
      </View>

      <View
        style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0 }}
        pointerEvents="box-none"
      >
        <Interactables4Map
          distance={miles}
          mph={mph}
        />
      </View>
    </View>
  );
}

export default function MapScreen() {
  return (
    <SafeAreaProvider>
      <MapScreenContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
