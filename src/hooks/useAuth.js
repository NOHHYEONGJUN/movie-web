import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                        sessionStorage.getItem('isLoggedIn') === 'true';
      const currentUser = localStorage.getItem('currentUser') || 
                         sessionStorage.getItem('currentUser');

      if (isLoggedIn && currentUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(currentUser));
      } 
      // else {
      //   setIsAuthenticated(false);
      //   setUser(null);
      // }
      setIsLoading(false);
    };

    checkAuth();

    // const handleLogin = (event) => {
    //   setIsAuthenticated(true);
    //   setUser(event.detail);
    // };

    const handleStorage = () => {
      checkAuth();
    };

    // window.addEventListener('userLogin', handleLogin);
    window.addEventListener('storage', handleStorage);

    return () => {
      // window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('storage', handleStorage);
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
    logout,
    isLoading
  };
};