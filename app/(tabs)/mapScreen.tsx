import { StyleSheet, View } from 'react-native';
import Interactables4Map from '../../components/Interactables4Map';
import MapComponent from '../../components/maps/MapParent';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {/* Map fills the screen */}
      <View style={StyleSheet.absoluteFillObject}>
        <MapComponent />
      </View>

      {/* Bottom banner with default values */}
      <Interactables4Map
        state="start"
        distance={0}
        mph={0}
        onPress={() => {}}
      />
    </View>
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
