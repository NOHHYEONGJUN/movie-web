import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 초기 로그인 상태 확인
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

    // 컴포넌트 마운트 시 상태 확인
    checkAuth();

    // 로그인 이벤트 리스너
    const handleLogin = (event) => {
      setIsAuthenticated(true);
      setUser(event.detail);
    };

    // 이벤트 리스너 등록
    window.addEventListener('userLogin', handleLogin);

    return () => {
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    logout
  };
};