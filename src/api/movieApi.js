import axios from "axios";

// API 키 유효성 검증
const verifyApiKey = async (apiKey) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`
        );
        return response.data.success;
    } catch (error) {
        console.error('API 키 검증 실패:', error);
        return false;
    }
};

const fetchFeaturedMovie = async (apiKey) => {
    if (!apiKey) {
        throw new Error('API 키가 필요합니다');
    }
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`
        );
        return response.data.results[0];
    } catch (error) {
        console.error('Error fetching featured movie:', error);
        throw error;
    }
};

const getURL4PopularMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
};

const getURL4ReleaseMovies = (apiKey, page = 2) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
};

const getURL4GenreMovies = (apiKey, genre, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
};

const getURL4TopRatedMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=${page}`;
};

const getURL4UpcomingMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko-KR&page=${page}`;
};

const getURL4ComedyMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '35', page);
};

const getURL4HorrorMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '27', page);
};

const getURL4AnimationMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '16', page);
};

const getURL4RomanceMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '10749', page);
};

const getURL4DocumentaryMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '99', page);
};

const getURL4KidsMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return getURL4GenreMovies(apiKey, '10751', page);
};

const getURL4ThisWeekTrendingMovies = (apiKey) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ko-KR`;
};

const getURL4HighBudgetMovies = (apiKey, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    const currentYear = new Date().getFullYear();
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&sort_by=budget.desc&primary_release_year=${currentYear}&page=${page}`;
};

const getURL4MovieDetail = (apiKey, movieId) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`;
};

const getURL4SimilarMovies = (apiKey, movieId, page = 1) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    return `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=ko-KR&page=${page}`;
};

const fetchMovies = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        if (error.response?.status === 401) {
            throw new Error('유효하지 않은 API 키입니다');
        }
        throw error;
    }
};

const fetchMovieDetail = async (apiKey, movieId) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    try {
        const response = await axios.get(getURL4MovieDetail(apiKey, movieId));
        return response.data;
    } catch (error) {
        console.error('Error fetching movie detail:', error);
        if (error.response?.status === 401) {
            throw new Error('유효하지 않은 API 키입니다');
        }
        throw error;
    }
};

const fetchSimilarMovies = async (apiKey, movieId) => {
    if (!apiKey) throw new Error('API 키가 필요합니다');
    try {
        const response = await axios.get(getURL4SimilarMovies(apiKey, movieId));
        return response.data;
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        if (error.response?.status === 401) {
            throw new Error('유효하지 않은 API 키입니다');
        }
        throw error;
    }
};

export {
    verifyApiKey,
    fetchFeaturedMovie,
    getURL4PopularMovies,
    getURL4ReleaseMovies,
    getURL4GenreMovies,
    getURL4TopRatedMovies,
    getURL4UpcomingMovies,
    getURL4ComedyMovies,
    getURL4HorrorMovies,
    getURL4AnimationMovies,
    getURL4RomanceMovies,
    getURL4DocumentaryMovies,
    getURL4KidsMovies,
    getURL4ThisWeekTrendingMovies,
    getURL4HighBudgetMovies,
    getURL4MovieDetail,
    getURL4SimilarMovies,
    fetchMovies,
    fetchMovieDetail,
    fetchSimilarMovies
};