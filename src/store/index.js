import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import authReducer from './slices/authSlice';
import mainReducer from './slices/mainSlice';

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    auth: authReducer,
    main: mainReducer
  }
});