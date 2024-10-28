import { STORAGE_KEYS } from './constants';

export const storage = {
  // 사용자 관련
  getUsers: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  
  setUsers: (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
  
  // 로그인 상태 관련
  getIsLoggedIn: () => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  },
  
  setIsLoggedIn: (isLoggedIn) => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  },
  
  // 사용자 추가
  addUser: (user) => {
    const users = storage.getUsers();
    users.push(user);
    storage.setUsers(users);
  },
  
  // 사용자 업데이트
  updateUser: (email, updates) => {
    const users = storage.getUsers();
    const updatedUsers = users.map(user => 
      user.email === email ? { ...user, ...updates } : user
    );
    storage.setUsers(updatedUsers);
    
    // 현재 사용자인 경우 currentUser도 업데이트
    const currentUser = storage.getCurrentUser();
    if (currentUser && currentUser.email === email) {
      storage.setCurrentUser({ ...currentUser, ...updates });
    }
  },
  
  // 로그아웃
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  }
};