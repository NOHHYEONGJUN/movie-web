import React, { useEffect, useState } from 'react';
import { Heart, Star, Calendar, Clock, TrendingUp, Zap, Film } from 'lucide-react';
import Header from '../components/common/header';
import { 
  getURL4PopularMovies, 
  getURL4ReleaseMovies, 
  getURL4GenreMovies, 
  getURL4TopRatedMovies,
  getURL4UpcomingMovies,
  getURL4ComedyMovies,
  getURL4HorrorMovies,
  getURL4AnimationMovies,
  getURL4RomanceMovies,
  getURL4DocumentaryMovies,
  getURL4KidsMovies,
  getURL4ThisWeekTrendingMovies,
  getURL4HighBudgetMovies,
  fetchMovies 
} from '../api/movieApi';

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';

const MainPage = () => {
  // 기본 영화 상태
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // 새로운 영화 카테고리 상태
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [documentaryMovies, setDocumentaryMovies] = useState([]);
  const [kidsMovies, setKidsMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [highBudgetMovies, setHighBudgetMovies] = useState([]);

  // UI 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // 초기 추천 영화 로드
  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }
  }, []);

  // 추천 토글 함수
  const toggleRecommendation = (movie, e) => {
    e.stopPropagation();
    setRecommendedMovies(prev => {
      const isRecommended = prev.some(m => m.id === movie.id);
      let newRecommended = isRecommended
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
      return newRecommended;
    });
  };

  const isMovieRecommended = (movieId) => {
    return recommendedMovies.some(movie => movie.id === movieId);
  };

  // 장르 변환 함수
  const getGenreName = (genreId) => {
    const genres = {
      28: '액션',
      12: '모험',
      16: '애니메이션',
      35: '코미디',
      80: '범죄',
      99: '다큐멘터리',
      18: '드라마',
      10751: '가족',
      14: '판타지',
      36: '역사',
      27: '공포',
      10402: '음악',
      9648: '미스터리',
      10749: '로맨스',
      878: 'SF',
      10770: 'TV 영화',
      53: '스릴러',
      10752: '전쟁',
      37: '서부'
    };
    return genres[genreId] || '';
  };

  // 모든 영화 데이터 fetch
  useEffect(() => {
    const fetchAllMovies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!API_KEY) {
          throw new Error('API 키가 설정되지 않았습니다.');
        }

        const requests = [
          fetchMovies(getURL4PopularMovies(API_KEY)),
          fetchMovies(getURL4ReleaseMovies(API_KEY)),
          fetchMovies(getURL4GenreMovies(API_KEY, '28')), // 액션
          fetchMovies(getURL4TopRatedMovies(API_KEY)),
          fetchMovies(getURL4UpcomingMovies(API_KEY)),
          fetchMovies(getURL4ComedyMovies(API_KEY)),
          fetchMovies(getURL4HorrorMovies(API_KEY)),
          fetchMovies(getURL4AnimationMovies(API_KEY)),
          fetchMovies(getURL4RomanceMovies(API_KEY)),
          fetchMovies(getURL4DocumentaryMovies(API_KEY)),
          fetchMovies(getURL4KidsMovies(API_KEY)),
          fetchMovies(getURL4ThisWeekTrendingMovies(API_KEY)),
          fetchMovies(getURL4HighBudgetMovies(API_KEY))
        ];

        const [
          popularData,
          latestData,
          actionData,
          topRatedData,
          upcomingData,
          comedyData,
          horrorData,
          animationData,
          romanceData,
          documentaryData,
          kidsData,
          trendingData,
          highBudgetData
        ] = await Promise.all(requests);

        const processMovieData = (movies) => movies.results.slice(0, 10).map(movie => ({
          ...movie,
          image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
          genres: movie.genre_ids.map(getGenreName).filter(Boolean)
        }));

        // 기본 영화 데이터 설정
        if (popularData?.results) {
          setPopularMovies(processMovieData(popularData).map((movie, index) => ({
            ...movie,
            rank: index + 1
          })));
        }

        if (latestData?.results) {
          setLatestMovies(processMovieData(latestData).map(movie => ({
            ...movie,
            isNew: true
          })));
        }

        if (actionData?.results) {
          setActionMovies(processMovieData(actionData));
        }

        if (topRatedData?.results) {
          setTopRatedMovies(processMovieData(topRatedData));
        }

        if (upcomingData?.results) {
          setUpcomingMovies(processMovieData(upcomingData));
        }

        // 새로운 카테고리 영화 데이터 설정
        if (comedyData?.results) {
          setComedyMovies(processMovieData(comedyData));
        }

        if (horrorData?.results) {
          setHorrorMovies(processMovieData(horrorData));
        }

        if (animationData?.results) {
          setAnimationMovies(processMovieData(animationData));
        }

        if (romanceData?.results) {
          setRomanceMovies(processMovieData(romanceData));
        }

        if (documentaryData?.results) {
          setDocumentaryMovies(processMovieData(documentaryData));
        }

        if (kidsData?.results) {
          setKidsMovies(processMovieData(kidsData));
        }

        if (trendingData?.results) {
          setTrendingMovies(processMovieData(trendingData).map((movie, index) => ({
            ...movie,
            trendingRank: index + 1
          })));
        }

        if (highBudgetData?.results) {
          setHighBudgetMovies(processMovieData(highBudgetData));
        }

      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, [API_KEY]);

  // 영화 섹션 컴포넌트
  const MovieSection = ({ 
    title, 
    movies, 
    showRank = false, 
    showNew = false,
    showTrendingRank = false,
    customBadge,
    icon: Icon
  }) => (
    <section className="px-12 pt-8 overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6" />}
        {title}
        {customBadge && (
          <span className="text-sm px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            {customBadge}
          </span>
        )}
      </h2>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-8 relative -ml-8">
        {movies.map((movie) => {
          const recommended = isMovieRecommended(movie.id);
          return (
            <div key={movie.id} className="relative group cursor-pointer hover:z-50 pl-8 py-16 first:pl-16">
              <div className="relative transform-gpu transition-transform duration-300 group-hover:scale-125">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className={`w-[300px] h-[450px] object-cover rounded-md shadow-lg
                    ${recommended ? 'ring-4 ring-rose-500' : ''}`}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pt-14">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
                        <button
                          onClick={(e) => toggleRecommendation(movie, e)}
                          className={`p-2 rounded-full transition-colors
                            ${recommended ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                          aria-label={recommended ? '추천 취소' : '추천하기'}
                        >
                          <Heart className={`w-5 h-5 ${recommended ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-4">{movie.overview}</p>
                    </div>
                    <div className="space-y-2">
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre, index) => (
                            <span 
                              key={index}
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
                          <span className="text-gray-300">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {showRank && movie.rank && (
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-black/60 rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{movie.rank}</span>
                    </div>
                  </div>
                )}
                {showTrendingRank && movie.trendingRank && (
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{movie.trendingRank}</span>
                    </div>
                  </div>
                )}
                {showNew && movie.isNew && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600 text-white px-2 py-1 text-sm rounded">
                      NEW
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-900/50 p-4 rounded-lg">
          <p className="text-red-200">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        {recommendedMovies.length > 0 && (
          <MovieSection 
            title="내가 추천하는 영화" 
            movies={recommendedMovies}
            icon={Heart} 
          />
        )}
        {trendingMovies.length > 0 && (
          <MovieSection 
            title="이번 주 트렌딩" 
            movies={trendingMovies} 
            showTrendingRank 
            customBadge="HOT"
            icon={TrendingUp}
          />
        )}
        {popularMovies.length > 0 && (
          <MovieSection 
            title="인기 영화" 
            movies={popularMovies} 
            showRank
            icon={Star} 
          />
        )}
        {topRatedMovies.length > 0 && (
          <MovieSection 
            title="최고 평점 영화" 
            movies={topRatedMovies}
            icon={Star} 
          />
        )}
        {highBudgetMovies.length > 0 && (
          <MovieSection 
            title="블록버스터" 
            movies={highBudgetMovies}
            customBadge="BIG"
            icon={Zap}
          />
        )}
        {latestMovies.length > 0 && (
          <MovieSection 
            title="현재 상영작" 
            movies={latestMovies} 
            showNew
            icon={Film} 
          />
        )}
        {upcomingMovies.length > 0 && (
          <MovieSection 
            title="개봉 예정작" 
            movies={upcomingMovies}
            icon={Calendar} 
          />
        )}
        {actionMovies.length > 0 && (
          <MovieSection 
            title="액션 & 어드벤처" 
            movies={actionMovies}
            icon={Zap} 
          />
        )}
        {comedyMovies.length > 0 && (
          <MovieSection 
            title="코미디" 
            movies={comedyMovies} 
          />
        )}
        {horrorMovies.length > 0 && (
          <MovieSection 
            title="공포" 
            movies={horrorMovies} 
          />
        )}
        {animationMovies.length > 0 && (
          <MovieSection 
            title="애니메이션" 
            movies={animationMovies} 
          />
        )}
        {romanceMovies.length > 0 && (
          <MovieSection 
            title="로맨스" 
            movies={romanceMovies} 
          />
        )}
        {documentaryMovies.length > 0 && (
          <MovieSection 
            title="다큐멘터리" 
            movies={documentaryMovies} 
          />
        )}
        {kidsMovies.length > 0 && (
          <MovieSection 
            title="키즈" 
            movies={kidsMovies} 
          />
        )}
      </main>
    </div>
  );
};

export default MainPage;