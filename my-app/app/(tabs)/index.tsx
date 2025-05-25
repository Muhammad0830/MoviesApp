import {
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { Link, useFocusEffect, useRootNavigationState } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/searchBar";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/movieCard";
import { useAuth } from "@/contexts/authContext";
import HorizontalMovieCard from "@/components/horizontalMovieCard";
import { ChevronRight } from 'lucide-react-native';

export default function Index() {
  const router = useRouter();
  const [query, setQuery] = useState<String>("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    reset,
    refetch,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    setFilteredData(movies);
    const sorted = movies
      ?.sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);
    setTopRated(sorted);
  }, [movies]);

  useEffect(() => {
    const q = query?.toLowerCase();
    const filtered = movies?.filter((item: any) =>
      item.title.toLowerCase().includes(q)
    );
    setFilteredData(filtered);
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {};
    }, [])
  );

  if (!filteredData) {
    setTimeout(() => {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-[24px] font-bold">
            no filterData
          </Text>
        </View>
      );
    }, 1000);
  }

  return (
    <View className="flex-1 bg-bg_primary">
      {moviesLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size={70}
            color="#0000ff"
            className="mt-10 self-center"
          />
        </View>
      ) : moviesError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-[24px] font-bold">
            Error: {moviesError?.message}
          </Text>
        </View>
      ) : filteredData?.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white mx-auto">No results found</Text>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          numColumns={3}
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <MovieCard gridNum={3} item={item} gap={8 as number} />
          )}
          columnWrapperStyle={{
            marginVertical: 4,
            justifyContent: "space-between",
            paddingHorizontal: 8,
          }}
          ListHeaderComponent={
            <View className="px-2">
              <Image source={images.bg} className="absolute flex-1 z-0" />
              <Image
                source={icons.logo}
                className="w-12 h-10 mt-10 mb-5 mx-auto"
              />
              <View className="mt-5 mb-5 px-2 flex-row items-center justify-center">
                <SearchBar
                  onPress={() => router.push("/search")}
                  placeholder="Search for a movie"
                  value=""
                  onChangeText={(text: string) => setQuery(text)}
                />
              </View>
              <View className="mb-2 flex-row justify-between items-center">
                <Text className="text-white text-[20px] font-bold">
                  Top Rated
                </Text>
                <Link href={"../topRated/topRated" as any} asChild>
                  <Pressable className="flex-row items-center">
                    <Text className="text-primary text-[14px]">See more</Text>
                    <ChevronRight size={15} color='#b297f0'/>
                  </Pressable>
                </Link>
              </View>
              <FlatList
                data={topRated}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item, index }: any) => (
                  <View style={{ width: 150, height: 190, marginRight: 10 }}>
                    <HorizontalMovieCard item={item} index={index} />
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              />
              <View className="mt-2">
                <Text className="text-white font-bold text-[20px]">
                  Recommended Movies
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <Link
                href={`/movies/${152}` as any}
                asChild
                className="bg-red-500 inline-block w-[200px] h-[200px]"
              >
                <Text className="text-white">BOX</Text>
              </Link>

              <View className="pb-20"></View>
            </View>
          }
        />
      )}
    </View>
  );
}
