import {
  ActivityIndicator,
  Text,
  View,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchMovies, GetSavedMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import HorizontalMovieCard from "@/components/horizontalMovieCard";
import MovieCard from "@/components/movieCard";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/authContext";

const saved = () => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const { user } = useAuth();

  const {
    data: movies,
    loading,
    error,
    reset,
    refetch,
  } = useFetch(() => GetSavedMovies(user?.id));

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user]);

  const {
    data: Recommended_movies,
    loading: recommended_loading,
    error: recommended_error,
    reset: resetRecommended,
    refetch: refetchRecommended,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    setSavedMovies(movies);
  }, [movies]);

  useEffect(() => {
    setRecommendedMovies(Recommended_movies);
  }, [Recommended_movies]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {};
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg_primary">
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg_primary">
      <FlatList
        data={recommendedMovies}
        renderItem={({ item }: any) => (
          <MovieCard item={item} gridNum={2} gap={6 as number} />
        )}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          marginVertical: 6,
          justifyContent: "space-between",
          paddingHorizontal: 7,
        }}
        style={{}}
        ListHeaderComponent={
          <View>
            <Image source={images.bg} className="absolute w-full z-0" />
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-10 mb-5 mx-auto"
            />
            <View className="mt-5 mx-2">
              <View>
                <Text className="text-white text-[24px] font-bold">
                  Saved Movies
                </Text>
              </View>
              {movies?.length > 0 ? (
                <FlatList
                  data={movies}
                  horizontal
                  keyExtractor={(item: any) => item.id.toString()}
                  renderItem={({ item, index }: any) => (
                    <View style={{ width: 150, height: 190, marginRight: 10 }}>
                      <HorizontalMovieCard item={item} index={index} />
                    </View>
                  )}
                  className="-translate-x-1 mb-2"
                  style={{ height: 200 }}
                  contentContainerStyle={{
                    paddingHorizontal: 4,
                    alignItems: "center",
                  }}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <View className="h-60 justify-center items-center">
                  <Text className="text-white text-[20px] font-bold">
                    No movies saved
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-white text-[24px] font-bold">
                  Recommended just for you
                </Text>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default saved;
