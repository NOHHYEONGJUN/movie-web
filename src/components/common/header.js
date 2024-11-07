import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks'; 

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // 프로필 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  const handleNavClick = (e, path) => {
    // 로그인이 필요한 페이지 목록
    const authRequiredPaths = ['/wishlist', '/popular', '/search'];
    
    if (!isAuthenticated && authRequiredPaths.includes(path)) {
      e.preventDefault();
      navigate('/signin');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent">
      <nav className="flex items-center justify-between px-4 sm:px-12 py-3 sm:py-4">
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* Netflix Logo */}
          <Link to="/" className="text-red-600 text-2xl sm:text-3xl font-bold">
            NETFLIX
          </Link>
          
          {/* Mobile Navigation Menu */}
          <div className="flex space-x-3 sm:space-x-6 text-sm sm:text-base">
            <Link 
              to="/" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/')}
            >
              홈
            </Link>
            <Link 
              to="/popular" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/popular')}
            >
              대세 콘텐츠
            </Link>
            <Link 
              to="/wishlist" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/wishlist')}
            >
              내가 찜한 리스트
            </Link>
            <Link 
              to="/search" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/search')}
            >
              찾아보기
            </Link>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            aria-label="프로필"
            className="text-white hover:text-gray-300 p-1"
            onClick={handleProfileClick}
          >
            <User className="w-5 h-5" />
          </button>

          {showProfileMenu && isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                <div className="px-4 py-2 text-xs sm:text-sm text-gray-400 border-b border-gray-800">
                  {user?.email}
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-white hover:bg-gray-800 flex items-center space-x-2"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;