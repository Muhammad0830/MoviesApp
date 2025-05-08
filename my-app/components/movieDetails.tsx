import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import "react-native-reanimated";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import RecommendedMovies from "@/components/recommendedMovies";
import MovieCard from "./movieCard";

const MovieDetails = ({ movie }: any) => {
  const [movies, setMovies] = useState([]);
  const [shuffleMovie, setShuffleMovie] = useState([]);

  const { data, loading, error } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    if (data) {
      let filtered = data.filter(
        (item: any) =>
          item.title !== movie.title && item.description !== movie.description
      );
      setMovies(filtered);
      setShuffleMovie(randomShuffle(data) as any);
    }
  }, [data]);

  const randomShuffle = (arr: any[]) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  return (
    <View className="w-full flex-1 bg-bg_primary px-2">
      <FlatList
        data={movies}
        renderItem={({ item }: any) => (
          <MovieCard item={item} gridNum={2} gap={6 as number} />
        )}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          marginVertical: 6,
        }}
        ListHeaderComponent={
          <View className="px-2">
            <View className="flex items-center mt-10">
              <Image
                source={{ uri: movie.image }}
                className="w-[200px] h-[300px] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="flex-row justify-center">
              <View className="flex-row items-center justify-center my-4 gap-6 bg-primary/40 rounded-full py-2 px-4">
                <View className="flex-row items-center gap-2">
                  <FontAwesome name="star" size={15} color="yellow" />
                  <Text className="text-white text-[12px] font-bold">
                    {movie.score / 10} / 10
                  </Text>
                </View>
                <Text className="text-white text-[12px] font-bold">
                  {movie.running_time} minutes
                </Text>
                <Text className="text-white text-[12px] font-bold">Movie</Text>
              </View>
            </View>

            <View className="items-center mb-4">
              <Text className="text-white text-3xl font-bold">
                {movie.title}
              </Text>
              <Text className="text-white/60 text-xl font-bold">
                {movie.original_title}
              </Text>
            </View>

            <View className="flex-row justify-center items-center gap-4 mb-4">
              <View className="rounded-full px-3 h-10 items-center justify-center bg-primary/40 ">
                <Text className="text-white text-[14px] font-bold">
                  Watch Now
                </Text>
              </View>
              <View className="rounded-full w-10 aspect-square items-center justify-center bg-primary/40 ">
                <FontAwesome name="download" size={17} color="white" />
              </View>
              <View className="rounded-full w-10 aspect-square items-center justify-center bg-primary/40 ">
                <FontAwesome name="thumbs-up" size={17} color="white" />
              </View>
              <View className="rounded-full w-10 aspect-square items-center justify-center bg-primary/40 ">
                <FontAwesome name="bookmark" size={17} color="white" />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {}} // Toggle the BottomSheet expansion
            >
              <View className="pt-2 pb-8 px-3 rounded-md bg-black/30 border border-white/50 gap-4">
                <Text className="text-white text-[12px] font-bold">
                  {movie.genre ? movie.genre.join(", ") : null}
                </Text>
                <Text
                  className="text-white text-[12px] font-bold"
                  numberOfLines={3}
                >
                  {movie.description}
                </Text>
                <Text className="text-primary text-[14px] absolute right-2 bottom-1">
                  See more...
                </Text>
              </View>
            </TouchableOpacity>

            <View className="mt-6 mb-2">
              <Text className="text-white text-[20px] font-bold">
                Recommended just for you
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={<View></View>}
      />
    </View>
  );
};

export default MovieDetails;
