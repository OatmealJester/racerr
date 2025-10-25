import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapParent from "../components/maps/MapParent";

export default function recordScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapParent/>

        {/* HUD Overlay - Bottom */}
        {/* <GameInteractables
          playerClass="cleric"
          cameraCooldown={false}
          classAbilityCooldown={false}
          onCameraPress={() => {
            console.log("Camera pressed");
            router.push("/gameScreen_1");
          }}
          onClassAbilityPress={() => console.log("Class ability pressed")}
          showMapButton={false}
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
});
