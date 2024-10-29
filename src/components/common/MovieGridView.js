import React from 'react';
import { Heart, Star, Calendar } from 'lucide-react';

const MovieGridView = ({ 
  movies, 
  onToggleRecommendation, 
  isMovieRecommended,
  scrollRef
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                ${isMovieRecommended(movie.id) ? 'ring-4 ring-rose-500' : ''}`}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 
              transition-opacity duration-300 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold line-clamp-2">{movie.title}</h3>
                  <button
                    onClick={(e) => onToggleRecommendation(movie, e)}
                    className={`p-2 rounded-full transition-colors
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3 mt-2">{movie.overview}</p>
              </div>
              <div className="space-y-4">
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, idx) => (
                      <span 
                        key={idx}
                        className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-gray-300">{movie.release_date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
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