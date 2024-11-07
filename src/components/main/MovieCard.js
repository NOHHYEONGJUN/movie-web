import React from 'react';
import { Heart, Calendar, Star } from 'lucide-react';
import { STYLES } from '../../constants/movieConstants';

const MovieCard = ({
  movie,
  isRecommended,
  onToggleRecommendation,
  showRank = false,
  showNew = false,
  showTrendingRank = false
}) => {
  return (
    <div className="relative group cursor-pointer hover:z-50 pl-8 py-16 first:pl-16">
      <div className="relative transform-gpu transition-transform duration-300 group-hover:scale-125">
        <img 
          src={movie.image} 
          alt={movie.title}
          className={`w-[300px] h-[450px] object-cover rounded-md shadow-lg
            ${isRecommended ? 'ring-4 ring-rose-500' : ''}`}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md">
          <div className="absolute inset-0 p-4 flex flex-col justify-between pt-14">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
                <button
                  onClick={(e) => onToggleRecommendation(movie, e)}
                  className={`p-2 rounded-full transition-colors
                    ${isRecommended ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  aria-label={isRecommended ? '추천 취소' : '추천하기'}
                >
                  <Heart className={`w-5 h-5 ${isRecommended ? 'fill-white' : ''}`} />
                </button>
              </div>
              <p className="text-gray-300 text-sm line-clamp-4">{movie.overview}</p>
            </div>
            <div className="space-y-2">
              <GenreList genres={movie.genres} />
              <MovieMetadata 
                releaseDate={movie.release_date} 
                rating={movie.vote_average} 
              />
            </div>
          </div>
        </div>
        <MovieBadges 
          rank={movie.rank}
          trendingRank={movie.trendingRank}
          isNew={movie.isNew}
          showRank={showRank}
          showTrendingRank={showTrendingRank}
          showNew={showNew}
        />
      </div>
    </div>
  );
};

const GenreList = ({ genres }) => {
  if (!genres?.length) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre, index) => (
        <span 
          key={index}
          className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
        >
          {genre}
        </span>
      ))}
    </div>
  );
};

const MovieMetadata = ({ releaseDate, rating }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4" />
      <span className="text-gray-300">{releaseDate}</span>
    </div>
    <div className="flex items-center space-x-1">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      <span className="text-gray-300">{rating.toFixed(1)}</span>
    </div>
  </div>
);

const MovieBadges = ({ 
  rank, 
  trendingRank, 
  isNew, 
  showRank, 
  showTrendingRank, 
  showNew 
}) => (
  <>
    {showRank && rank && (
      <div className={STYLES.rankBadge.wrapper}>
        <div className={STYLES.rankBadge.regular}>
          <span className={STYLES.rankBadge.text}>{rank}</span>
        </div>
      </div>
    )}
    {showTrendingRank && trendingRank && (
      <div className={STYLES.rankBadge.wrapper}>
        <div className={STYLES.rankBadge.trending}>
          <span className={STYLES.rankBadge.text}>{trendingRank}</span>
        </div>
      </div>
    )}
    {showNew && isNew && (
      <div className="absolute top-2 left-2">
        <span className={STYLES.newBadge}>NEW</span>
      </div>
    )}
  </>
);

export default MovieCard;