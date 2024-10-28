import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
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
    const authRequiredPaths = ['/my-list'];
    
    if (!isAuthenticated && authRequiredPaths.includes(path)) {
      e.preventDefault();
      navigate('/signin');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent">
      <nav className="flex items-center justify-between px-12 py-4">
        <div className="flex items-center space-x-8">
          {/* Netflix Logo */}
          <Link to="/" className="text-red-600 text-3xl font-bold">
            NETFLIX
          </Link>
          
          {/* Navigation Links - 항상 표시 */}
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/')}
            >
              홈
            </Link>
            <Link 
              to="/trending" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/trending')}
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
              to="/browse" 
              className="text-white hover:text-gray-300"
              onClick={(e) => handleNavClick(e, '/browse')}
            >
              찾아보기
            </Link>
          </div>
        </div>

        {/* Right Side Icons - 로그인된 경우만 표시 */}
        <div className="flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <button aria-label="검색" className="text-white hover:text-gray-300">
                <Search className="w-5 h-5" />
              </button>
              <button aria-label="알림" className="text-white hover:text-gray-300">
                <Bell className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* 프로필 버튼 */}
          <div className="relative" ref={menuRef}>
            <button
              aria-label="프로필"
              className="text-white hover:text-gray-300 flex items-center space-x-2"
              onClick={handleProfileClick}
            >
              <User className="w-5 h-5" />
              {isAuthenticated && (
                <span className="text-sm hidden md:inline">
                  {user?.email?.split('@')[0]}
                </span>
              )}
            </button>

            {/* 프로필 드롭다운 메뉴 */}
            {showProfileMenu && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
                    {user?.email}
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center space-x-2"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;