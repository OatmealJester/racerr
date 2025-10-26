import type { ComponentType } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import Finish from "../assets/ui/finish.svg";
import Play from "../assets/ui/play.svg";

type Interactables4MapProps = {
  state: "start" | "finish";
  onPress?: () => void;
  distance: number;
  mph: number;
};

export default function Interactables4Map({
  state,
  onPress,
  distance,
  mph,
}: Interactables4MapProps) {
  // Pick correct icon for starting and ending a race
  let MainIcon: ComponentType<SvgProps> = Play;
  if (state === "finish") MainIcon = Finish;

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

        {/* Center button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          style={styles.button}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MainIcon width={28} height={28} />
        </TouchableOpacity>

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
    bottom: 24,
    alignItems: "center",
  },
  banner: {
    minWidth: 300,
    width: "92%",
    height: BANNER_HEIGHT,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",

    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  // Center button is truly centered; metrics are absolutely positioned at edges
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
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
  },
});
