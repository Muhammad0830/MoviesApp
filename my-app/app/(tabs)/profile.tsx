import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useRouter } from "expo-router";
import { GetUser } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useAuth } from "@/contexts/authContext";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const profile = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState<any>({});

  console.log("user id", user?.id);

  const { data, loading, error, reset, refetch } = useFetch(() =>
    GetUser(user?.id as any)
  );

  useEffect(() => {
    setUserData(data);
    console.log("data", data);
  }, [data]);

    useFocusEffect(
      useCallback(() => {
        refetch();
        return () => {};
      }, [])
    );
  

  const handleLogout = async () => {
    console.log("logout");
    await SecureStore.deleteItemAsync("token");
    setUser(null); // Reset user state
    router.replace("(auth)/login" as any);
  };

  // if (!user?.id) {
  //   return (
  //     <View className="bg-bg_primary flex-1 items-center justify-center">
  //       <Text className="text-white text-[20px]">Loading ...</Text>
  //     </View>
  //   );
  // }

  if(loading) {
    return (
      <View className="flex-1 bg-bg_primary justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-bg_primary px-4 ">
      <View className="absolute top-0 bottom-0 left-0 right-0 items-center">
        <Image source={images.bg} className="absolute flex-1 z-0" />
        <Image
          source={icons.logo}
          className="absolute mx-auto w-12 h-10 mt-10 mb-5"
        />
      </View>
      <Text className="text-white text-[24px] mt-10 mb-14 font-bold">
        Profile
      </Text>

      <View className="justify-center">
        <Text className="text-white text-[14px]">
          Username:{" "}
          <Text className="text-[16px] font-bold">{userData?.username}</Text>
        </Text>
        <Text className="text-white text-[14px] mb-4 mt-2">
          Email:{" "}
          <Text className="text-[16px] font-bold">{userData?.email}</Text>
        </Text>
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
