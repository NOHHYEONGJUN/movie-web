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
    <section className="pt-4 md:pt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 px-4 md:px-12">
        {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" />}
        {title}
        {customBadge && (
          <span className={STYLES.customBadge}>
            {customBadge}
          </span>
        )}
      </h2>
      <div className="relative -mx-4 md:-mx-12">
        <div 
          className="flex overflow-x-auto pb-6 md:pb-8 no-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'max(16px, calc(50% - 150px))',
            paddingRight: 'max(16px, calc(50% - 150px))',
          }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              className="flex-none mr-2 last:mr-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <MovieCard
                movie={movie}
                isRecommended={isMovieRecommended(movie.id)}
                onToggleRecommendation={onToggleRecommendation}
                showRank={showRank}
                showNew={showNew}
                showTrendingRank={showTrendingRank}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

export default MovieSection;