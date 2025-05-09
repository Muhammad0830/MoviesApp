import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const HorizontalMovieCard = ({ item, gap }: any) => {
  return (
    <Link href={`/movies/${item.id}` as any} asChild>
      <TouchableOpacity
        className='w-[150px] h-full'
      >
        <View
          className={`rounded-md h-full border border-primary/40 flex flex-col overflow-hidden`}
          style={{ marginHorizontal: gap }}
        >
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
                <Text className="text-white text-[8px]">{item.score / 10}</Text>
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
