import { MovieType } from "@/types/MovieType";
import { Alert } from 'react-native';

export const URL_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_MOVIE_API_URL,
  // API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    // authorization: 'Bearer <your-token-here>',
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = `${URL_CONFIG.BASE_URL}/moviesDB`;
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
  console.log("fetching a movie...");
  const endpoint = `${URL_CONFIG.BASE_URL}/moviesDB/${id}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: URL_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  console.log("fetched succesfully to the", endpoint);

  return data;
};

export const SaveMovie = async (movie: MovieType) => {
  try {
    console.log("saving a movie...");
    const endpoint = `${URL_CONFIG.BASE_URL}/moviesDB`;
    console.log('endpoint', endpoint)
    const response = await fetch(endpoint, {
      method: "POST",
      headers: URL_CONFIG.headers,
      body: JSON.stringify(movie),
    });

    const data = await response.json();
    console.log("data", data.message);

    if (!response.ok) {
      Alert.alert("Error", data.message || 'Failed to save a movie');
      throw new Error("Failed to fetch data");
    }


    return data;
  } catch (err) {
    console.error(err);
  }
};

export const GetSavedMovies = async () => {
  try {
    console.log("getting saved movies...");
    const endpoint = `${URL_CONFIG.BASE_URL}/savedMovies`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: URL_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err)
  }
}

export const DeleteFromSavedMovies = async (id: number) => {
  try {
    console.log("deleting a movie...");
    const endpoint = `${URL_CONFIG.BASE_URL}/savedMovies/${id}`;
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: URL_CONFIG.headers,
    })

    if(!response.ok) {
      throw new Error("Failed to delete a movie");
    }

    const data = await response.json();
    console.log("deleted succesfully to the", endpoint);
    
    return data;
  } catch (err) {
    console.error(err)
  }
}
