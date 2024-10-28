import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Star, Calendar, Grid, List, ArrowUp } from 'lucide-react';
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
const ITEMS_PER_PAGE = 20;

const PopularPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [showTopButton, setShowTopButton] = useState(false);
  const observer = useRef();
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // Load recommended movies from localStorage
  useEffect(() => {
    const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
    if (savedMovies) {
      setRecommendedMovies(JSON.parse(savedMovies));
    }
  }, []);

  // Toggle recommendation
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

  // Fetch movies function
  const fetchMovieData = async (pageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMovies(getURL4PopularMovies(API_KEY, pageNum));
      const processedMovies = response.results.map(movie => ({
        ...movie,
        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/api/placeholder/300/169",
      }));

      if (viewType === 'grid' && pageNum > 1) {
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
  };

  // Infinite scroll handling
  const lastMovieElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewType === 'grid' && page < totalPages) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, page, totalPages, viewType]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.pageYOffset > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle page change for table view
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Fetch movies when page or view type changes
  useEffect(() => {
    fetchMovieData(page);
  }, [page, viewType]);

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {movies.map((movie, index) => {
        const recommended = isMovieRecommended(movie.id);
        if (movies.length === index + 1) {
          return (
            <div ref={lastMovieElementRef} key={`${movie.id}-${index}`} className="relative group">
              <MovieCard movie={movie} recommended={recommended} />
            </div>
          );
        }
        return (
          <div key={`${movie.id}-${index}`} className="relative group">
            <MovieCard movie={movie} recommended={recommended} />
          </div>
        );
      })}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="px-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-4 text-left">포스터</th>
              <th className="p-4 text-left">제목</th>
              <th className="p-4 text-left">개봉일</th>
              <th className="p-4 text-left">평점</th>
              <th className="p-4 text-left">추천</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                <td className="p-4">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                </td>
                <td className="p-4 font-medium">{movie.title}</td>
                <td className="p-4">{movie.release_date}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => toggleRecommendation(movie, e)}
                    className={`p-2 rounded-full transition-colors
                      ${isMovieRecommended(movie.id) ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <Heart className={`w-5 h-5 ${isMovieRecommended(movie.id) ? 'fill-white' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
    </div>
  );

  // Movie Card Component
  const MovieCard = ({ movie, recommended }) => (
    <div className="relative transition-transform duration-300 hover:scale-105">
      <img 
        src={movie.image} 
        alt={movie.title}
        className={`w-full aspect-[2/3] object-cover rounded-lg shadow-lg
          ${recommended ? 'ring-4 ring-rose-500' : ''}`}
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
                ${recommended ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${recommended ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-6 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">대세 콘텐츠</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-colors
                ${viewType === 'grid' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded-lg transition-colors
                ${viewType === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          viewType === 'grid' ? <GridView /> : <TableView />
        )}

        {isLoading && viewType === 'grid' && <LoadingSpinner />}

        {showTopButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-lg
              hover:bg-gray-100 transition-colors z-50"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
    </div>
  );
};

export default PopularPage;