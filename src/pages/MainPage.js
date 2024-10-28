import React from 'react';
import Header from '../components/common/Header';

const MainPage = () => {
  const popularMovies = [
    { id: 1, title: "기생충", image: "/api/placeholder/300/169", rank: 1 },
    { id: 2, title: "어벤져스", image: "/api/placeholder/300/169", rank: 2 },
    { id: 3, title: "인터스텔라", image: "/api/placeholder/300/169", rank: 3 },
    { id: 4, title: "매트릭스", image: "/api/placeholder/300/169", rank: 4 },
    { id: 5, title: "인셉션", image: "/api/placeholder/300/169", rank: 5 }
  ];

  const latestMovies = [
    { id: 1, title: "듄", image: "/api/placeholder/300/169", isNew: true },
    { id: 2, title: "테넷", image: "/api/placeholder/300/169", isNew: true },
    { id: 3, title: "블랙 위도우", image: "/api/placeholder/300/169", isNew: true }
  ];

  const actionMovies = [
    { id: 1, title: "존 윅", image: "/api/placeholder/300/169" },
    { id: 2, title: "다크 나이트", image: "/api/placeholder/300/169" },
    { id: 3, title: "미션 임파서블", image: "/api/placeholder/300/169" },
    { id: 4, title: "킹스맨", image: "/api/placeholder/300/169" }
  ];

  const MovieSection = ({ title, movies, showRank = false, showNew = false }) => (
    <section className="px-12 pt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-8">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <img 
              src={movie.image} 
              alt={movie.title}
              className="w-[300px] rounded-md group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium">{movie.title}</h3>
              </div>
            </div>
            {showRank && movie.rank && (
              <div className="absolute top-2 left-2 w-8 h-8 bg-black/60 rounded-md flex items-center justify-center">
                <span className="text-2xl font-bold">{movie.rank}</span>
              </div>
            )}
            {showNew && movie.isNew && (
              <div className="absolute top-2 right-2">
                <span className="bg-red-600 text-white px-2 py-1 text-sm rounded">NEW</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16"> {/* Added padding-top to account for fixed header */}
        <MovieSection title="인기 영화" movies={popularMovies} showRank />
        <MovieSection title="최신 영화" movies={latestMovies} showNew />
        <MovieSection title="액션 & 어드벤처" movies={actionMovies} />
      </main>
    </div>
  );
};

export default MainPage;