import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MovieDetails from "@/components/movieDetails";
import { useEffect, useState } from "react";
import { fetchEachMovie } from "@/services/api";
import useFetch from "@/services/useFetch";

const movieDetails = () => {
  const [movie, setMovie] = useState<any>({});
  const { id } = useLocalSearchParams();

  const { data, loading, error, reset, refetch } = useFetch(() =>
    fetchEachMovie({ id } as any)
  );

  useEffect(() => {
    if (data?.length > 0) {
      setMovie(data);
    }
  }, [data]);

  console.log("error", error);

  if (movie && movie.length == 0) {
    return <Text>No movie found</Text>;
  }

  return (
    <View className="flex-1">
      {loading ? (
        <View className="h-screen justify-center items-center">
          <Text>Loading a movie ...</Text>
        </View>
      ) : (movie.length == 0) ? (
        <View className="h-screen justify-center items-center">
          <Text>No movie found</Text>
        </View>
      ) : movie.length > 0 ? (
        <MovieDetails movie={movie[0]} />
      ) : (
        <View className="h-screen justify-center items-center">
          <Text>{error?.message}</Text>
        </View>
      )}
    </View>
  );
};

export default movieDetails;
