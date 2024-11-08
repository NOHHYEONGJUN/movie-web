import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, Clock, Settings } from 'lucide-react';

export const SearchHeader = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  genres,
  selectedGenres,
  setSelectedGenres,
  ratingRange,
  setRatingRange,
  yearRange,
  setYearRange,
  sortBy,
  setSortBy,
  sortOptions,
  resetFilters,
  setPage,
  searchHistory,
  recentFilters
}) => {
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(debouncedSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, setSearchQuery]);

  // 검색 기록 선택
  const handleSearchHistorySelect = (query) => {
    setDebouncedSearchQuery(query);
    setShowSearchHistory(false);
    setPage(1);
  };

  // 필터 설정 적용
  const applyFilterSettings = (filter) => {
    setSelectedGenres(filter.genres);
    setRatingRange(filter.rating);
    setYearRange(filter.year);
    setSortBy(filter.sort);
    setPage(1);
  };

  const popularGenres = ["28", "12", "35", "18"];
  const sortedGenres = Object.entries(genres).sort((a, b) => {
    if (popularGenres.includes(a[0]) && !popularGenres.includes(b[0])) return -1;
    if (!popularGenres.includes(a[0]) && popularGenres.includes(b[0])) return 1;
    return a[1].localeCompare(b[1]);
  });

  const handleGenreSelect = useCallback((id) => {
    setSelectedGenres(prev =>
      prev.includes(id)
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
    setPage(1);
  }, [setSelectedGenres, setPage]);

  const handleYearChange = useCallback((value, isStart) => {
    setYearRange(prev => {
      const [start, end] = prev;
      if (isStart) {
        return [value, Math.max(value, end)];
      } else {
        return [Math.min(start, value), value];
      }
    });
    setPage(1);
  }, [setYearRange, setPage]);

  const handleRatingChange = useCallback((value, isMin) => {
    setRatingRange(prev => {
      const [min, max] = prev;
      if (isMin) {
        return [value, Math.max(value, max)];
      } else {
        return [Math.min(min, value), value];
      }
    });
    setPage(1);
  }, [setRatingRange, setPage]);

  return (
    <div className="space-y-4 bg-gray-950 p-4 rounded-lg border border-gray-800 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="제목, 배우, 감독으로 검색..."
            value={debouncedSearchQuery}
            onChange={(e) => {
              setDebouncedSearchQuery(e.target.value);
              setShowSearchHistory(true);
            }}
            onFocus={() => setShowSearchHistory(true)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg 
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                     transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* 검색 기록 드롭다운 */}
          {showSearchHistory && searchHistory.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchHistorySelect(item.query)}
                  className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-800 
                           first:rounded-t-lg last:rounded-b-lg"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{item.query}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all
            ${!showFilters 
              ? 'bg-red-700 text-white hover:bg-red-800' 
              : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          <Filter className="w-5 h-5" />
          <span>필터 {showFilters ? '숨기기' : '표시'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 최근 필터 설정 */}
      {showFilters && recentFilters.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            최근 사용한 필터
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => applyFilterSettings(filter)}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm 
                         hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span>
                  {filter.genres.map(id => genres[id]).join(', ')} 
                  ({filter.year[0]}-{filter.year[1]})
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(filter.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

{/* 필터 패널 */}
<div className={`space-y-6 transition-all duration-200 ${showFilters ? 'opacity-100' : 'opacity-0 hidden'}`}>
  {/* 장르 선택 */}
  <div className="space-y-3">
    <label className="text-sm font-medium text-gray-200">장르</label>
    <div className="flex flex-wrap gap-2">
      {sortedGenres.map(([id, name]) => (
        <button
          key={id}
          onClick={() => handleGenreSelect(id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${selectedGenres.includes(id)
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {name}
        </button>
      ))}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* 평점 범위 */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-200">
        평점 범위: {ratingRange[0]} - {ratingRange[1]}
      </label>
      <div className="flex gap-4">
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={ratingRange[0]}
          onChange={(e) => handleRatingChange(parseFloat(e.target.value), true)}
          className="w-full accent-red-500"
        />
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={ratingRange[1]}
          onChange={(e) => handleRatingChange(parseFloat(e.target.value), false)}
          className="w-full accent-red-500"
        />
      </div>
    </div>

    {/* 년도 범위 */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-200">개봉년도</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1900"
          max={currentYear}
          value={yearRange[0]}
          onChange={(e) => handleYearChange(parseInt(e.target.value), true)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   focus:outline-none focus:border-red-500 focus:ring-2 
                   focus:ring-red-500/20 transition-all"
        />
        <span>-</span>
        <input
          type="number"
          min="1900"
          max={currentYear}
          value={yearRange[1]}
          onChange={(e) => handleYearChange(parseInt(e.target.value), false)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   focus:outline-none focus:border-red-500 focus:ring-2 
                   focus:ring-red-500/20 transition-all"
        />
      </div>
    </div>

    {/* 정렬 선택 */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-200">정렬 기준</label>
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setPage(1);
        }}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                 focus:outline-none focus:border-red-500 focus:ring-2 
                 focus:ring-red-500/20 transition-all"
      >
        {Object.entries(sortOptions || {}).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* 필터 초기화 */}
  <div className="flex justify-end pt-2">
    <button
      onClick={resetFilters}
      className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 
               rounded-lg transition-colors"
    >
      필터 초기화
    </button>
  </div>
</div>

{/* 활성 필터 표시 */}
{(selectedGenres.length > 0 || ratingRange[0] > 0 || ratingRange[1] < 10 || 
  yearRange[0] > 1900 || yearRange[1] < currentYear) && (
  <div className="flex flex-wrap gap-2 items-center pt-2">
    <span className="text-sm text-gray-400">활성 필터:</span>
    {selectedGenres.map(id => (
      <button
        key={id}
        onClick={() => handleGenreSelect(id)}
        className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 
                 text-red-400 hover:bg-red-600/30 rounded-full text-sm 
                 transition-colors"
      >
        {genres[id]}
        <X className="w-3 h-3 opacity-75 group-hover:opacity-100" />
      </button>
    ))}
    {(ratingRange[0] > 0 || ratingRange[1] < 10) && (
      <span className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-full text-sm">
        평점: {ratingRange[0]} - {ratingRange[1]}
      </span>
    )}
    {(yearRange[0] > 1900 || yearRange[1] < currentYear) && (
      <span className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-full text-sm">
        개봉년도: {yearRange[0]} - {yearRange[1]}
      </span>
    )}
  </div>
)}
    </div>
  );
};

export default SearchHeader;