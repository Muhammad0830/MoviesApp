import { View, Text, Button, Alert } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import { URL_CONFIG } from "@/services/api";

const signup = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    console.log("working");
    const endpoint = `${URL_CONFIG.BASE_URL}/auth/signup`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    console.log("working response");

    const data = await res.json();
    if (res.ok) {
      console.log("ok");
      await SecureStore.setItemAsync("token", data.token);
      console.log("token", data.token);
      router.replace("(tabs)" as any);
    } else {
      console.log("error");
      Alert.alert("Sign Up failed", data.error || "Invalid credentials");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" onChangeText={setName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text>
        you don't have an account?{" "}
        <Text
          className="text-blue-500 text-[14px] italic"
          onPress={() => router.replace("(auth)/login" as any)}
        >
          login
        </Text>
      </Text>
    </View>
  );
};

export default signup;
