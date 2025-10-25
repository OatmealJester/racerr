import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import MapComponent from '../../components/maps/MapParent';
import { startLocationTracking, stopLocationTracking } from '../../logic/location_tracker';

export default function mapScreen(){
    const [showMap, setShowMap] = useState(false);

    return (
        <View style={styles.container}>
          {showMap ? (
            <>
              <MapComponent />
              <View style={styles.closeButtonContainer}>
                <Button
                  theme="primary"
                  label="Close"
                  onPress={() => {
                    setShowMap(false)
                    stopLocationTracking()
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <Text style = {styles.text}>Home screen</Text>
              <View>
                <Button
                  theme="primary"
                  label="Map"
                  onPress={() => {
                    setShowMap(true)
                    startLocationTracking(() => { });
                  }}
                />
            </View>
            </>
        )}
    </View>
    )
}


const styles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  taskBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
  },

  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 80,
    height: 80,
 },
});