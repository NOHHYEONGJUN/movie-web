import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks'; 

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 프로필 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모바일 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMobileMenu]);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  const handleNavClick = (e, path) => {
    const authRequiredPaths = ['/wishlist', '/popular', '/search'];
    
    if (!isAuthenticated && authRequiredPaths.includes(path)) {
      e.preventDefault();
      navigate('/signin');
    } else {
      setShowMobileMenu(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-b from-black/80 via-black/60 to-transparent">
      <nav 
        className={`flex items-center justify-between px-4 sm:px-12 transition-all duration-300 ease-in-out
          ${scrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'}`}
      >
        <div className="flex items-center">
          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            className="md:hidden mr-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="메뉴 열기"
          >
            <Menu className={`transition-all duration-300 ${scrolled ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </button>

          <Link 
            to="/" 
            className={`text-red-600 font-bold transition-all duration-300
              ${scrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
          >
            NOH-FLIX
          </Link>
          
          {/* 데스크톱 네비게이션 */}
          <div className={`hidden md:flex space-x-6 ml-8 transition-all duration-300
            ${scrolled ? 'text-sm' : 'text-base'}`}
          >
            <Link 
              to="/" 
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => handleNavClick(e, '/')}
            >
              홈
            </Link>
            <Link 
              to="/popular" 
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => handleNavClick(e, '/popular')}
            >
              대세 콘텐츠
            </Link>
            <Link 
              to="/wishlist" 
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => handleNavClick(e, '/wishlist')}
            >
              내가 찜한 리스트
            </Link>
            <Link 
              to="/search" 
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => handleNavClick(e, '/search')}
            >
              찾아보기
            </Link>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            aria-label="프로필"
            className="text-white hover:text-gray-300 p-1 transition-colors"
            onClick={handleProfileClick}
          >
            <User className={`transition-all duration-300 ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>

          {showProfileMenu && isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                <div className="px-4 py-2 text-xs sm:text-sm text-gray-400 border-b border-gray-800">
                  {user?.email}
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-white hover:bg-gray-800 flex items-center space-x-2 transition-colors"
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

      {/* 모바일 사이드 메뉴 */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-[10000]
          ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          ref={mobileMenuRef}
          className={`fixed top-0 left-0 bottom-0 w-64 bg-black/95 transform transition-transform duration-300 ease-in-out
            ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className="text-lg text-white font-medium">메뉴</span>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="메뉴 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col py-4">
            <Link 
              to="/" 
              className="px-4 py-3 text-white hover:bg-gray-800 transition-colors"
              onClick={(e) => handleNavClick(e, '/')}
            >
              홈
            </Link>
            <Link 
              to="/popular" 
              className="px-4 py-3 text-white hover:bg-gray-800 transition-colors"
              onClick={(e) => handleNavClick(e, '/popular')}
            >
              대세 콘텐츠
            </Link>
            <Link 
              to="/wishlist" 
              className="px-4 py-3 text-white hover:bg-gray-800 transition-colors"
              onClick={(e) => handleNavClick(e, '/wishlist')}
            >
              내가 찜한 리스트
            </Link>
            <Link 
              to="/search" 
              className="px-4 py-3 text-white hover:bg-gray-800 transition-colors"
              onClick={(e) => handleNavClick(e, '/search')}
            >
              찾아보기
            </Link>
          </div>

          {isAuthenticated && (
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800">
              <div className="px-4 py-2 text-sm text-gray-400">
                {user?.email}
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-white hover:bg-gray-800 flex items-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;