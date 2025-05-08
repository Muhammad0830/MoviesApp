import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({ item, gridNum, gap }: any) => {
//   console.log("poster", item.movie_banner);
  
  return (
    <Link href={`/movies/${item.id}` as any} asChild>
      <TouchableOpacity className={`${gridNum == 2 ? "w-1/2" : gridNum == 3 ? "w-1/3" : ""}`} >
        <View className={`rounded-md border border-primary/40 flex flex-col overflow-hidden mx-[${gap}px]`}>
          <Image
            source={{ uri: item.movie_banner }}
            className="w-full aspect-square"
          />
          <View className="p-1.5">
            <Text
              numberOfLines={1}
              className="text-white text-xs font-bold mb-1"
            >
              {item.title}
            </Text>
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row gap-1 items-center">
                <Image source={icons.star} className="w-2 h-2" />
                <Text className="text-white text-[8px]">
                  {item.score / 10}
                </Text>
              </View>
              <Text className="text-white text-[8px] font-light">
                {item.release_date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
