import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import { images } from "@/constants/images";
import MovieCard from "@/components/movieCard";
import useFetch from "@/services/useFetch";
import { GetSearchMovies } from "@/services/api";
import { useFocusEffect } from "expo-router";
import debounce from "lodash.debounce";

const defaultParams = {
  search: "",
  sortBy: "id",
  order: "ASC",
  genre: "",
  limit: 10,
  page: 1,
  minRating: 0,
  minViews: 0,
  minFavorites: 0,
};

const search = () => {
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(false);

  const {
    data,
    loading: searchMoviesLoading,
    error: searchMoviesError,
    refetch: refetchSearchMovies,
    reset: resetSearchMovies,
  } = useFetch(GetSearchMovies, { order: "ASC" });

  const handleSearch = debounce((text: string) => {
    refetchSearchMovies({ search: text, page: page });
  }, 300);

  useEffect(() => {
    setSearchMovies(data);
  }, [data]);

  const handleFilter = (filterOptions = {}) => {
    refetchSearchMovies({ ...filterOptions, page: page, order: "ASC" });
  };

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      refetchSearchMovies(defaultParams);
      return;
    }, [])
  );

  useEffect(() => {
    if (searchMoviesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [searchMoviesLoading]);

  const loadMovies = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const results = await GetSearchMovies(params);
      if (params.page === 1) {
        // First page — replace movies
        setSearchMovies(results);
      } else {
        // Append next page results
        setSearchMovies((prev: any) => [...prev, ...results] as any);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View className="flex-1 bg-bg_primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={loading ? [] : searchMovies}
        renderItem={({ item }: any) => (
          <MovieCard gridNum={2} item={item} gap={15 as number} />
        )}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        className="mt-5"
        columnWrapperStyle={{
          marginVertical: 5,
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
        contentContainerStyle={{
          paddingBottom: 75,
        }}
        ListHeaderComponent={
          <View className="px-3">
            <View className="mb-4">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery as string}
                onChangeText={(text: string) => {
                  setSearchQuery(text);
                  handleSearch(text);
                }}
                page="search"
                optionsOnPress={() => {
                  console.log("working");
                }}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row gap-3 items-center">
                <TouchableOpacity
                  className={`border border-primary px-2 py-1 rounded-md ${
                    selected === "topRated" ? "bg-primary" : ""
                  }`}
                  onPress={() => {
                    handleFilter({ sortBy: "score", order: "DESC" });
                    setSelected("topRated");
                  }}
                >
                  <Text
                    className={`text-[12px] ${
                      selected === "topRated" ? "text-black" : "text-primary"
                    }`}
                  >
                    Top rated
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`border border-primary px-2 py-1 rounded-md ${
                    selected === "all" ? "bg-primary" : ""
                  }`}
                  onPress={() => {
                    refetchSearchMovies(defaultParams);
                    setSelected("all");
                  }}
                >
                  <Text
                    className={`text-[12px] ${
                      selected === "all" ? "text-black" : "text-primary"
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="self-center"
                />
              </View>
            ) : searchMoviesError ? (
              <Text>Error: {searchMoviesError?.message}</Text>
            ) : searchQuery ? (
              <View>
                <Text className="text-white text-[13px]">
                  Search results for{" "}
                  <Text className="font-bold text-[15px] text-blue-500 italic">
                    {searchQuery}
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
        ListFooterComponent={
          <View className="flex-1 flex-row justify-center items-center mt-3">
            {!loading && searchMovies?.length > 0 ? (
              <TouchableOpacity
                className="bg-primaryDarker rounded-lg py-2 px-4"
                onPress={() => {
                  loadMovies({ page: page + 1 });
                  setPage(page + 1);
                }}
              >
                <Text className="text-black text-[16px] font-bold">
                  Load More
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />
    </View>
  );
};

export default search;
