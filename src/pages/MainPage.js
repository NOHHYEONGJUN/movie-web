import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Calendar, TrendingUp, Zap, Film } from 'lucide-react';
import Header from '../components/common/header';
import MovieSection from '../components/main/MovieSection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

import { 
  getURL4PopularMovies, 
  getURL4ReleaseMovies, 
  getURL4GenreMovies, 
  getURL4TopRatedMovies,
  getURL4UpcomingMovies,
  getURL4ComedyMovies,
  getURL4HorrorMovies,
  getURL4AnimationMovies,
  getURL4RomanceMovies,
  getURL4DocumentaryMovies,
  getURL4KidsMovies,
  getURL4ThisWeekTrendingMovies,
  getURL4HighBudgetMovies,
  fetchMovies 
} from '../api/movieApi';
import {
  setMovieCategory,
  setLoading,
  setError,
  toggleRecommendation,
  initializeRecommendedMovies
} from '../store/slices/mainSlice';
import { 
  RECOMMENDED_MOVIES_KEY, 
  IMAGE_BASE_URL, 
  GENRES, 
  MOVIE_SECTIONS,
  STYLES,
  STATUS_MESSAGES,
  MOVIE_DATA_MAPPING
} from '../constants/movieConstants';

const lucideIcons = {
  Heart,
  Star,
  Calendar,
  TrendingUp,
  Zap,
  Film
};

const MainPage = () => {
  const dispatch = useDispatch();
  const {
    popularMovies,
    latestMovies,
    actionMovies,
    topRatedMovies,
    upcomingMovies,
    recommendedMovies,
    comedyMovies,
    horrorMovies,
    animationMovies,
    romanceMovies,
    documentaryMovies,
    kidsMovies,
    trendingMovies,
    highBudgetMovies,
    isLoading,
    error
  } = useSelector(state => state.main);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      dispatch(initializeRecommendedMovies(JSON.parse(savedMovies)));
    }
  }, [dispatch]);

  const handleToggleRecommendation = (movie, e) => {
    e.stopPropagation();
    dispatch(toggleRecommendation(movie));
  };

  const isMovieRecommended = (movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        if (!API_KEY) {
          throw new Error(STATUS_MESSAGES.apiKeyError);
        }

        const processMovieData = (movies) => movies.results.slice(0, 10).map(movie => ({
          ...movie,
          image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
          genres: movie.genre_ids.map(id => GENRES[id]).filter(Boolean)
        }));

        const fetchAndProcessMovies = async (url, category) => {
          const data = await fetchMovies(url);
          if (data?.results) {
            const processedMovies = processMovieData(data);
            const mappingFunction = MOVIE_DATA_MAPPING[category];
            const finalMovies = mappingFunction 
              ? processedMovies.map((movie, index) => mappingFunction(movie, index))
              : processedMovies;

            dispatch(setMovieCategory({
              category,
              movies: finalMovies
            }));
          }
        };

        const requests = [
          fetchAndProcessMovies(getURL4PopularMovies(API_KEY), 'popularMovies'),
          fetchAndProcessMovies(getURL4ReleaseMovies(API_KEY), 'latestMovies'),
          fetchAndProcessMovies(getURL4GenreMovies(API_KEY, '28'), 'actionMovies'),
          fetchAndProcessMovies(getURL4TopRatedMovies(API_KEY), 'topRatedMovies'),
          fetchAndProcessMovies(getURL4UpcomingMovies(API_KEY), 'upcomingMovies'),
          fetchAndProcessMovies(getURL4ComedyMovies(API_KEY), 'comedyMovies'),
          fetchAndProcessMovies(getURL4HorrorMovies(API_KEY), 'horrorMovies'),
          fetchAndProcessMovies(getURL4AnimationMovies(API_KEY), 'animationMovies'),
          fetchAndProcessMovies(getURL4RomanceMovies(API_KEY), 'romanceMovies'),
          fetchAndProcessMovies(getURL4DocumentaryMovies(API_KEY), 'documentaryMovies'),
          fetchAndProcessMovies(getURL4KidsMovies(API_KEY), 'kidsMovies'),
          fetchAndProcessMovies(getURL4ThisWeekTrendingMovies(API_KEY), 'trendingMovies'),
          fetchAndProcessMovies(getURL4HighBudgetMovies(API_KEY), 'highBudgetMovies')
        ];

        await Promise.all(requests);
      } catch (error) {
        console.error("Error fetching movies:", error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAllMovies();
  }, [API_KEY, dispatch]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className={STYLES.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className={STYLES.errorMessage}>
          <p className="text-red-200">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        {MOVIE_SECTIONS.map(section => {
          const movieMap = {
            recommendedMovies,
            trendingMovies,
            popularMovies,
            topRatedMovies,
            highBudgetMovies,
            latestMovies,
            upcomingMovies,
            actionMovies,
            comedyMovies,
            horrorMovies,
            animationMovies,
            romanceMovies,
            documentaryMovies,
            kidsMovies
          };
  
          const movies = movieMap[section.id];
          if (!movies?.length) return null;
  
          return (
            <MovieSection 
              key={section.id}
              title={section.title}
              movies={movies}
              icon={section.icon && lucideIcons[section.icon]}
              showRank={section.showRank}
              showNew={section.showNew}
              showTrendingRank={section.showTrendingRank}
              customBadge={section.customBadge}
              isMovieRecommended={isMovieRecommended}  
              onToggleRecommendation={handleToggleRecommendation} 
            />
          );
        })}
      </main>
      {/* 스크롤 투 탑 버튼 추가 */}
      <ScrollToTopButton />
    </div>
  );
};

export default MainPage;