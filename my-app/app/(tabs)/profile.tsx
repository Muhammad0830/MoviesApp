import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const profile = () => {
  const router = useRouter();

  const handleLogout = async () => {
    console.log("logout");
    await SecureStore.deleteItemAsync("token");
    router.replace("(auth)/login" as any);
  };

  return (
    <View className="flex-1 bg-bg_primary px-4 ">
      <Text className="text-white text-[20px] my-4 font-bold">Profile</Text>

      <View className="justify-center">
        <Text className="text-white text-[14px] my-4">Username: </Text>
        <Text className="text-white text-[14px] my-4">Email: </Text>
        <Text className="text-white text-[14px] my-4">Address: </Text>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <View className="bg-red-500 rounded-full p-2 justify-center items-center">
          <Text className="text-white text-xl">logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
