import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import { images } from "@/constants/images";
import MovieCard from "@/components/movieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { useRouter } from "expo-router";

const search = () => {
  const router = useRouter();
  const [query, setQuery] = useState<String>("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
    // const func = async () => {
    //   if (query.trim()) {
    //     await refetchMovies();
    //   } else {
    //     resetMovies();
    //   }
    // };

    // func();

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

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={filteredData}
        renderItem={({ item }: any) =>
          query ? <MovieCard gridNum={2} item={item} /> : null
        }
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        className="px-5 mt-5"
        columnWrapperStyle={{
          gap: 10,
          marginVertical: 5,
        }}
        ListHeaderComponent={
          <>
            <View className="mb-4">
              <SearchBar
                placeholder="Search for a movie"
                value={query as string}
                onChangeText={(text: string) => setQuery(text)}
              />
            </View>

            {moviesLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="m3-10 self-center"
              />
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
          </>
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
