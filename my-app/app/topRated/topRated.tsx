import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/movieCard";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "expo-router";

const topRated = () => {
  const [topRated, setTopRated] = useState([]);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const { data, loading, error, reset, refetch } = useFetch(() =>
    fetchMovies({ query: "" })
  );

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    const sorted = data?.sort((a: any, b: any) => b.score - a.score);
    setTopRated(sorted);
    setMovies(data?.slice(0, 10));
    setTotalPages(Math.ceil(data?.length / 10));
    setPage(1);
  }, [data]);

  useEffect(() => {
    setMovies(data?.slice((page - 1) * 10, page * 10));
  }, [page]);
  
  return (
    <View className="flex-1 bg-bg_primary">
      <FlatList
        data={loading ? [] : movies}
        ref={flatListRef}
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
        ListHeaderComponent={
          <View className="px-2 pt-4">
            <Image source={images.bg} className="absolute flex-1 z-0" />
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-10 mb-5 mx-auto"
            />
            <TouchableOpacity
              className="absolute top-5 left-4 rounded-full bg-primary/40 p-2"
              onPress={() => navigation.goBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-[20px] font-bold">Top rated</Text>
            {loading ? (
              <ActivityIndicator 
                size={'large'}
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : (null)}
          </View>
        }
        ListFooterComponent={
          <View>
            {loading ? null : (
              <View className="flex-row justify-end items-center mt-1 px-2 mb-3 gap-2">
                <TouchableOpacity
                  disabled={page === 1}
                  onPress={() => {
                    handleScrollToTop();
                    setPage((prev) => prev - 1);
                  }}
                  className={`px-3 py-1.5 rounded-md ${
                    page === 1 ? "bg-primaryDarker/40" : "bg-primaryDarker"
                  }`}
                >
                  <Text className="text-black text-[12px]">Previous</Text>
                </TouchableOpacity>
                {page === 1 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      handleScrollToTop();
                      setPage(1);
                    }}
                    className="px-3 py-1.5 rounded-md bg-primaryDarker "
                  >
                    <Text className="text-black text-[12px]">1</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  disabled
                  className="px-3 py-1.5 rounded-md bg-primaryDarker/40"
                >
                  <Text className="text-black text-[12px]">{page}</Text>
                </TouchableOpacity>
                {page === totalPages ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      handleScrollToTop();
                      setPage(totalPages);
                    }}
                    className="px-3 py-1.5 rounded-md bg-primaryDarker "
                  >
                    <Text className="text-black text-[12px]">{totalPages}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  disabled={page === totalPages}
                  onPress={() => {
                    setPage((prev) => prev + 1);
                    handleScrollToTop();
                  }}
                  className={`px-3 py-1.5 rounded-md ${
                    page === totalPages
                      ? "bg-primaryDarker/40"
                      : "bg-primaryDarker"
                  }`}
                >
                  <Text className="text-black text-[12px]">Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
};

export default topRated;
