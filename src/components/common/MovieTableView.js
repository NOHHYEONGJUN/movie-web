import React from 'react';
import { Heart, ArrowUpDown, Star } from 'lucide-react';

const MovieTableView = ({ 
  movies, 
  onToggleRecommendation, 
  isMovieRecommended, 
  sortConfig, 
  onSort,
  showSortButtons = true  
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">      
      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="text-base uppercase bg-gray-900">
            <tr>
              <th className="px-4 py-4 text-center w-40">
                <span className="text-lg">포스터</span>
              </th>
              <th className={`px-4 py-4 ${showSortButtons ? 'cursor-pointer' : ''}`} 
                onClick={() => showSortButtons && onSort?.('title')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">제목</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'title' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className={`px-4 py-4 w-40 ${showSortButtons ? 'cursor-pointer' : ''}`}
                onClick={() => showSortButtons && onSort?.('release_date')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">개봉일</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'release_date' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className={`px-4 py-4 w-36 ${showSortButtons ? 'cursor-pointer' : ''}`}
                onClick={() => showSortButtons && onSort?.('vote_average')}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">평점</span>
                  {showSortButtons && (
                    <ArrowUpDown className={`w-5 h-5 ${sortConfig?.key === 'vote_average' ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-center w-48">
                <span className="text-lg">장르</span>
              </th>
              <th className="px-4 py-4 text-center w-48">
                <span className="text-lg">찜</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b border-gray-800 bg-gray-900/50 hover:bg-gray-900">
                <td className="px-4 py-6">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-28 h-40 object-cover rounded-lg mx-auto shadow-lg"
                    loading="lazy"
                  />
                </td>
                <td className="px-4 py-6">
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{movie.title || movie.original_title}</p>
                    <p className="text-sm text-gray-400 line-clamp-2 max-w-xl">{movie.overview}</p>
                  </div>
                </td>
                <td className="px-4 py-6 text-lg">{movie.release_date}</td>
                <td className="px-4 py-6">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-6">
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
                <td className="px-4 py-6 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRecommendation(movie, e);
                    }}
                    className={`p-3 rounded-full transition-colors mx-auto
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    aria-label={isMovieRecommended(movie.id) ? '찜하기 취소' : '찜하기'}
                  >
                    <Heart className={`w-6 h-6 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="md:hidden">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="px-4 py-3 bg-transparent hover:bg-gray-900/70 border-b border-gray-800"
          >
            <div className="flex gap-3">
              <img 
                src={movie.image} 
                alt={movie.title}
                className="w-20 h-32 object-cover rounded-lg shadow-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-medium truncate pr-2">
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
                <p className="text-sm text-gray-400 line-clamp-2 mt-1 mb-2">{movie.overview}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{movie.release_date}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {movie.genres?.map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700/50 text-white text-xs px-2 py-0.5 rounded"
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

export default MovieTableView;