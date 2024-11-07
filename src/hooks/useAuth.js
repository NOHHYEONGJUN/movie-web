import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 로그인 상태 확인
    const checkAuth = () => {

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                        sessionStorage.getItem('isLoggedIn') === 'true';
      const currentUser = localStorage.getItem('currentUser') || 
                         sessionStorage.getItem('currentUser');
      const storedApiKey = localStorage.getItem('tmdb_api_key') ||
                          sessionStorage.getItem('tmdb_api_key');

      if (isLoggedIn && currentUser && storedApiKey) {
        setIsAuthenticated(true);
        setUser(JSON.parse(currentUser));
        setApiKey(storedApiKey);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setApiKey(null);
      }
      setIsLoading(false);
    };

    // 컴포넌트 마운트 시 상태 확인
    checkAuth();

    const handleStorage = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorage);


    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tmdb_api_key');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('tmdb_api_key');

    setIsAuthenticated(false);
    setUser(null);
    setApiKey(null);

    toast.success('로그아웃 되었습니다', {
      duration: 3000,
      position: 'top-center'
    });

    navigate('/signin');
  };

  return {
    isAuthenticated,
    user,
    apiKey,
    logout,
    isLoading
  };
};