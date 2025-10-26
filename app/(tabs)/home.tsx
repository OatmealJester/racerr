import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { default as HomeIcon, default as StarIcon } from '../../assets/images/home.svg';
import Button from '../../components/Button';
import MapComponent from '../../components/maps/MapParent';
import { startLocationTracking, stopLocationTracking } from '../../logic/location_tracker';

export default function Index() {
  
  const [showMap, setShowMap] = useState(false);
  return (
    
    <View style={styles.mainWrapper}>

      <View style={styles.container}>
        {showMap ? (
          <>
            <MapComponent />
            <View style={modalStyles.closeButtonContainer}>
              <Button
                theme="primary"
                label="Close"
                onPress={() => {
                  setShowMap(false)
                  stopLocationTracking()
                }
              }
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
              onPress={() => {
                setShowMap(true)
                startLocationTracking(() => { });
              }
              }
            />
          </View>
        </>
      )}
    </View>
      <View style={styles.taskBar}>

        {/* Icon 1: Home */}
        <Link href="/home">
          <HomeIcon width={80} height={80} />
        </Link>

        {/* Icon 2: Star */}
        <Link href="/favoriteScreen">
          <StarIcon width={80} height={80} />
        </Link>
      </View>
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
  mainWrapper: {
    flex:1,
    backgroundColor: '#25292e',
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
  },
  image: {
    width: 80,
    height: 80,
  }
});

