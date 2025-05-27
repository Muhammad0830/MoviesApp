import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const formatNumber = (value: number): string => {
  let number = Number(value);

  return number.toString();
};

const HorizontalMovieCard = ({ item, gap, index }: any) => {
  return (
    <Link href={`/movies/${item.id}` as any} asChild>
      <TouchableOpacity className="w-[150px] h-full">
        <View
          className={`rounded-md h-full border border-primary/40 flex flex-col overflow-hidden`}
          style={{ marginHorizontal: gap }}
        >
          <View className="absolute w-7 h-7 top-1 left-1 z-10 rounded-full bg-primaryDarker border border-black/70 items-center justify-center">
            <Text className="text-white text-[14px] font-bold">
              {index + 1}
            </Text>
          </View>
          <Image
            source={{ uri: item.movie_banner }}
            className="w-full aspect-square"
          />
          <View className="p-1.5 flex-1 flex-col justify-between">
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
                  {formatNumber(item.score)}
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

export default HorizontalMovieCard;
