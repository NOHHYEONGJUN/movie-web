import React from 'react';
import { STYLES } from '../../constants/movieConstants';
import MovieCard from './MovieCard';

const MovieSection = ({ 
    title, 
    movies, 
    showRank = false, 
    showNew = false,
    showTrendingRank = false,
    customBadge,
    icon: Icon,
    isMovieRecommended,  
    onToggleRecommendation  
  }) => (
    <section className="px-12 pt-8 overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6" />}
        {title}
        {customBadge && (
          <span className={STYLES.customBadge}>
            {customBadge}
          </span>
        )}
      </h2>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-8 relative -ml-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isRecommended={isMovieRecommended(movie.id)}
            onToggleRecommendation={onToggleRecommendation}
            showRank={showRank}
            showNew={showNew}
            showTrendingRank={showTrendingRank}
          />
        ))}
      </div>
    </section>
  );

export default MovieSection;