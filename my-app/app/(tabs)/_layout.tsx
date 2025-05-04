import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import highlight from "@/assets/images/highlight.png";

const TabIcon = ({ focused, text, icon }: any) => {
  return focused ? (
    <ImageBackground
      source={images.highlight}
      className={`flex flex-row min-w-[92px] min-h-16 flex-1 justify-center mt-4 items-center rounded-full overflow-hidden`}
    >
      <Image source={icon} tintColor="#151312" className="size-5" />
      <Text className="text-secondary text-base font-semibold ml-2">
        {text}
      </Text>
    </ImageBackground>
  ) : (
    <View className="flex flex-col size-full min-h-16 mt-4 flex-1 justify-center items-center rounded-full overflow-hidden">
      <Image source={icon} tintColor={'#f2f3f5'} className="size-5" />
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 0,
        },
        tabBarStyle: {
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 12,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#0f0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} text={"Home"} icon={icons.home} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} text={"Search"} icon={icons.search} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} text={"Saved"} icon={icons.save} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} text={"Profile"} icon={icons.person} />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
