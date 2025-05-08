import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const MovieDetails = ({ movie }: any) => {
  return (
    <View className="w-full flex-1 bg-primary px-4">
      <View className="flex items-center mt-10">
        <Image
          source={{ uri: movie.image }}
          className="w-[60%] h-[300px] rounded-lg"
          resizeMode="cover"
        />
      </View>

      

      <TouchableOpacity
        onPress={() => {}} // Toggle the BottomSheet expansion
      >
        <View className="p-2 rounded-md bg-white">
          <Text className="text-primary text-[12px] font-bold" numberOfLines={3}>{movie.description}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
