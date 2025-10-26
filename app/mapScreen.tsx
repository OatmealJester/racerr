import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Back from "../assets/ui/back.svg";
import IconButton from '../components/IconButton';
import Interactables4Map from '../components/Interactables4Map';
import MapComponent from '../components/maps/RecordingMap';

const router = useRouter();

function MapScreenContent() {
  const insets = useSafeAreaInsets();
  const [miles, setMiles] = useState(0);
  const [mph, setMph] = useState(0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.backButtonContainer,
          {
            top: insets.top + 10, // add padding for notch/status bar
            left: 10,
          },
        ]}
      >
        <IconButton
          IconComponent={Back}
          size={24}
          onPress={() => router.back()}
        />
      </View>
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
  },
  backButtonContainer:{
    position: "absolute",
    zIndex: 2, 
    right:20,
  },
});
