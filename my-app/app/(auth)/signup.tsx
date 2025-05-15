import { View, Text, Button, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import { URL_CONFIG } from "@/services/api";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

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
    <View className="bg-bg_primary flex-1 px-4">
      <Image
        source={images.bg}
        className="absolute left-0 right-0 top-0 bottom-0 z-0"
      />
      <Image source={icons.logo} className="w-12 h-10 mt-10 mb-5 mx-auto" />
      <View className="flex-1 justify-center">
        <View className="border border-white rounded-lg px-2 mb-2">
          <TextInput
            placeholder="Username"
            onChangeText={setName}
            className="text-white"
            placeholderTextColor={"gray"}
          />
        </View>
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
        <TouchableOpacity
          className="bg-blue-500 justify-center items-center rounded-lg px-2 py-2"
          onPress={handleSignUp}
        >
          <Text className="text-white text-[20px] font-bold">Sign Up</Text>
        </TouchableOpacity>
        <View className="mt-1 flex-row gap-2 items-end">
          <Text className="text-white text-[14px]">
            Already have an account?
          </Text>
          <Text
            className="text-blue-500 text-[16px] italic"
            onPress={() => router.replace("(auth)/login" as any)}
          >
            Login
          </Text>
        </View>
      </View>
    </View>
  );
};

export default signup;
