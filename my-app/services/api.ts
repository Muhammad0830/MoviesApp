export const URL_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_MOVIE_API_URL,
  // API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
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
