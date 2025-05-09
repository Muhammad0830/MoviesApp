import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import { images } from "@/constants/images";
import MovieCard from "@/components/movieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";

const search = () => {
  const [query, setQuery] = useState<String>("");
  const [filteredData, setFilteredData] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
    reset: resetMovies,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    setFilteredData(movies);
  }, [movies]);

  useEffect(() => {
    const q = query?.toLowerCase();
    const filtered = movies?.filter((item: any) =>
      item.title.toLowerCase().includes(q)
    );
    setFilteredData(filtered);
  }, [query]);

  useEffect(() => {
    if (!moviesLoading && !moviesError && !(filteredData?.length > 0)) {
      const timer = setTimeout(() => {
        setShowNoResults(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowNoResults(false);
    }
  }, [filteredData, moviesError, moviesLoading]);

  useFocusEffect(
    useCallback(() => {
      setQuery("")
      return;
    }, [])
  );

  return (
    <View className="flex-1 bg-bg_primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={filteredData}
        renderItem={({ item }: any) =>
          query ? (
            <MovieCard gridNum={2} item={item} gap={15 as number} />
          ) : null
        }
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        className="mt-5"
        columnWrapperStyle={{
          marginVertical: 5,
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
        ListHeaderComponent={
          <View className="px-3">
            <View className="mb-4">
              <SearchBar
                placeholder="Search for a movie"
                value={query as string}
                onChangeText={(text: string) => setQuery(text)}
              />
            </View>

            {moviesLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="self-center"
                />
              </View>
            ) : moviesError ? (
              <Text>Error: {moviesError?.message}</Text>
            ) : query ? (
              <View>
                <Text className="text-white text-[13px]">
                  Search results for{" "}
                  <Text className="font-bold text-[15px] text-blue-500 italic">
                    {query}
                  </Text>
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-white self-center">
                  No Movies for now
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          showNoResults ? (
            <Text className="mt-5 text-white self-center">
              No results found
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default search;
