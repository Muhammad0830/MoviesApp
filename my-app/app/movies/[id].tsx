import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MovieDetails from "@/components/movieDetails";
import { useEffect, useState } from "react";
import { fetchEachMovie } from "@/services/api";
import useFetch from "@/services/useFetch";
;

const movieDetails = () => {
  const [movie, setMovie] = useState<any>({});
  const { id } = useLocalSearchParams();

  const { data, loading, error, reset, refetch } = useFetch(() =>
    fetchEachMovie({ id } as any)
  );

  useEffect(() => {
    if (data) {
      setMovie(data);
    }
  }, [data]);

  if (movie && !movie.title) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No movie found</Text>
      </View>
    );
  }

  return (
      <View className="flex-1">
        {loading ? (
          <View className="h-screen justify-center items-center">
            <Text>Loading a movie ...</Text>
          </View>
        ) : movie ? (
          <MovieDetails movie={movie} />
          // <TestAnimation />
        ) : (
          <View className="h-screen justify-center items-center">
            <Text>{error?.message}</Text>
          </View>
        )}
      </View>
  );
};

export default movieDetails;
