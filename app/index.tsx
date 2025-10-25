import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import MapComponent from '../components/maps/MapParent';

export default function Index() {
  const [showMap, setShowMap] = useState(false);

  return (
    <View style={styles.container}>
      {showMap ? (
        <>
          <MapComponent/>
          <View style={modalStyles.closeButtonContainer}>
            <Button
              theme="primary"
              label="Close"
              onPress={() => setShowMap(false)}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>Home screen</Text>
          <View>
            <Button
              theme="primary"
              label="Map"
              onPress={() => setShowMap(true)}
            />
            <Button label="Use this photo" />
          </View>
        </>
      )}
    </View>
  );
}

const modalStyles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: 60, 
    left: 20,
    zIndex: 1,
  },
});
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
});

