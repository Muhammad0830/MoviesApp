import { View, TextInput, Button, Alert, Text, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { URL_CONFIG } from "@/services/api";
import { useAuth } from "@/contexts/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setUser } = useAuth();

  const decodeJWT = (token: string): any => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  const loadUser = async () => {
    const token = await SecureStore.getItemAsync("token");
    console.log("token", token);

    if (!token || typeof token !== "string" || token.trim() === "") {
      console.log("❌ No valid token found");
      return;
    }

    try {
      console.log("decode working");
      const decoded = decodeJWT(token);
      console.log("decoded", decoded);
      if (Date.now() > decoded.exp * 1000) {
        await SecureStore.deleteItemAsync("token");
        // navigation.replace("/(auth)/login");
        return;
      }
      await AsyncStorage.setItem("token", token);
      console.log("token from storage", AsyncStorage.getItem("token"));
      setUser({ id: decoded.id, email: decoded.email });
      router.replace("(tabs)" as any);
      console.log("setUser", { id: decoded.id, email: decoded.email });
    } catch (err) {
      console.log("❌ Error decoding token:", err);
      await SecureStore.deleteItemAsync("token");
    }
  };

  const handleLogin = async () => {
    console.log("login worked");
    const endpoint = `${URL_CONFIG.BASE_URL}/auth/login`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("ok");
      await SecureStore.setItemAsync("token", data.token);
      loadUser();
      router.replace("(tabs)" as any);
    } else {
      console.log("error");
      Alert.alert("Login failed", data.error || "Invalid credentials");
    }
  };

  return (
    <View className="bg-bg_primary flex-1 px-4">
      <Image
        source={images.bg}
        className="absolute left-0 right-0 top-0 bottom-0 z-0"
      />
      <Image source={icons.logo} className="w-12 h-10 mt-10 mb-5 mx-auto" />
      <View className="flex-1 justify-center">
        <View className="border border-white rounded-lg px-2">
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            className="text-white"
            placeholderTextColor={"gray"}
          />
        </View>
        <View className="border border-white rounded-lg px-2 my-2">
          <TextInput
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            className="text-white"
            placeholderTextColor={"gray"}
          />
        </View>
        <TouchableOpacity className="bg-blue-500 justify-center items-center rounded-lg px-2 py-2" onPress={handleLogin}>
          <Text className="text-white text-[20px] font-bold">Login</Text>
        </TouchableOpacity>
        <View className="mt-1 flex-row gap-2 items-end">
          <Text className="text-white text-[14px]">You don't have an account?</Text>
          <Text
            className="text-blue-500 text-[16px] italic"
            onPress={() => router.replace("(auth)/signup" as any)}
          >
            Signup
          </Text>
        </View>
      </View>
    </View>
  );
}
