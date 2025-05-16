import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { FlatList, Pressable } from "react-native-gesture-handler";
import "react-native-reanimated";
import useFetch from "@/services/useFetch";
import {
  DeleteFromSavedMovies,
  fetchMovies,
  GetSavedMovies,
  SaveMovie,
} from "@/services/api";
import MovieCard from "./movieCard";
import { MovieType } from "@/types/MovieType";
import { useNavigation, useRoute } from "@react-navigation/native";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/authContext";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const MovieDetails = ({ movie }: any) => {
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [shuffleMovies, setShuffleMovies] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, loading, error } = useFetch(() => fetchMovies({ query: "" }));
  const navigation = useNavigation();
  const { user } = useAuth();

  const {
    data: saved_Movies,
    loading: savedMoviesLoading,
    error: savedMoviesError,
    reset: resetSaved,
    refetch: refetchSaved,
  } = useFetch(() => GetSavedMovies(user?.id));

  useEffect(() => {
    if (user?.id) {
      refetchSaved();
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      let filtered = data.filter(
        (item: any) =>
          item.title !== movie.title && item.description !== movie.description
      );
      setMovies(filtered);
      setShuffleMovies(randomShuffle(filtered) as any);
    }
  }, [data]);

  useEffect(() => {
    if (saved_Movies) {
      setSavedMovies(saved_Movies);
      if (saved_Movies?.some((item: any) => item.id === movie.id)) {
        setIsBookmarked(true);
      }
    }
  }, [saved_Movies]);

  const randomShuffle = (arr: any[]) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const handleSave = async (movie: MovieType) => {
    if (!isBookmarked) {
      SaveMovie({ movieId: movie.id, userId: user?.id } as any);
      setIsBookmarked(!isBookmarked);
    } else {
      DeleteFromSavedMovies({ id: movie.id, userId: user?.id } as any);
      setIsBookmarked(!isBookmarked);
    }
  };

  const snapPoints = useMemo(() => ["40%", "75%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetOpen = () => bottomSheetRef.current?.snapToIndex(0);
  const handleSheetClose = () => bottomSheetRef.current?.close();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  if (loading) {
    return (
      <View className="bg-bg_primary flex-1 justify-center items-center">
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="self-center"
        />
      </View>
    );
  }

  if (!loading && !movie.title) {
    return (
      <View className="flex-1 bg-bg_primary justify-center items-center">
        <Text className="text-white text-[20px] font-bold">No movie found</Text>
      </View>
    );
  }

  return (
    <View className="w-full flex-1 bg-bg_primary">
      <FlatList
        data={shuffleMovies}
        renderItem={({ item }: any) => (
          <MovieCard item={item} gridNum={2} gap={15 as number} />
        )}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          marginVertical: 5,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
        ListHeaderComponent={
          <View className="px-2">
            <View className="flex items-center mt-10">
              <TouchableOpacity
                className="absolute -top-2 left-4 rounded-full bg-primary/40 p-2"
                onPress={() => navigation.goBack()}
              >
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
              </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => {
                  handleSave(movie as MovieType);
                }}
                className="rounded-full w-10 aspect-square items-center justify-center bg-primary/40 "
              >
                <FontAwesomeIcon
                  icon={isBookmarked ? solidBookmark : regularBookmark}
                  size={17}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSheetOpen}>
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
      />

      <BottomSheet
        index={-1}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#8a5fed" }}
        backgroundStyle={{ backgroundColor: "#222222" }}
      >
        <BottomSheetView style={{ flex: 1, paddingInline: 20, paddingTop: 10 }}>
          <Text className="text-white text-[14px]">
            <Text className="text-white font-bold">Genre: </Text>{movie.genre.join(", ")}
          </Text>
          <Text className="text-white text-[12px] mt-2">
            {movie.description}
          </Text>

          {/* <View className="w-full flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={handleSheetClose}
              className="p-3 rounded-lg bg-red-500"
            >
              <Text className="text-white text-[12px] font-bold">Close</Text>
            </TouchableOpacity>
          </View> */}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default MovieDetails;
