import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    keepLoggedIn: false,
    saveEmail: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {

    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        saveEmail: true
      }));
    }
  }, [isAuthenticated, navigate]);

  const verifyTMDBApiKey = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=${TMDB_API_KEY}`
      );
      return response.data.success;
    } catch (error) {
      console.error('TMDB API 인증 실패:', error);
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }
      if (!formData.termsAccepted) {
        newErrors.terms = '필수 약관에 동의해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const isApiValid = await verifyTMDBApiKey();
    if (!isApiValid) {
      toast.error('API 인증에 실패했습니다');
      return;
    }

    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      if (formData.saveEmail) {
        localStorage.setItem('savedEmail', formData.email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      localStorage.setItem('isLoggedIn', 'true');
      if (!formData.keepLoggedIn) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      const loginEvent = new CustomEvent('userLogin', { detail: user });
      window.dispatchEvent(loginEvent);

      toast.success('로그인에 성공했습니다', {
        duration: 3000,
        position: 'top-center'
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } else {
      toast.error('이메일 또는 비밀번호가 일치하지 않습니다', {
        duration: 3000,
        position: 'top-center'
      });
      setErrors({ auth: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }
  };

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);

    if (existingUser) {
      toast.error('이미 등록된 이메일입니다', {
        duration: 3000,
        position: 'top-center'
      });
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

    toast.success('회원가입이 완료되었습니다', {
      duration: 3000,
      position: 'top-center'
    });

    setIsLogin(true);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      keepLoggedIn: false,
      saveEmail: false,
      termsAccepted: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'keepLoggedIn' || name === 'saveEmail' || name === 'termsAccepted'
        ? checked
        : value
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 md:px-8">
      <Toaster position="top-center" />
      <div className="bg-black/75 p-6 sm:p-8 md:p-16 rounded-md w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
              {isLogin ? '로그인' : '회원가입'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {errors.auth && (
                <div className="bg-red-500/20 text-red-500 p-3 sm:p-4 rounded text-center text-sm sm:text-base">
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
                  className="w-full bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-md text-base sm:text-lg
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-md text-base sm:text-lg
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="비밀번호 확인"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-md text-base sm:text-lg
                        placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="w-4 sm:w-5 h-4 sm:h-5 bg-gray-800 border-gray-600 rounded
                        focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="termsAccepted" className="text-gray-300 ml-3 text-sm sm:text-base">
                      필수 약관에 동의합니다
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.terms}</p>
                  )}
                </>
              )}

              {isLogin && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveEmail"
                      id="saveEmail"
                      checked={formData.saveEmail}
                      onChange={handleInputChange}
                      className="w-4 sm:w-5 h-4 sm:h-5 bg-gray-800 border-gray-600 rounded
                        focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="saveEmail" className="text-gray-300 ml-3 text-sm sm:text-base">
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
                      className="w-4 sm:w-5 h-4 sm:h-5 bg-gray-800 border-gray-600 rounded
                        focus:ring-2 focus:ring-red-600"
                    />
                    <label htmlFor="keepLoggedIn" className="text-gray-300 ml-3 text-sm sm:text-base">
                      로그인 상태 유지
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 sm:py-4 rounded-md text-base sm:text-lg
                  hover:bg-red-700 transition-colors font-medium mt-6 sm:mt-8"
              >
                {isLogin ? '로그인' : '회원가입'}
              </button>
            </form>

            <p className="text-gray-400 mt-6 text-center text-sm sm:text-base">
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
