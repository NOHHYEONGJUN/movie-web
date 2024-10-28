import React, { useEffect, useState } from 'react';
import Header from '../components/common/header';
import { getURL4PopularMovies, getURL4ReleaseMovies, getURL4GenreMovies, fetchMovies } from '../api/movieApi';

const MainPage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchAllMovies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!API_KEY) {
          throw new Error('API 키가 설정되지 않았습니다.');
        }

        // 인기 영화 가져오기
        const popularData = await fetchMovies(getURL4PopularMovies(API_KEY));
        if (popularData && popularData.results) {
          const popularWithRank = popularData.results.slice(0, 10).map((movie, index) => ({
            ...movie,
            rank: index + 1,
            image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169"
          }));
          setPopularMovies(popularWithRank);
        }

        // 최신 영화 가져오기
        const latestData = await fetchMovies(getURL4ReleaseMovies(API_KEY));
        if (latestData && latestData.results) {
          const latestWithNew = latestData.results.slice(0, 10).map(movie => ({
            ...movie,
            isNew: true,
            image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169"
          }));
          setLatestMovies(latestWithNew);
        }

        // 액션 영화 가져오기
        const actionData = await fetchMovies(getURL4GenreMovies(API_KEY, '28'));
        if (actionData && actionData.results) {
          const actionMapped = actionData.results.slice(0, 10).map(movie => ({
            ...movie,
            image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169"
          }));
          setActionMovies(actionMapped);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, [API_KEY]);

  const MovieSection = ({ title, movies, showRank = false, showNew = false }) => (
    <section className="px-12 pt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-8 relative">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group cursor-pointer z-0 hover:z-50 px-8 py-16">
            <div className="relative transform-gpu transition-transform duration-300">
              <img 
                src={movie.image} 
                alt={movie.title}
                className="w-[300px] h-[450px] object-cover rounded-md 
                transform transition-all duration-300 ease-in-out
                group-hover:scale-125 group-hover:shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 
                group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-md
                transform transition-transform duration-300
                group-hover:scale-125">
                <div className="absolute bottom-0 left-0 right-0 p-4 
                  transform transition-all duration-300 
                  translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-white font-medium">{movie.title || movie.original_title}</h3>
                  <p className="text-white text-sm mt-1">{movie.release_date}</p>
                </div>
              </div>
              {showRank && movie.rank && (
                <div className="absolute top-2 left-2 w-8 h-8 bg-black/60 
                  rounded-md flex items-center justify-center 
                  transform transition-all duration-300
                  group-hover:scale-110">
                  <span className="text-2xl font-bold text-white">{movie.rank}</span>
                </div>
              )}
              {showNew && movie.isNew && (
                <div className="absolute top-2 right-2 
                  transform transition-all duration-300
                  group-hover:scale-110">
                  <span className="bg-red-600 text-white px-2 py-1 text-sm rounded">NEW</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16">
        {popularMovies.length > 0 && <MovieSection title="인기 영화" movies={popularMovies} showRank />}
        {latestMovies.length > 0 && <MovieSection title="최신 영화" movies={latestMovies} showNew />}
        {actionMovies.length > 0 && <MovieSection title="액션 & 어드벤처" movies={actionMovies} />}
      </main>
    </div>
  );
};

export default MainPage;