import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishListPage';
import PopularPage from './pages/PopularPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router basename="/movie-web">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;