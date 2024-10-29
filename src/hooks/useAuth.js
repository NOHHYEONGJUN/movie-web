import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const currentUser = localStorage.getItem('currentUser');

      if (isLoggedIn && currentUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(currentUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    const handleLogin = (event) => {
      setIsAuthenticated(true);
      setUser(event.detail);
    };

    window.addEventListener('userLogin', handleLogin);

    return () => {
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');

    setIsAuthenticated(false);
    setUser(null);

    toast.success('로그아웃 되었습니다', {
      duration: 3000,
      position: 'top-center'
    });

    navigate('/signin');
  };

  return {
    isAuthenticated,
    user,
    logout
  };
};
