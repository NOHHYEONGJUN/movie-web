import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    recommendedMovies: [],
    viewMode: 'grid',
    filters: {
      searchQuery: '',
      selectedGenres: [],
      ratingRange: [0, 10],
      yearRange: [1900, new Date().getFullYear()],
      sortBy: 'popularity.desc'
    },
    movies: [],
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 0,
    hasMore: true
  },
  reducers: {
    toggleRecommendation: (state, action) => {
      const movie = action.payload;
      const index = state.recommendedMovies.findIndex(m => m.id === movie.id);
      
      if (index === -1) {
        state.recommendedMovies.push(movie);
      } else {
        state.recommendedMovies.splice(index, 1);
      }
      
      localStorage.setItem('recommendedMovies', JSON.stringify(state.recommendedMovies));
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = movieSlice.initialState.filters;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    appendMovies: (state, action) => {
      state.movies = [...state.movies, ...action.payload];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    }
  }
});

export const {
  toggleRecommendation,
  setViewMode,
  updateFilters,
  resetFilters,
  setMovies,
  appendMovies,
  setLoading,
  setError,
  setPage,
  setTotalPages,
  setHasMore
} = movieSlice.actions;

export default movieSlice.reducer;