import { Link } from 'expo-router';
//import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
//import Button from '../../components/Button';
//import MapComponent from '../../components/maps/MapParent';
//rimport { startLocationTracking, stopLocationTracking } from '../../logic/location_tracker';

export default function favoriteScreen() {
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.text}>Future Favorites</Text>
    </View>
    
    <View style={styles.taskBar}>

    {/* Icon 1: Home */}
    <Link href="/home">
        <Image
            source={require('../../assets/images/home.svg')}
            style={styles.image}
        />
    </Link>

    {/* Icon 2: Star */}
        <Link href="/favoriteScreen">
          <Image
            source={require('../../assets/images/star.svg')}
            style={styles.image}
          />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});