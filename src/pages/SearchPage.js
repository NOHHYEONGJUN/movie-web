import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageLayout } from '../components/common/PageLayout';
import { GridSkeleton, TableSkeleton } from '../components/common/MovieSkeleton';  
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SearchHeader } from '../components/search/SearchHeader';
import { PaginationControls } from '../components/common/PaginationControls';
import MovieTableView from '../components/common/MovieTableView';
import MovieGridView from '../components/common/MovieGridView';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';

// TMDB API 설정
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BASE_URL = 'https://api.themoviedb.org/3';

// 장르 데이터
const genres = {
  28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디',
  80: '범죄', 99: '다큐멘터리', 18: '드라마', 10751: '가족',
  14: '판타지', 36: '역사', 27: '공포', 10402: '음악',
  9648: '미스터리', 10749: '로맨스', 878: 'SF',
  10770: 'TV 영화', 53: '스릴러', 10752: '전쟁', 37: '서부'
};

// 정렬 옵션
const sortOptions = {
  'popularity.desc': '인기도 높은순',
  'popularity.asc': '인기도 낮은순',
  'vote_average.desc': '평점 높은순',
  'vote_average.asc': '평점 낮은순',
  'release_date.desc': '최신순',
  'release_date.asc': '오래된순',
};

const SearchPage = () => {
  // 영화 데이터 상태
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  // 필터 상태
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [sortBy, setSortBy] = useState('popularity.desc');

  // 추천 영화 상태
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // 무한 스크롤을 위한 ref
  const observer = useRef();

  // 초기 추천 영화 로드
  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }
  }, []);

  // 영화 데이터 가져오기
  const fetchMovies = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      // URL 구성
      let url = searchQuery
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}&language=ko-KR&page=${pageNum}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&page=${pageNum}`;

      // 필터 적용
      url += `&sort_by=${sortBy}`;
      if (selectedGenres.length) {
        url += `&with_genres=${selectedGenres.join(',')}`;
      }
      url += `&vote_average.gte=${ratingRange[0]}&vote_average.lte=${ratingRange[1]}`;
      url += `&primary_release_date.gte=${yearRange[0]}-01-01&primary_release_date.lte=${yearRange[1]}-12-31`;

      const response = await fetch(url);
      const data = await response.json();

      // 영화 데이터 처리
      const processedMovies = data.results.map(movie => ({
        ...movie,
        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
        genres: movie.genre_ids.map(id => genres[id]).filter(Boolean)
      }));

      // 뷰 모드에 따른 데이터 설정
      if (viewMode === 'grid') {
        if (pageNum === 1) {
          setMovies(processedMovies);
        } else {
          setMovies(prev => [...prev, ...processedMovies]);
        }
      } else {
        setMovies(processedMovies);
      }

      // 페이지네이션 정보 업데이트
      setTotalPages(data.total_pages);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError('영화 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenres, ratingRange, yearRange, sortBy, viewMode]);

  // 뷰 모드 변경 시 초기화
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [viewMode]);

  // 필터 변경 시 데이터 재로드
  useEffect(() => {
    fetchMovies(page);
  }, [page, searchQuery, selectedGenres, ratingRange, yearRange, sortBy, fetchMovies, viewMode]);

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

  // 필터 초기화
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setRatingRange([0, 10]);
    setYearRange([1900, new Date().getFullYear()]);
    setSortBy('popularity.desc');
    setPage(1);
    setShowFilters(false);
  };

  // 추천 영화 토글
  const toggleRecommendation = (movie, e) => {
    if (e) e.stopPropagation();
    setRecommendedMovies(prev => {
      const isRecommended = prev.some(m => m.id === movie.id);
      let newRecommended = isRecommended
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
      return newRecommended;
    });
  };

  // 추천 여부 확인
  const isMovieRecommended = (movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  };

  // 무한 스크롤 설정
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

  // 스크롤 이벤트 핸들러
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

  // 컨텐츠 렌더링
  const renderContent = () => {
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
              {/* 무한 스크롤 로딩 시 스피너 표시 */}
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
    };

  return (
    <PageLayout
      title="찾아보기"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    >
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        genres={genres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        yearRange={yearRange}
        setYearRange={setYearRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      {isLoading && <LoadingSpinner />}

      
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