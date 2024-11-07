import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import MovieTableView from '../components/common/MovieTableView';
import MovieGridView from '../components/common/MovieGridView';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PaginationControls } from '../components/common/PaginationControls';

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';
const ITEMS_PER_PAGE_TABLE = 5;
const ITEMS_PER_PAGE_GRID = 20;

const WishlistPage = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState([]);

  useEffect(() => {
    const loadRecommendedMovies = () => {
      setIsLoading(true);
      try {
        const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
        if (savedMovies) {
          setRecommendedMovies(JSON.parse(savedMovies));
        }
      } catch (error) {
        console.error('Failed to load recommended movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendedMovies();
  }, []);

  const toggleRecommendation = (movie, e) => {
    if (e) e.stopPropagation();
    const newRecommended = recommendedMovies.filter(m => m.id !== movie.id);
    localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
    setRecommendedMovies(newRecommended);
  };

  const handleSort = (key) => {
    setSortConfig(current => {
      if (current.key === key) {
        return {
          ...current,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedMovies = [...recommendedMovies].sort((a, b) => {
    if (sortConfig.key === 'title') {
      const titleA = (a.title || a.original_title || '').toLowerCase();
      const titleB = (b.title || b.original_title || '').toLowerCase();
      return sortConfig.direction === 'asc' 
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }
    if (sortConfig.key === 'release_date') {
      return sortConfig.direction === 'asc'
        ? a.release_date.localeCompare(b.release_date)
        : b.release_date.localeCompare(a.release_date);
    }
    if (sortConfig.key === 'vote_average') {
      return sortConfig.direction === 'asc'
        ? a.vote_average - b.vote_average
        : b.vote_average - a.vote_average;
    }
    return 0;
  });

  // 페이지네이션 관련 계산
  const itemsPerPage = viewMode === 'table' ? ITEMS_PER_PAGE_TABLE : ITEMS_PER_PAGE_GRID;
  const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    setPage(1);
    window.scrollTo(0, 0);
  };

  // 현재 페이지에 표시할 영화 계산
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedMovies(sortedMovies.slice(startIndex, endIndex));
  }, [page, itemsPerPage, sortedMovies]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (recommendedMovies.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">아직 찜한 영화가 없습니다.</p>
        </div>
      );
    }

    return (
      <>
        {viewMode === 'table' ? (
          <MovieTableView
            movies={displayedMovies}
            onToggleRecommendation={toggleRecommendation}
            isMovieRecommended={() => true}
            sortConfig={sortConfig}
            onSort={handleSort}
            showSortButtons={true}
          />
        ) : (
          <MovieGridView
            movies={displayedMovies}
            onToggleRecommendation={toggleRecommendation}
            isMovieRecommended={() => true}
          />
        )}
        {totalPages > 1 && (
          <div className="mt-6">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <PageLayout
      title="내가 찜한 리스트"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    >
      {renderContent()}
      <ScrollToTopButton />
    </PageLayout>
  );
};

export default WishlistPage;