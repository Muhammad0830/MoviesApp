import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({ item, gridNum, gap }: any) => {
  const screenWidth = Dimensions.get("window").width - 15;
  const totalGaps = gap * (gridNum - 1);

  const itemWidth = (screenWidth - totalGaps) / gridNum;

  const formatNumber = (value: number): string => {
    let number = Number(value);

    return number.toString();
  };

  return (
    <Link href={`/movies/${item.id}` as any} asChild>
      <TouchableOpacity>
        <View
          style={{ width: itemWidth }}
          className={`rounded-md border border-primary/40 flex flex-col overflow-hidden`}
        >
          <Image
            source={{ uri: item.movie_banner }}
            className="w-full aspect-square rounded-md"
          />
          <View className="p-1.5">
            <Text
              numberOfLines={1}
              className={`text-white text-[${
                gridNum == 3 ? 10 : gridNum == 2 ? 14 : 0
              }px] font-bold mb-1`}
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

export default MovieCard;
