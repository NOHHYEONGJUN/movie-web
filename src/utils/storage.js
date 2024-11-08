import { STORAGE_KEYS } from './constants';

export const storage = {
  // 기존 사용자 관련 기능
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
  
  getIsLoggedIn: () => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  },
  
  setIsLoggedIn: (isLoggedIn) => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  },
  
  addUser: (user) => {
    const users = storage.getUsers();
    users.push(user);
    storage.setUsers(users);
  },
  
  updateUser: (email, updates) => {
    const users = storage.getUsers();
    const updatedUsers = users.map(user => 
      user.email === email ? { ...user, ...updates } : user
    );
    storage.setUsers(updatedUsers);
    
    const currentUser = storage.getCurrentUser();
    if (currentUser && currentUser.email === email) {
      storage.setCurrentUser({ ...currentUser, ...updates });
    }
  },
  
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  },

  // 검색 관련 기능 추가
  getSearchHistory: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
  },

  addSearchHistory: (query) => {
    if (!query.trim()) return;
    
    const history = storage.getSearchHistory();
    const newHistory = [
      { query, timestamp: new Date().toISOString() },
      ...history.filter(item => item.query !== query)
    ].slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    return newHistory;
  },

  clearSearchHistory: () => {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // 최근 필터 관련
  getRecentFilters: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_FILTERS) || '[]');
  },

  addRecentFilter: (filter) => {
    const filters = storage.getRecentFilters();
    const newFilters = [
      { ...filter, timestamp: new Date().toISOString() },
      ...filters
    ].slice(0, 5);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_FILTERS, JSON.stringify(newFilters));
    return newFilters;
  },

  clearRecentFilters: () => {
    localStorage.removeItem(STORAGE_KEYS.RECENT_FILTERS);
  },

  // 마지막 검색 설정
  getLastSearchSettings: () => {
    return {
      query: localStorage.getItem(STORAGE_KEYS.LAST_SEARCH_QUERY) || '',
      genres: JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_SELECTED_GENRES) || '[]'),
      rating: JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_RATING_RANGE) || '[0, 10]'),
      year: JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_YEAR_RANGE) || 
            `[1900, ${new Date().getFullYear()}]`),
      sortBy: localStorage.getItem(STORAGE_KEYS.LAST_SORT_BY) || 'popularity.desc'
    };
  },

  saveLastSearchSettings: (settings) => {
    const { query, genres, rating, year, sortBy } = settings;
    localStorage.setItem(STORAGE_KEYS.LAST_SEARCH_QUERY, query);
    localStorage.setItem(STORAGE_KEYS.LAST_SELECTED_GENRES, JSON.stringify(genres));
    localStorage.setItem(STORAGE_KEYS.LAST_RATING_RANGE, JSON.stringify(rating));
    localStorage.setItem(STORAGE_KEYS.LAST_YEAR_RANGE, JSON.stringify(year));
    localStorage.setItem(STORAGE_KEYS.LAST_SORT_BY, sortBy);
  },

  clearLastSearchSettings: () => {
    localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH_QUERY);
    localStorage.removeItem(STORAGE_KEYS.LAST_SELECTED_GENRES);
    localStorage.removeItem(STORAGE_KEYS.LAST_RATING_RANGE);
    localStorage.removeItem(STORAGE_KEYS.LAST_YEAR_RANGE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SORT_BY);
  }
};