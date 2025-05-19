import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value: string;
  onChangeText: (text: string) => void;
  optionsOnPress?: () => void;
  page?: string;
}

const searchBar = ({
  placeholder,
  onPress,
  value,
  onChangeText,
  optionsOnPress,
  page,
}: Props) => {
  return (
    <View className="w-full flex-row items-center justify-between bg-dark-200 rounded-full px-4 py-1">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor={"#ab8bff"}
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={"#a9b5db"}
        className="flex-1 mx-2 h-12 text-white"
      />
      {page === "search" ? (
        <TouchableOpacity
          className="border border-primaryDarker h-[30px] aspect-square rounded-full justify-center items-center"
          onPress={optionsOnPress}
        >
          <FontAwesome name="bars" size={15} color="#8a5fed" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default searchBar;
