import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageLayout } from '../components/common/PageLayout';
import MovieTableView from '../components/common/MovieTableView';
import MovieGridView from '../components/common/MovieGridView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { PaginationControls } from '../components/common/PaginationControls';
import { getURL4PopularMovies, fetchMovies } from '../api/movieApi';
import { RECOMMENDED_MOVIES_KEY, IMAGE_BASE_URL, GENRES } from '../constants/movieConstants';

const ITEMS_PER_PAGE_TABLE = 5;
const ITEMS_PER_PAGE_GRID = 20;

const PopularPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const observer = useRef();
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const getGenreName = (genreId) => {
    return GENRES[genreId] || '';
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

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <PageLayout
      title="대세 콘텐츠"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      rightContent={null}
    >
      {renderContent()}
      <ScrollToTopButton />
    </PageLayout>
  );
};

export default PopularPage;