import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name = "userName"  options={{ headerShown: false }} />
          <Stack.Screen name = "home"  options={{ headerShown: false }} />
          <Stack.Screen name = "favoriteScreen" options={{ headerShown: false }} />
          <Stack.Screen name = "mapScreen" options={{ headerShown: false }} />
        </Stack>      
    </GestureHandlerRootView>
  );
}

