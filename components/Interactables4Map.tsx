import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";


import finish from "@/assets/ui/finish.svg";
import play from "@/assets/ui/play.svg";


type Interactables4MapProps = {
  state: "start" | "finish";
  onPress?: () => void;
  distance: number,
  mph:number,

};

export default function Interactables4Map({
  state,
  onPress,
}: Interactables4MapProps) {
 
 
  // Pick correct icon for starting and ending a race
  let MainIcon: React.FC<SvgProps>;
  switch (state) {
    case "start":
      MainIcon = play;
      break;
    case "finish":
      MainIcon = finish;
      break;
    default:
      MainIcon = play; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
      //distance we pass from outside the component as a prop
      </View>

      <View style={styles.buttonWrapper}>
      // start and finish button
      </View>

      <View style={styles.textWrapper}>
      // mph we pass from outside the component as a prop
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between", // ✅ edges
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "transparent",
  },
  textWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
    buttontWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
