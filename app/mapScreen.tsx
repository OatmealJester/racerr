import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Interactables4Map from '../components/Interactables4Map';
import MapComponent from '../components/maps/MapParent';

function MapScreenContent() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      {/* Map fills the screen */}
      <View style={StyleSheet.absoluteFillObject}>
        <MapComponent />
      </View>
      {/* Bottom banner positioned above system buttons */}
      <View style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0 }}>
        <Interactables4Map
          state="start"
          distance={0}
          mph={0}
          onPress={() => {}}
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
  text: {
    color: '#fff',
  },
  image: {
    width: 80,
    height: 80,
  }
});