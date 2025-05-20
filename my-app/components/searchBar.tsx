import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { icons } from "@/constants/icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { X } from "lucide-react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

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
  const [isOpen, setIsOpen] = React.useState(false);

  const containerWidth = useRef(new Animated.Value(1)).current;
  const paddingLeft = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(containerWidth, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(paddingLeft, {
      toValue: isOpen ? 0 : 40,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(opacity, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const interpolatedWidth = containerWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [60, width * 0.95],
  });

  return (
    <View
      className={`w-full flex-row ${
        page === "search" ? "justify-end" : "justify-center"
      }`}
    >
      <Animated.View
        className={`w-full flex-row items-center justify-between rounded-full px-4 py-1 bg-dark-200 ${
          isOpen ? "opacity-60" : "opacity-100"
        }`}
        style={{ width: interpolatedWidth, paddingLeft: paddingLeft }}
      >
        <Animated.Image
          source={icons.search}
          className="size-5 absolute left-5"
          resizeMode="contain"
          tintColor={"#ab8bff"}
          style={{ opacity: opacity }}
        />
          <TextInput
            onPress={onPress}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={isOpen ? "#00000000" : "#8a5fed"}
            className="flex-1 h-12 text-white"
            editable={!isOpen}
          />
        {page === "search" ? (
          <TouchableOpacity
            className="border border-primaryDarker h-[30px] aspect-square rounded-full justify-center items-center"
            onPress={() => {
              optionsOnPress?.();
              setIsOpen((prev) => !prev);
            }}
          >
            {isOpen ? (
              <X size={20} color="#FF0000" />
            ) : (
              <FontAwesome name="bars" size={15} color="#8a5fed" />
            )}
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default searchBar;
