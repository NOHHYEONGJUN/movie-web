import React from 'react';
import { Heart, Star, Calendar } from 'lucide-react';

const MovieGridView = ({ 
  movies, 
  onToggleRecommendation, 
  isMovieRecommended,
  scrollRef
}) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
      {movies.map((movie, index) => (
        <div 
          key={`${movie.id}-${index}`} 
          className="relative group"
          ref={index === movies.length - 1 ? scrollRef : null}
        >
          <div className="relative transform-gpu transition-transform duration-300 hover:scale-105">
            <img 
              src={movie.image} 
              alt={movie.title}
              className={`w-full aspect-[2/3] object-cover rounded-lg shadow-lg
                ${isMovieRecommended(movie.id) ? 'ring-2 sm:ring-4 ring-rose-500' : ''}`}
            />
            
            {/* 오버레이 컨텐츠 */}
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 rounded-lg flex flex-col justify-between">
              {/* 상단 영역 */}
              <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-lg font-bold line-clamp-2 flex-1">
                    {movie.title}
                  </h3>
                  <button
                    onClick={(e) => onToggleRecommendation(movie, e)}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors flex-shrink-0
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
                
                {/* 줄거리 - 모바일에서도 표시 */}
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-3">
                  {movie.overview}
                </p>
              </div>

              {/* 하단 영역 */}
              <div className="p-2 sm:p-4 space-y-2">
                {/* 장르 태그 */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {movie.genres.slice(0, 3).map((genre, idx) => (
                      <span 
                        key={idx}
                        className="bg-gray-700/50 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* 개봉일 및 평점 */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-gray-300">{movie.release_date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-300">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGridView;