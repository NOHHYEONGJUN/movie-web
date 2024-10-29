import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Grid, Table2 } from 'lucide-react';
import Header from '../components/common/header';
import MovieTableView from '../components/common/MovieTableView';
import MovieGridView from '../components/common/MovieGridView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { PaginationControls } from '../components/common/PaginationControls';
import { getURL4PopularMovies, fetchMovies } from '../api/movieApi';

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';
const ITEMS_PER_PAGE_TABLE = 5; // 테이블 뷰의 페이지당 아이템 수
const ITEMS_PER_PAGE_GRID = 20; // 그리드 뷰의 페이지당 아이템 수

const PopularPage = () => {
  // 상태 관리
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const observer = useRef();
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const getGenreName = (genreId) => {
    const genres = {
      28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디',
      80: '범죄', 99: '다큐멘터리', 18: '드라마', 10751: '가족',
      14: '판타지', 36: '역사', 27: '공포', 10402: '음악',
      9648: '미스터리', 10749: '로맨스', 878: 'SF', 10770: 'TV 영화',
      53: '스릴러', 10752: '전쟁', 37: '서부'
    };
    return genres[genreId] || '';
  };

  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }
  }, []);

  const toggleRecommendation = (movie, e) => {
    e.stopPropagation();
    setRecommendedMovies(prev => {
      const isRecommended = prev.some(m => m.id === movie.id);
      let newRecommended = isRecommended
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
      return newRecommended;
    });
  };

  const isMovieRecommended = (movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  };

  const fetchMovieData = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      const itemsPerPage = viewMode === 'table' ? ITEMS_PER_PAGE_TABLE : ITEMS_PER_PAGE_GRID;
      const url = getURL4PopularMovies(API_KEY, pageNum);
      
      const response = await fetchMovies(url);
      const processedMovies = response.results.map(movie => ({
        ...movie,
        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
        genres: movie.genre_ids.map(getGenreName).filter(Boolean)
      }));

      const limitedMovies = viewMode === 'table' 
        ? processedMovies.slice(0, ITEMS_PER_PAGE_TABLE)
        : processedMovies;

      if (viewMode === 'grid' && pageNum > 1) {
        setMovies(prev => [...prev, ...limitedMovies]);
      } else {
        setMovies(limitedMovies);
      }
      
      const adjustedTotalPages = Math.ceil(response.total_results / itemsPerPage);
      setTotalPages(adjustedTotalPages);
    } catch (err) {
      setError('영화 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY, viewMode]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setPage(1);
    setMovies([]);
  };

  const lastMovieElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewMode === 'grid' && page < totalPages) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, page, totalPages, viewMode]);

  useEffect(() => {
    fetchMovieData(page);
  }, [page, viewMode, fetchMovieData]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">대세 콘텐츠</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${viewMode === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <Table2 className="w-5 h-5" />
              <span className="hidden sm:inline">테이블 뷰</span>
            </button>
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <Grid className="w-5 h-5" />
              <span className="hidden sm:inline">그리드 뷰</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <>
                <MovieTableView
                  movies={movies}
                  onToggleRecommendation={toggleRecommendation}
                  isMovieRecommended={isMovieRecommended}
                  showSortButtons={false}
                />
                {!isLoading && totalPages > 0 && (
                  <div className="mt-6">
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <MovieGridView
                movies={movies}
                onToggleRecommendation={toggleRecommendation}
                isMovieRecommended={isMovieRecommended}
                scrollRef={lastMovieElementRef}
              />
            )}
            
            {isLoading && <LoadingSpinner />}
          </>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default PopularPage;