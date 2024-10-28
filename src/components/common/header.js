import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent">
      <nav className="flex items-center justify-between px-12 py-4">
        <div className="flex items-center space-x-8">
          {/* Netflix Logo */}
          <Link to="/" className="text-red-600 text-3xl font-bold">
            NETFLIX
          </Link>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:text-gray-300">
              홈
            </Link>
            <Link to="/trending" className="text-white hover:text-gray-300">
              대세 콘텐츠
            </Link>
            <Link to="/my-list" className="text-white hover:text-gray-300">
              내가 찜한 리스트
            </Link>
            <Link to="/browse" className="text-white hover:text-gray-300">
              찾아보기
            </Link>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          <button aria-label="검색" className="text-white hover:text-gray-300">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="알림" className="text-white hover:text-gray-300">
            <Bell className="w-5 h-5" />
          </button>
          <button aria-label="프로필" className="text-white hover:text-gray-300">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;