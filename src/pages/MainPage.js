import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Calendar, TrendingUp, Zap, Film, ChevronLeft, ChevronRight } from 'lucide-react';
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

// TrendingBanner 컴포넌트
const TrendingBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, movies.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, movies.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [handleNext]);

  if (!movies?.length) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${movies[currentIndex].backdrop_path 
                ? `https://image.tmdb.org/t/p/original${movies[currentIndex].backdrop_path}`
                : '/api/placeholder/1920/1080'})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                  #{movies[currentIndex].trendingRank} Trending
                </span>
                {movies[currentIndex].genres?.map((genre) => (
                  <span key={genre} className="text-sm text-gray-300">
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {movies[currentIndex].title}
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl line-clamp-2">
                {movies[currentIndex].overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

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

  const handleToggleRecommendation = useCallback((movie, e) => {
    e.stopPropagation();
    dispatch(toggleRecommendation(movie));
  }, [dispatch]);

  const isMovieRecommended = useCallback((movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  }, [recommendedMovies]);

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
      <TrendingBanner movies={trendingMovies} />
      <div className="h-16"></div>
      <main>
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
      <ScrollToTopButton />
    </div>
  );
};

export default MainPage;