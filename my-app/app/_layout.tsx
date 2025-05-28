import { Stack } from "expo-router";
import React from "react";
import "./globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AuthProvider } from "@/contexts/authContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar
          barStyle="dark-content" // options: 'default', 'light-content', 'dark-content'
          backgroundColor="#b297f0" // Android only
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movies/[id]" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
