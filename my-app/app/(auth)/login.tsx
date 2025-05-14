import { View, TextInput, Button, Alert, Text } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { URL_CONFIG } from "@/services/api";
import { useAuth } from "@/contexts/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log('token from storage', AsyncStorage.getItem("token"))
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
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text>
        you don't have an account?{" "}
        <Text
          className="text-blue-500 text-[14px] italic"
          onPress={() => router.replace("(auth)/signup" as any)}
        >
          signup
        </Text>
      </Text>
    </View>
  );
}
