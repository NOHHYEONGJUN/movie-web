import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Star, Calendar, Grid, Table2, ArrowUp } from 'lucide-react';
import Header from '../components/common/header';
import { getURL4PopularMovies, fetchMovies } from '../api/movieApi';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';

const PopularPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [showTopButton, setShowTopButton] = useState(false);
  const observer = useRef();
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

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

  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }
  }, []);

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

  const fetchMovieData = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMovies(getURL4PopularMovies(API_KEY, pageNum));
      const processedMovies = response.results.map(movie => ({
        ...movie,
        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
        genres: movie.genre_ids.map(getGenreName).filter(Boolean)
      }));

      if (viewMode === 'grid' && pageNum > 1) {
        setMovies(prev => [...prev, ...processedMovies]);
      } else {
        setMovies(processedMovies);
      }
      
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('영화 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY, viewMode]);

  const lastMovieElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewMode === 'grid' && page < totalPages) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, page, totalPages, viewMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.pageYOffset > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchMovieData(page);
  }, [page, viewMode, fetchMovieData]);

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {movies.map((movie, index) => {
        if (movies.length === index + 1) {
          return (
            <div ref={lastMovieElementRef} key={`${movie.id}-${index}`} className="relative group">
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
                    <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{movie.release_date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <button
                        onClick={(e) => toggleRecommendation(movie, e)}
                        className={`p-2 rounded-full transition-colors
                          ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div key={`${movie.id}-${index}`} className="relative group">
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
                  <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{movie.release_date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <button
                      onClick={(e) => toggleRecommendation(movie, e)}
                      className={`p-2 rounded-full transition-colors
                        ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-sm">
        <thead className="text-base uppercase bg-gray-900">
          <tr>
            <th className="px-4 py-4 text-center w-40">
              <span className="text-lg">포스터</span>
            </th>
            <th className="px-4 py-4 text-center">
              <span className="text-lg">제목</span>
            </th>
            <th className="px-4 py-4 text-center w-40">
              <span className="text-lg">개봉일</span>
            </th>
            <th className="px-4 py-4 text-center w-36">
              <span className="text-lg">평점</span>
            </th>
            <th className="hidden md:table-cell px-4 py-4 text-center w-48">
              <span className="text-lg">장르</span>
            </th>
            <th className="px-4 py-4 text-center w-48">
              <span className="text-lg">찜</span>
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
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
              <td className="px-4 py-6">
                <button
                  onClick={(e) => toggleRecommendation(movie, e)}
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

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">대세 콘텐츠</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${viewMode === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <Table2 className="w-5 h-5" />
              <span className="hidden sm:inline">테이블 뷰</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <Grid className="w-5 h-5" />
              <span className="hidden sm:inline">그리드 뷰</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <>
                <TableView />
                {!isLoading && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                          />
                        </PaginationItem>
                        
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={page === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(totalPages)}
                                isActive={page === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <GridView />
            )}
            
            {isLoading && <LoadingSpinner />}

            {showTopButton && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-lg
                  hover:bg-gray-100 transition-colors z-50"
                aria-label="맨 위로 이동"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PopularPage;