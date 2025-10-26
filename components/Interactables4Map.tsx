import type { ComponentType } from "react";
import { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { getMapMatch } from "../api/mapbox-fetch";
import Finish from "../assets/ui/1f3c1.svg";
import Play from "../assets/ui/play.svg";
import IconButton from '../components/IconButton';
import { uploadTrack } from "../database/upload_track";
import { createNewTrack } from "../logic/create_new_track";
import { startLocationTracking, stopLocationTracking } from "../logic/location_tracker";



type Interactables4MapProps = {
  distance: number;
  mph: number;
};

const stopTrackingProcedure = async () => {
  stopLocationTracking()
  const geometryData = await getMapMatch()
  const newTrack = createNewTrack(geometryData) 
  await uploadTrack(newTrack)
  
  //Add Modal for Track name if new race
}

export default function Interactables4Map({
  distance,
  mph,
}: Interactables4MapProps) {
  const [raceState, setRaceState] = useState<"start"|"finish">("start");
  
  const handleButtonPress = () => {
    setRaceState(currentState => {
      if (currentState === "start") {

        startLocationTracking(()=>{})
        
        return "finish";
      } else {  
        
        stopTrackingProcedure()

        return "start";
      }
    });
  };

  // Pick correct icon for starting and ending a race
  let MainIcon: ComponentType<SvgProps> = Play;
  if (raceState === "finish") MainIcon = Finish;
  
  return (
    <View pointerEvents="box-none" style={styles.container}>

      <View style={styles.banner}>
        {/* Left metric: Distance */}
        <View style={[styles.metric, styles.metricLeft]}>
          <Text style={styles.metricLabel}>DIST</Text>
          <Text style={styles.metricValue}>
            {Number.isFinite(distance) ? distance.toFixed(2) : "0.00"} mi
          </Text>
        </View>
        
        {/* Center button - needs to be centered in flow */}
        <View style={styles.buttonCenter}>
          <IconButton 
            IconComponent={MainIcon} 
            size={54} 
            onPress={handleButtonPress}
          />
        </View>
        
        {/* Right metric: Speed */}
        <View style={[styles.metric, styles.metricRight]}>
          <Text style={styles.metricLabel}>MPH</Text>
          <Text style={styles.metricValue}>
            {Number.isFinite(mph) ? Math.round(mph) : 0}
          </Text>
        </View>
      </View>
    </View>
  );
}

const BANNER_HEIGHT = 72;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  banner: {
    minWidth: 300,
    width: "92%",
    height: BANNER_HEIGHT,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.50)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  metric: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 14,
    minWidth: 84,
  },
  metricLeft: {
    left: 10,
    alignItems: "flex-start",
  },
  metricRight: {
    right: 10,
    alignItems: "flex-end",
  },
  metricLabel: {
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.9,
    color: "#fff",
  },
  metricValue: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  }
});