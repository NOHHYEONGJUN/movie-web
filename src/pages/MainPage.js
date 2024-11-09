import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Calendar, TrendingUp, Zap, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
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
  const [nextIndex, setNextIndex] = React.useState(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [loadedImages, setLoadedImages] = React.useState(new Set());

  // 이미지 프리로딩 함수
  const preloadImage = useCallback((url) => {
    if (loadedImages.has(url)) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
        resolve();
      };
      img.onerror = reject;
    });
  }, [loadedImages]);

  // 다음 이미지로 전환하는 함수
  const transition = useCallback(async (newIndex) => {
    if (isTransitioning) return;
    
    const nextImageUrl = movies[newIndex].backdrop_path
      ? `https://image.tmdb.org/t/p/original${movies[newIndex].backdrop_path}`
      : '/api/placeholder/1920/1080';

    try {
      setIsTransitioning(true);
      setNextIndex(newIndex);
      
      // 다음 이미지 프리로드
      await preloadImage(nextImageUrl);
      
      // 전환 애니메이션 시작
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setNextIndex(null);
        setIsTransitioning(false);
      }, 500);
    } catch (error) {
      console.error('Image preload failed:', error);
      setIsTransitioning(false);
      setNextIndex(null);
    }
  }, [isTransitioning, movies, preloadImage]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === movies.length - 1 ? 0 : currentIndex + 1;
    transition(newIndex);
  }, [currentIndex, movies.length, transition]);

  const handlePrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    transition(newIndex);
  }, [currentIndex, movies.length, transition]);

  // 자동 전환 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [handleNext, isTransitioning]);

  // 초기 이미지들 프리로드
  useEffect(() => {
    movies?.forEach((movie) => {
      const url = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : '/api/placeholder/1920/1080';
      preloadImage(url);
    });
  }, [movies, preloadImage]);

  if (!movies?.length) return null;

  const getCurrentImageUrl = (index) => {
    return movies[index].backdrop_path
      ? `https://image.tmdb.org/t/p/original${movies[index].backdrop_path}`
      : '/api/placeholder/1920/1080';
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* 현재 이미지 */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${getCurrentImageUrl(currentIndex)})`,
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

      {/* 다음 이미지 (프리로드) */}
      {nextIndex !== null && (
        <div className="absolute inset-0 w-full h-full opacity-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${getCurrentImageUrl(nextIndex)})`,
            }}
          />
        </div>
      )}

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
            onClick={() => transition(index)}
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
  const { apiKey, isAuthenticated, isLoading: authLoading } = useAuth();
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
      if (!authLoading && !isAuthenticated) {
        return;
      }

      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        if (!apiKey) {
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
          fetchAndProcessMovies(getURL4PopularMovies(apiKey), 'popularMovies'),
          fetchAndProcessMovies(getURL4ReleaseMovies(apiKey), 'latestMovies'),
          fetchAndProcessMovies(getURL4GenreMovies(apiKey, '28'), 'actionMovies'),
          fetchAndProcessMovies(getURL4TopRatedMovies(apiKey), 'topRatedMovies'),
          fetchAndProcessMovies(getURL4UpcomingMovies(apiKey), 'upcomingMovies'),
          fetchAndProcessMovies(getURL4ComedyMovies(apiKey), 'comedyMovies'),
          fetchAndProcessMovies(getURL4HorrorMovies(apiKey), 'horrorMovies'),
          fetchAndProcessMovies(getURL4AnimationMovies(apiKey), 'animationMovies'),
          fetchAndProcessMovies(getURL4RomanceMovies(apiKey), 'romanceMovies'),
          fetchAndProcessMovies(getURL4DocumentaryMovies(apiKey), 'documentaryMovies'),
          fetchAndProcessMovies(getURL4KidsMovies(apiKey), 'kidsMovies'),
          fetchAndProcessMovies(getURL4ThisWeekTrendingMovies(apiKey), 'trendingMovies'),
          fetchAndProcessMovies(getURL4HighBudgetMovies(apiKey), 'highBudgetMovies')
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
  }, [apiKey, dispatch, authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className={STYLES.loadingSpinner}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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