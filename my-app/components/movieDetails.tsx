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
  Modal,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { FlatList, Pressable, TextInput } from "react-native-gesture-handler";
import "react-native-reanimated";
import useFetch from "@/services/useFetch";
import {
  DeleteFromSavedMovies,
  fetchMovies,
  GetMoviesRatings,
  GetSavedMovies,
  RateMovie,
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
import { Star, ThumbsUp } from "lucide-react-native";
// import start half stroke from fontawesome
import {
  faStarHalfStroke,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";

const MovieDetails = ({ movie }: any) => {
  const [shuffleMovies, setShuffleMovies] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, loading, error } = useFetch(() => fetchMovies({ query: "" }));
  const navigation = useNavigation();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [isOpenRate, setIsOpenRate] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [value, setValue] = useState<any>(0);
  const [ratings, setRatings] = useState<any>({});
  const [isRated, setIsRated] = useState(false);

  const {
    data: saved_Movies,
    loading: savedMoviesLoading,
    error: savedMoviesError,
    reset: resetSaved,
    refetch: refetchSaved,
  } = useFetch(() => GetSavedMovies(user?.id));

  const lastFetchedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (movie?.id && movie.id !== lastFetchedIdRef.current) {
      lastFetchedIdRef.current = movie.id;
      handleFetchingRatings();
    }
  }, [movie?.id]);

  const handleFetchingRatings = async () => {
    if (movie.id) {
      const ratingsData = await GetMoviesRatings({
        movieId: movie.id,
        userId: user?.id,
      } as any);
      setRatings(ratingsData);
    }
  };

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
      setShuffleMovies(randomShuffle(filtered) as any);
    }
  }, [data]);

  useEffect(() => {
    if (saved_Movies) {
      if (saved_Movies?.some((item: any) => item.id === movie.id)) {
        setIsBookmarked(true);
      }
    }
  }, [saved_Movies]);

  useEffect(() => {
    if (ratings.id) {
      setRate(ratings.score);
      setValue(ratings.score);
      setIsRated(true);
    }
  }, [ratings]);

  const randomShuffle = (arr: any[]) => {
    return arr.sort(() => Math.random() - 0.5);
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

  const handleChange = (text: string) => {
    // Allow only digits
    if (!/^\d*$/.test(text)) return;

    const num = parseInt(text, 10);

    // Empty input is allowed
    if (text === "") {
      setValue("");
    } else if (num >= 0 && num <= 10) {
      setValue(text);
    }
  };

  const handleRate = (movieId: any, rate: any) => {
    RateMovie({ movieId: movieId, userId: user?.id, rate: rate } as any);
    setIsRated(true);
  };

  const formatNumber = (value: number): string => {
    let number = Number(value);
    return number.toString();
  };

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
    <View className="w-full flex-1 items-center bg-bg_primary">
      <View className="absolute top-0 left-0">
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View className="justify-center flex-1">
            <View className="w-[80%] mx-auto p-5 rounded-lg elevation-lg bg-black">
              <View className="mb-2">
                <Text className="text-white text-[16px] font-bold">
                  Delete from Saved movies?
                </Text>
              </View>
              <View className="w-full flex-row justify-between">
                <TouchableOpacity
                  className="bg-red-500 rounded-lg py-2 px-4"
                  onPress={() => {
                    setVisible(false);
                  }}
                >
                  <Text className="text-white text-[16px]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primaryDarker rounded-lg py-2 px-4"
                  onPress={() => {
                    DeleteFromSavedMovies({
                      id: movie.id,
                      userId: user?.id,
                    } as any);
                    setIsBookmarked(!isBookmarked);
                    setVisible(false);
                  }}
                >
                  <Text className="text-white text-[16px]">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

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
          gap: 10,
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
                <TouchableOpacity
                  onPress={() => {
                    setIsOpenRate(true);
                    handleSheetOpen();
                  }}
                  className="flex-row items-center gap-2"
                >
                  <FontAwesome name="star" size={15} color="yellow" />
                  <Text className="text-white text-[12px] font-bold">
                    {formatNumber(movie.score)} / 10
                  </Text>
                </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => {
                  setIsOpenRate(true);
                  handleSheetOpen();
                }}
                className="rounded-full w-10 aspect-square items-center justify-center bg-primary/40 "
              >
                {isRated ? (
                  <FontAwesome name="thumbs-up" size={17} color="white" />
                ) : (
                  // <ThumbsUp color="white" size={17} />
                  <ThumbsUp color="white" size={17} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!isBookmarked) {
                    SaveMovie({ movieId: movie.id, userId: user?.id } as any);
                    setIsBookmarked(!isBookmarked);
                  } else {
                    setVisible(true);
                  }
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
        onClose={() => setIsOpenRate(false)}
      >
        {isOpenRate ? (
          <BottomSheetView className="px-5 pt-2.5">
            <Text className="text-white text-[16px] font-bold text-center">
              Rate this movie
            </Text>
            <Text className="text-white text-[12px] text-center mb-3">
              {movie.title}
            </Text>

            {ratings.id ? (
              <View className="items-center mb-2">
                <Text className="text-primary text-[16px]">
                  You have already rated this movie
                </Text>
                <Text className="text-primary text-[16px]">
                  Want to update?
                </Text>
              </View>
            ) : (
              <View className="items-center mb-2">
                <Text className="text-primary text-[16px]">
                  You haven't rated this movie yet
                </Text>
              </View>
            )}

            <View className="items-center">
              <View className="flex-row gap-[2px] items-center">
                {Array.from({ length: 10 }).map((_, i) => {
                  if (i + 1 <= rate) {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setRate(i + 1);
                          setValue(i + 1);
                        }}
                      >
                        <Text>
                          <FontAwesomeIcon
                            icon={faStar}
                            size={24}
                            color="gold"
                          />
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setRate(i + 1);
                        setValue(i + 1);
                      }}
                    >
                      <Text>
                        <Star color="gold" size={24} />
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="flex-row items-center justify-center gap-1 mt-4">
                <View className="border border-white/50 rounded-md items-center justify-center bg-primary/40 w-14 aspect-square">
                  <TextInput
                    className="text-white text-[24px] font-bold p-2 w-full h-full text-center justify-center items-center"
                    placeholder={`${formatNumber(value)}`}
                    value={`${value == "0" ? "" : formatNumber(value)}`}
                    onChangeText={handleChange}
                    placeholderTextColor={"#999999"}
                    onSubmitEditing={() => {
                      setRate(value as any);
                    }}
                  />
                </View>

                <Text className="text-white text-[20px] font-bold">/</Text>
                <View className="border border-white/50 rounded-md items-center justify-center bg-primary/40 w-14 aspect-square">
                  <Text className="text-white text-[24px] font-bold">10</Text>
                </View>
              </View>

              <View className="flex-row mt-4 gap-10">
                <TouchableOpacity
                  onPress={() => {
                    handleSheetClose();
                  }}
                  className="px-5 py-2 rounded-md bg-red-500 justify-center items-center"
                >
                  <Text className="text-white text-[20px] font-bold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleRate(movie.id as any, rate as any);
                    handleSheetClose();
                  }}
                  className="px-5 py-2 rounded-md bg-primaryDarker justify-center items-center"
                >
                  <Text className="text-white text-[20px] font-bold">Rate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        ) : (
          <BottomSheetView
            style={{ flex: 1, paddingInline: 20, paddingTop: 10 }}
          >
            <Text className="text-white text-[14px]">
              <Text className="text-white font-bold">Genre: </Text>
              {movie.genre.join(", ")}
            </Text>
            <Text className="text-white text-[12px] mt-2">
              {movie.description}
            </Text>
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
};

export default MovieDetails;
