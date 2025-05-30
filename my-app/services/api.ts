import { MovieType } from "@/types/MovieType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const URL_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_MOVIE_API_URL,
  // API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    authorization: `Bearer ${AsyncStorage.getItem("token")}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = `${URL_CONFIG.BASE_URL}/movies/moviesDB`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: URL_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return data;
};

export const fetchEachMovie = async ({ id }: { id: number }) => {
  const endpoint = `${URL_CONFIG.BASE_URL}/movies/moviesDB/${id}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: URL_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return data;
};

export const SaveMovie = async ({
  movieId,
  userId,
}: {
  movieId: number;
  userId: number;
}) => {
  try {
    console.log("saving a movie...");
    const endpoint = `${URL_CONFIG.BASE_URL}/movies/savedMovies`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: URL_CONFIG.headers,
      body: JSON.stringify({ movieId, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Error", data.message || "Failed to save a movie");
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const GetSavedMovies = async (id: any) => {
  try {
    const endpoint = `${URL_CONFIG.BASE_URL}/movies/savedMovies/${id}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: URL_CONFIG.headers,
    });

    const data = await response.json();

    if (data.message == "No movies found") {
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const DeleteFromSavedMovies = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  try {
    const endpoint = `${URL_CONFIG.BASE_URL}/movies/savedMovies/${id}/users/${userId}`;
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: URL_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to delete a movie");
    }

    const data = await response.json();
    console.log("deleted succesfully to the", endpoint);

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const GetUser = async (id: number) => {
  try {
    console.log("getting user...");
    const endpoint = `${URL_CONFIG.BASE_URL}/users/user/${id}`;
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { ...URL_CONFIG.headers, authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const GetSearchMovies = async (options: any = {}) => {
  try {
    const params = new URLSearchParams(options).toString();
    const endpoint = `${URL_CONFIG.BASE_URL}/movies/moviesSearch?${params}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: URL_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const RateMovie = async ({ movieId, userId, rate }: { movieId: number, userId: number, rate: number }) => {
  const endpoint = `${URL_CONFIG.BASE_URL}/movies/rate`;
  const response = await fetch(endpoint, {
    body: JSON.stringify({ movieId, userId, rate }),
    method: "POST",
    headers: URL_CONFIG.headers,
  })

  if(!response.ok){
    throw new Error("Failed to delete a movie");
  }

  const data = await response.json();

  return data;
}

export const GetMoviesRatings = async ({ movieId, userId }: {movieId: Number, userId: Number}) => {
  const endpoint = `${URL_CONFIG.BASE_URL}/movies/ratedMovie/${movieId}/users/${userId}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: URL_CONFIG.headers,
  });

  if(!response.ok){
    throw new Error("Failed to delete a movie");
  }

  const data = await response.json();

  return data;
}