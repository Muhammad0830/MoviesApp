import { View, Text, ActivityIndicator } from "react-native";
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
    if (data) {
      setMovie(data);
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  if (movie && !movie.title) {
    setTimeout(() => {
      return (
        <View className="bg-red-500 flex-1 justify-center items-center">
          <Text>No movie found</Text>
        </View>
      );
    }, 1000);
  }

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 bg-bg_primary justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="self-center"
          />
        </View>
      ) : movie ? (
        <MovieDetails movie={movie} />
      ) : (
        // <TestAnimation />
        <View className="h-screen justify-center items-center">
          <Text>{error?.message}</Text>
        </View>
      )}
    </View>
  );
};

export default movieDetails;
