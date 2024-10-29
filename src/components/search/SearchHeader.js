import React from 'react';
import { Search, Filter, X } from 'lucide-react';

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
  setPage
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="영화 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          필터
        </button>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 장르 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">장르</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(genres).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedGenres(prev =>
                        prev.includes(id)
                          ? prev.filter(g => g !== id)
                          : [...prev, id]
                      );
                      setPage(1);
                    }}
                    className={`px-2 py-1 rounded text-xs
                      ${selectedGenres.includes(id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 평점 범위 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                평점 범위: {ratingRange[0]} - {ratingRange[1]}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={ratingRange[0]}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setRatingRange([value, Math.max(value, ratingRange[1])]);
                    setPage(1);
                  }}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={ratingRange[1]}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setRatingRange([Math.min(ratingRange[0], value), value]);
                    setPage(1);
                  }}
                  className="w-full"
                />
              </div>
            </div>

            {/* 년도 범위 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                개봉년도: {yearRange[0]} - {yearRange[1]}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={yearRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setYearRange([value, Math.max(value, yearRange[1])]);
                    setPage(1);
                  }}
                  className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={yearRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setYearRange([Math.min(yearRange[0], value), value]);
                    setPage(1);
                  }}
                  className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded"
                />
              </div>
            </div>

            {/* 정렬 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">정렬</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}

      {/* 활성화된 필터 표시 */}
      {(selectedGenres.length > 0 || ratingRange[0] > 0 || ratingRange[1] < 10 || 
        yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear()) && (
        <div className="flex flex-wrap gap-2 items-center mt-4">
          <span className="text-sm text-gray-400">활성 필터:</span>
          {selectedGenres.map(id => (
            <span
              key={id}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-sm"
            >
              {genres[id]}
              <button
                onClick={() => {
                  setSelectedGenres(prev => prev.filter(g => g !== id));
                  setPage(1);
                }}
                className="ml-1 hover:text-gray-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {(ratingRange[0] > 0 || ratingRange[1] < 10) && (
            <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
              평점: {ratingRange[0]} - {ratingRange[1]}
            </span>
          )}
          {(yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear()) && (
            <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
              개봉년도: {yearRange[0]} - {yearRange[1]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};