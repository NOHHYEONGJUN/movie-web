import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router basename="/movie-web">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;