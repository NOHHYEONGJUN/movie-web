import React, { useState, useEffect, useCallback } from 'react';
import { Heart, ArrowUpDown, Star } from 'lucide-react';

const PopularMovieTableView = ({ 
  movies, 
  onToggleRecommendation, 
  isMovieRecommended, 
  sortConfig, 
  onSort,
  showSortButtons = true
}) => {
  const [visibleMovies, setVisibleMovies] = useState([]);

  // 고정된 크기 상수
  const DESKTOP_ROW_HEIGHT = 180;
  const MOBILE_CARD_HEIGHT = 200;
  const HEADER_HEIGHT = 56;
  const SORT_BUTTONS_HEIGHT = showSortButtons ? 64 : 0;
  const PAGINATION_HEIGHT = 56;
  const TOP_NAV_HEIGHT = 64;
  const TITLE_SECTION_HEIGHT = 80;

  // useCallback을 사용하여 calculateVisibleMovies 함수를 메모이제이션
  const calculateVisibleMovies = useCallback(() => {
    const windowHeight = window.innerHeight;
    const fixedHeights = TOP_NAV_HEIGHT + TITLE_SECTION_HEIGHT + SORT_BUTTONS_HEIGHT + PAGINATION_HEIGHT;
    
    // 데스크톱 뷰일 때는 헤더 높이도 고려
    const availableHeight = window.innerWidth >= 768 
      ? windowHeight - fixedHeights - HEADER_HEIGHT
      : windowHeight - fixedHeights;

    // 모바일 뷰일 때 (md 브레이크포인트 768px 미만)
    if (window.innerWidth < 768) {
      const maxMovies = Math.floor(availableHeight / MOBILE_CARD_HEIGHT);
      const optimalMovies = Math.max(1, maxMovies); // 최소 1개는 보이도록
      setVisibleMovies(movies.slice(0, optimalMovies));
    } else {
      // 데스크톱 뷰일 때
      const maxMovies = Math.floor(availableHeight / DESKTOP_ROW_HEIGHT);
      const optimalMovies = Math.max(1, maxMovies); // 최소 1개는 보이도록
      setVisibleMovies(movies.slice(0, optimalMovies));
    }
  }, [movies, MOBILE_CARD_HEIGHT, DESKTOP_ROW_HEIGHT, HEADER_HEIGHT, 
      SORT_BUTTONS_HEIGHT, PAGINATION_HEIGHT, TOP_NAV_HEIGHT, TITLE_SECTION_HEIGHT]);

  // 윈도우 리사이즈 이벤트 처리
  useEffect(() => {
    calculateVisibleMovies();
    const handleResize = () => {
      calculateVisibleMovies();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateVisibleMovies]);

  const SortButton = ({ label, sortKey }) => (
    <button 
      onClick={() => showSortButtons && onSort?.(sortKey)}
      className="flex items-center justify-center gap-2 px-4 py-2 w-full md:w-auto rounded-lg bg-gray-800 hover:bg-gray-700"
    >
      <span>{label}</span>
      {showSortButtons && (
        <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === sortKey ? 'text-blue-500' : ''}`} />
      )}
    </button>
  );

  const MobileSortControls = () => (
    <div className="flex flex-wrap gap-2 p-4 md:hidden h-16">
      <SortButton label="제목순" sortKey="title" />
      <SortButton label="개봉일순" sortKey="release_date" />
      <SortButton label="평점순" sortKey="vote_average" />
    </div>
  );

  return (
    <div className="flex flex-col rounded-lg border border-gray-800 bg-gray-900/50">
      {showSortButtons && <MobileSortControls />}

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="text-base uppercase bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-center w-40">
                <span className="text-lg">포스터</span>
              </th>
              <th className={`px-4 py-3 ${showSortButtons ? 'cursor-pointer' : ''}`} 
                onClick={() => showSortButtons && onSort?.('title')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">제목</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'title' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className={`px-4 py-3 w-40 ${showSortButtons ? 'cursor-pointer' : ''}`}
                onClick={() => showSortButtons && onSort?.('release_date')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">개봉일</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'release_date' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className={`px-4 py-3 w-36 ${showSortButtons ? 'cursor-pointer' : ''}`}
                onClick={() => showSortButtons && onSort?.('vote_average')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">평점</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'vote_average' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center w-48">
                <span className="text-lg">장르</span>
              </th>
              <th className="px-4 py-3 text-center w-48">
                <span className="text-lg">찜</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {visibleMovies.map((movie) => (
              <tr key={movie.id} className="bg-transparent hover:bg-gray-900/70" style={{ height: `${DESKTOP_ROW_HEIGHT}px` }}>
                <td className="px-4">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg mx-auto shadow-lg"
                    loading="lazy"
                  />
                </td>
                <td className="px-4">
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{movie.title || movie.original_title}</p>
                    <p className="text-sm text-gray-400 line-clamp-2 max-w-xl">{movie.overview}</p>
                  </div>
                </td>
                <td className="px-4 text-lg text-center">{movie.release_date}</td>
                <td className="px-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {movie.genres?.map((genre, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRecommendation(movie, e);
                    }}
                    className={`p-2 rounded-full transition-colors mx-auto
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    aria-label={isMovieRecommended(movie.id) ? '찜하기 취소' : '찜하기'}
                  >
                    <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="md:hidden">
        {visibleMovies.map((movie) => (
          <div 
            key={movie.id} 
            className="p-4 bg-transparent hover:bg-gray-900/70"
            style={{ height: `${MOBILE_CARD_HEIGHT}px` }}
          >
            <div className="flex space-x-4 h-full">
              <img 
                src={movie.image} 
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg shadow-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium truncate">
                    {movie.title || movie.original_title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRecommendation(movie, e);
                    }}
                    className={`p-2 rounded-full transition-colors flex-shrink-0
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    aria-label={isMovieRecommended(movie.id) ? '찜하기 취소' : '찜하기'}
                  >
                    <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{movie.overview}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{movie.release_date}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {movie.genres?.map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovieTableView;