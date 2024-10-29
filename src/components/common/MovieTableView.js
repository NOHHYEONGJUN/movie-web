import React from 'react';
import { Heart, ArrowUpDown, Star } from 'lucide-react';

const MovieTableView = ({ 
  movies, 
  onToggleRecommendation, 
  isMovieRecommended, 
  sortConfig, 
  onSort,
  showSortButtons = true  // 정렬 버튼 표시 여부 (검색 페이지에서는 false로 설정)
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
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
            <th className="hidden md:table-cell px-4 py-4 text-center w-48">
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
              <td className="hidden md:table-cell px-4 py-6">
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
  );
};

export default MovieTableView;