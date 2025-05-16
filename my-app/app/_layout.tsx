import { Stack } from "expo-router";
import React from "react";
import "./globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AuthProvider } from "@/contexts/authContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movies/[id]" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
