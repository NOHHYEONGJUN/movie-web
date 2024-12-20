import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageLayout } from '../components/common/PageLayout';
import { GridSkeleton, TableSkeleton } from '../components/common/MovieSkeleton';  
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SearchHeader } from '../components/search/SearchHeader';
import { PaginationControls } from '../components/common/PaginationControls';
import MovieTableView from '../components/common/MovieTableView';
import MovieGridView from '../components/common/MovieGridView';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../utils/storage';
import { 
  RECOMMENDED_MOVIES_KEY, 
  IMAGE_BASE_URL, 
  GENRES, 
  SORT_OPTIONS 
} from '../constants/movieConstants';

const BASE_URL = 'https://api.themoviedb.org/3';

const SearchPage = () => {
  const { isAuthenticated, apiKey, isLoading: authLoading } = useAuth();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentFilters, setRecentFilters] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  
  const observer = useRef();

  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }

    const lastSettings = storage.getLastSearchSettings();
    if (lastSettings) {
      setSearchQuery(lastSettings.query || '');
      setSelectedGenres(lastSettings.genres || []);
      setRatingRange(lastSettings.rating || [0, 10]);
      setYearRange(lastSettings.year || [1900, new Date().getFullYear()]);
      setSortBy(lastSettings.sortBy || 'popularity.desc');
    }

    setSearchHistory(storage.getSearchHistory());
    setRecentFilters(storage.getRecentFilters());
  }, []);

  const saveSearchHistory = useCallback((query) => {
    if (!query.trim()) return;
    const newHistory = storage.addSearchHistory(query);
    setSearchHistory(newHistory);
  }, []);

  const saveFilterSettings = useCallback(() => {
    const currentFilter = {
      genres: selectedGenres,
      rating: ratingRange,
      year: yearRange,
      sort: sortBy
    };

    const newFilters = storage.addRecentFilter(currentFilter);
    setRecentFilters(newFilters);

    storage.saveLastSearchSettings({
      query: searchQuery,
      ...currentFilter
    });
  }, [selectedGenres, ratingRange, yearRange, sortBy, searchQuery]);

  const fetchMovies = useCallback(async (pageNum) => {
    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let url = searchQuery
        ? `${BASE_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}&language=ko-KR&page=${pageNum}`
        : `${BASE_URL}/discover/movie?api_key=${apiKey}&language=ko-KR&page=${pageNum}`;

      url += `&sort_by=${sortBy}`;
      if (selectedGenres.length) {
        url += `&with_genres=${selectedGenres.join(',')}`;
      }
      url += `&vote_average.gte=${ratingRange[0]}&vote_average.lte=${ratingRange[1]}`;
      url += `&primary_release_date.gte=${yearRange[0]}-01-01&primary_release_date.lte=${yearRange[1]}-12-31`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.status_message || '영화 데이터를 불러오는데 실패했습니다.');
      }

      if (searchQuery) {
        saveSearchHistory(searchQuery);
      }
      saveFilterSettings();

      const processedMovies = data.results.map(movie => ({
        ...movie,
        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
        genres: movie.genre_ids.map(id => GENRES[id]).filter(Boolean)
      }));

      if (viewMode === 'grid') {
        if (pageNum === 1) {
          setMovies(processedMovies);
        } else {
          setMovies(prev => [...prev, ...processedMovies]);
        }
      } else {
        setMovies(processedMovies);
      }

      setTotalPages(data.total_pages);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError(err.message || '영화 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenres, ratingRange, yearRange, sortBy, viewMode, saveSearchHistory, saveFilterSettings, apiKey]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  }, []);

  const handleViewModeChange = useCallback((newMode) => {
    setViewMode(newMode);
    setPage(1);
    setMovies([]);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenres([]);
    setRatingRange([0, 10]);
    setYearRange([1900, new Date().getFullYear()]);
    setSortBy('popularity.desc');
    setPage(1);
    setShowFilters(false);
    storage.clearLastSearchSettings();
  }, []);

  const toggleRecommendation = useCallback((movie, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }
    setRecommendedMovies(prev => {
      const isRecommended = prev.some(m => m.id === movie.id);
      let newRecommended = isRecommended
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
      return newRecommended;
    });
  }, [isAuthenticated]);

  const isMovieRecommended = useCallback((movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  }, [recommendedMovies]);

  const lastMovieElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewMode === 'grid' && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, viewMode]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [viewMode]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchMovies(page);
    }
  }, [page, fetchMovies, authLoading, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !isLoading &&
        hasMore &&
        viewMode === 'grid'
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, viewMode]);

  const renderContent = useCallback(() => {
    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      );
    }

    if (isLoading && page === 1) {
      return viewMode === 'grid' ? <GridSkeleton /> : <TableSkeleton />;
    }

    if (movies.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
        </div>
      );
    }

    return (
      <>
        {viewMode === 'grid' ? (
          <>
            <MovieGridView
              movies={movies}
              onToggleRecommendation={toggleRecommendation}
              isMovieRecommended={isMovieRecommended}
              scrollRef={lastMovieElementRef}
            />
            {isLoading && page > 1 && <LoadingSpinner />}
          </>
        ) : (
          <>
            <MovieTableView
              movies={movies}
              onToggleRecommendation={toggleRecommendation}
              isMovieRecommended={isMovieRecommended}
              showSortButtons={false}
            />
            {totalPages > 0 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </>
    );
  }, [
    error,
    isLoading,
    page,
    viewMode,
    movies,
    toggleRecommendation,
    isMovieRecommended,
    lastMovieElementRef,
    totalPages,
    handlePageChange
  ]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageLayout
      title="찾아보기"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      rightContent={null}
    >
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        genres={GENRES}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        yearRange={yearRange}
        setYearRange={setYearRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={SORT_OPTIONS}
        resetFilters={resetFilters}
        setPage={setPage}
        searchHistory={searchHistory}
        recentFilters={recentFilters}
      />
      {renderContent()}
      {!isLoading && !hasMore && movies.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          모든 결과를 불러왔습니다.
        </div>
      )}
      <ScrollToTopButton />
    </PageLayout>
  );
};

export default SearchPage;