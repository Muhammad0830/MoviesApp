import { View, Text, Image } from "react-native";
import React from "react";

const recommendedMovies = ({ movie }: any) => {
  return (
    <View className="flex-1 rounded-md bg-bg_primary border border-white">
      <View>
        <Image
          source={{ uri: movie.image }}
          className="w-full aspect-[3/4] rounded-lg"
          resizeMode="cover"
        />
      </View>
      <View className="p-2">
      <Text className="text-white text-[14px] font-bold" numberOfLines={1}>{movie.title}</Text>
      <View></View>
      </View>
    </View>
  );
};

export default recommendedMovies;
