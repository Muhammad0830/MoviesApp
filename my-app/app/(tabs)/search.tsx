import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchBar from "@/components/searchBar";
import { images } from "@/constants/images";
import MovieCard from "@/components/movieCard";
import useFetch from "@/services/useFetch";
import { GetSearchMovies } from "@/services/api";
import { useFocusEffect } from "expo-router";
import debounce from "lodash.debounce";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const defaultParams = {
  search: "",
  sortBy: "id",
  order: "DESC",
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
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    offset: 0,
    total: 0,
  });

  const {
    data,
    loading: searchMoviesLoading,
    error: searchMoviesError,
    refetch: refetchSearchMovies,
    reset: resetSearchMovies,
  } = useFetch(GetSearchMovies, { order: "DESC" });

  useEffect(() => {
    setSearchMovies(data?.movies);
    setPagination(data?.pagination);
  }, [data]);

  const handleSearch = debounce((text: string) => {
    refetchSearchMovies({ search: text, page: 1 });
  }, 300);

  const handleFilter = (filterOptions = {}) => {
    refetchSearchMovies(filterOptions);
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
      const data = await GetSearchMovies(params);
      const results = data?.movies;
      setSearchMovies(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOpen) {
      refetchSearchMovies(defaultParams);
      setSelected("All");
    } else {
      setPage(1);
      setSearchQuery("");
    }
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : -350,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View className="flex-1 bg-bg_primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={!loading && (isOpen || searchQuery !== "") ? searchMovies : []}
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
                  setIsOpen(!isOpen);
                }}
              />
            </View>

            <Animated.View
              className="-z-10"
              style={{
                transform: [{ translateY: -50 }, { translateX: translateY }],
                width: width * 0.75,
              }}
            >
              <View className="flex-row gap-3 items-center">
                <TouchableOpacity
                  className={`border border-primary px-2 py-1 rounded-md ${
                    selected === "Top Rated" ? "bg-primary" : ""
                  }`}
                  onPress={() => {
                    handleFilter({ sortBy: "score", order: "DESC", page: 1 });
                    setPage(1);
                    setSelected("Top Rated");
                  }}
                >
                  <Text
                    className={`text-[12px] ${
                      selected === "Top Rated" ? "text-black" : "text-primary"
                    }`}
                  >
                    Top rated
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`border border-primary px-2 py-1 rounded-md ${
                    selected === "All" ? "bg-primary" : ""
                  }`}
                  onPress={() => {
                    refetchSearchMovies(defaultParams);
                    setPage(1);
                    setSelected("All");
                  }}
                >
                  <Text
                    className={`text-[12px] ${
                      selected === "All" ? "text-black" : "text-primary"
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

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
            ) : isOpen ? (
              <View className="mb-2">
                <Text className="text-white text-[20px] font-bold">
                  {selected} movies
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
          <View className="flex-1 px-[10px] flex-row justify-end items-center mt-3">
            {!loading && (isOpen || searchQuery !== "") ? (
              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  disabled={page === 1}
                  className={`${
                    page === 1 ? "bg-primary/40" : "bg-primaryDarker"
                  } rounded-md py-1.5 px-3`}
                  onPress={() => {
                    loadMovies({
                      page: page - 1,
                      search: searchQuery,
                      sortBy:
                        selected === "all"
                          ? "id"
                          : selected === "Top Rated"
                          ? "score"
                          : "id",
                    });
                    setPage(page - 1);
                  }}
                >
                  <Text className="text-black text-[12px] font-bold">
                    Previous
                  </Text>
                </TouchableOpacity>
                {page !== 1 ? (
                  <TouchableOpacity
                    className="bg-primaryDarker rounded-md py-1.5 px-3"
                    onPress={() => {
                      loadMovies({
                        page: 1,
                        search: searchQuery,
                        sortBy:
                          selected === "all"
                            ? "id"
                            : selected === "Top Rated"
                            ? "score"
                            : "id",
                      });
                      setPage(1);
                    }}
                  >
                    <Text className="text-black text-[12px] font-bold">1</Text>
                  </TouchableOpacity>
                ) : null}
                <View className="bg-primary/40 rounded-md py-1.5 px-3">
                  <Text className="text-black text-[12px] font-bold">
                    {page}
                  </Text>
                </View>
                {page < pagination.total / pagination.limit ? (
                  <TouchableOpacity
                    className="bg-primaryDarker rounded-md py-1.5 px-3"
                    onPress={() => {
                      loadMovies({
                        page: Math.ceil(pagination.total / pagination.limit),
                        search: searchQuery,
                        sortBy:
                          selected === "all"
                            ? "id"
                            : selected === "Top Rated"
                            ? "score"
                            : "id",
                      });
                      setPage(Math.ceil(pagination.total / pagination.limit));
                    }}
                  >
                    <Text className="text-black text-[12px] font-bold">
                      {Math.ceil(pagination.total / pagination.limit)}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  disabled={page >= pagination.total / pagination.limit}
                  className={`${
                    page < pagination.total / pagination.limit
                      ? "bg-primaryDarker"
                      : "bg-primary/40"
                  } rounded-md py-1.5 px-3`}
                  onPress={() => {
                    loadMovies({
                      page: page + 1,
                      search: searchQuery,
                      sortBy:
                        selected === "all"
                          ? "id"
                          : selected === "Top Rated"
                          ? "score"
                          : "id",
                    });
                    setPage(page + 1);
                  }}
                >
                  <Text className="text-black text-[12px] font-bold">Next</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        }
      />
    </View>
  );
};

export default search;
