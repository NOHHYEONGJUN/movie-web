import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishListPage';
import PopularPage from './pages/PopularPage';
import SearchPage from './pages/SearchPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    // 무조건 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router basename="/movie-web">
        <Routes>
          {/* 로그인 페이지는 PublicRoute로 감싸기 */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          
          {/* 나머지 모든 페이지는 PrivateRoute로 감싸기 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/popular"
            element={
              <PrivateRoute>
                <PopularPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;