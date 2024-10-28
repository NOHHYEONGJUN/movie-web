import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishListPage';

function App() {
  return (
    <Router basename="/movie-web">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;