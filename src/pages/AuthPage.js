import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';

const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    keepLoggedIn: false,
    saveEmail: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 사용자 리다이렉트
    if (isAuthenticated) {
      navigate('/');
    }

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        saveEmail: true
      }));
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isLogin) {
      // 로그인 로직
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        // 아이디 저장 처리
        if (formData.saveEmail) {
          localStorage.setItem('savedEmail', formData.email);
        } else {
          localStorage.removeItem('savedEmail');
        }
      
        // 로그인 상태 저장 - 무조건 저장하도록 수정
        localStorage.setItem('isLoggedIn', 'true');
        // keepLoggedIn이 false인 경우에는 세션 스토리지에 저장
        if (!formData.keepLoggedIn) {
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        // 현재 사용자 정보 저장 및 이벤트 발생
        localStorage.setItem('currentUser', JSON.stringify(user));
        const loginEvent = new CustomEvent('userLogin', { detail: user });
        window.dispatchEvent(loginEvent);
        
        navigate('/');
      } else {
        setErrors({ auth: '이메일 또는 비밀번호가 일치하지 않습니다' });
      }
    } else {
      // 회원가입 로직
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === formData.email);
      
      if (existingUser) {
        setErrors({ email: '이미 등록된 이메일입니다' });
        return;
      }

      const newUser = {
        email: formData.email,
        password: formData.password,
        favoriteMovies: [],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // 회원가입 성공 메시지 표시 후 로그인 폼으로 전환
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      setIsLogin(true);
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'keepLoggedIn' || name === 'saveEmail' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-black/75 p-8 md:p-16 rounded-md w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-white text-4xl font-bold mb-12 text-center">
              {isLogin ? '로그인' : '회원가입'}
            </h1>
  
            <form onSubmit={handleSubmit} className="space-y-8">
              {errors.auth && (
                <div className="bg-red-500/20 text-red-500 p-4 rounded text-center">
                  {errors.auth}
                </div>
              )}
  
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="이메일 주소"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-md text-lg
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>
  
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-md text-lg
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>
  
              {!isLogin && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white px-6 py-4 rounded-md text-lg
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
  
              {isLogin && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveEmail"
                      id="saveEmail"
                      checked={formData.saveEmail}
                      onChange={handleInputChange}
                      className="w-5 h-5 bg-gray-800 border-gray-600 rounded
                        focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="saveEmail" className="text-gray-300 ml-3 text-base">
                      아이디 저장
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="keepLoggedIn"
                      id="keepLoggedIn"
                      checked={formData.keepLoggedIn}
                      onChange={handleInputChange}
                      className="w-5 h-5 bg-gray-800 border-gray-600 rounded
                        focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="keepLoggedIn" className="text-gray-300 ml-3 text-base">
                      로그인 상태 유지
                    </label>
                  </div>
                </div>
              )}
  
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-md text-lg
                  hover:bg-red-700 transition-colors font-medium mt-8"
              >
                {isLogin ? '로그인' : '회원가입'}
              </button>
            </form>
  
            <p className="text-gray-400 mt-6 text-center text-base">
              {isLogin ? '처음이신가요?' : '이미 계정이 있으신가요?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white ml-2 hover:underline font-medium"
              >
                {isLogin ? '지금 가입하기' : '로그인하기'}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;