import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import "./globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-reanimated";
import jwt_decode from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { AuthProvider } from "@/contexts/authContext";

export default function RootLayout() {
  const router = useRouter();

  // function decodeJWT(token: string): any {
  //   try {
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const jsonPayload = decodeURIComponent(
  //       atob(base64)
  //         .split("")
  //         .map((c) => {
  //           return `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`;
  //         })
  //         .join("")
  //     );
  //     return JSON.parse(jsonPayload);
  //   } catch (e) {
  //     throw new Error("Invalid JWT token");
  //   }
  // }

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await SecureStore.getItemAsync("token");
  //     console.log("✅ Retrieved token:", token);

  //     if (!token || typeof token !== "string" || token.trim() === "") {
  //       console.log("❌ No valid token found");
  //       router.replace("/(auth)/login");
  //       return;
  //     }

  //     try {
  //       const decoded = decodeJWT(token);
  //       console.log("✅ Decoded token:", decoded);
  //       if (Date.now() > decoded.exp * 1000) {
  //         await SecureStore.deleteItemAsync("token");
  //         router.replace("/(auth)/login");
  //         return;
  //       }
  //       router.replace("(tabs)" as any);
  //     } catch (error) {
  //       console.log("❌ Error decoding token:", error);
  //       await SecureStore.deleteItemAsync("token");
  //       router.replace("/(auth)/login");
  //     }
  //   };

  //   checkAuth();
  // }, []);

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
