// src/store/slices/mainSlice.js
import { createSlice } from '@reduxjs/toolkit';

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    popularMovies: [],
    latestMovies: [],
    actionMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
    recommendedMovies: [],
    comedyMovies: [],
    horrorMovies: [],
    animationMovies: [],
    romanceMovies: [],
    documentaryMovies: [],
    kidsMovies: [],
    trendingMovies: [],
    highBudgetMovies: [],
    isLoading: true,
    error: null,
    viewMode: 'grid'  // viewMode 추가
  },
  reducers: {
    setMovieCategory: (state, action) => {
      const { category, movies } = action.payload;
      state[category] = movies;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
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
    initializeRecommendedMovies: (state, action) => {
      state.recommendedMovies = action.payload;
    },
    setViewMode: (state, action) => {    // setViewMode reducer 추가
      state.viewMode = action.payload;
    }
  }
});

export const {
  setMovieCategory,
  setLoading,
  setError,
  toggleRecommendation,
  initializeRecommendedMovies,
  setViewMode    // setViewMode 추가
} = mainSlice.actions;

export default mainSlice.reducer;