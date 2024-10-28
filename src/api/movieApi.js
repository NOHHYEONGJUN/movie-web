import axios from "axios";

const fetchFeaturedMovie = async (apiKey) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
        return response.data.results[0];
    } catch (error) {
        console.error('Error fetching featured movie:', error);
    }
}

const getURL4PopularMovies = (apiKey, page = 1) => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const getURL4ReleaseMovies = (apiKey, page = 2) => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const getURL4GenreMovies = (apiKey, genre, page = 1) => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
}

const getURL4TopRatedMovies = (apiKey, page = 1) => {
    return `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const getURL4UpcomingMovies = (apiKey, page = 1) => {
    return `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

// 새로 추가된 API 엔드포인트들
const getURL4ComedyMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '35', page); // 35는 코미디 장르 ID
}

const getURL4HorrorMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '27', page); // 27은 공포 장르 ID
}

const getURL4AnimationMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '16', page); // 16은 애니메이션 장르 ID
}

const getURL4RomanceMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '10749', page); // 10749는 로맨스 장르 ID
}

const getURL4DocumentaryMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '99', page); // 99는 다큐멘터리 장르 ID
}

const getURL4KidsMovies = (apiKey, page = 1) => {
    return getURL4GenreMovies(apiKey, '10751', page); // 10751은 가족/키즈 장르 ID
}

const getURL4ThisWeekTrendingMovies = (apiKey) => {
    return `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ko-KR`;
}

const getURL4HighBudgetMovies = (apiKey, page = 1) => {
    const currentYear = new Date().getFullYear();
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&sort_by=budget.desc&primary_release_year=${currentYear}&page=${page}`;
}

const getURL4MovieDetail = (apiKey, movieId) => {
    return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`;
}

const getURL4SimilarMovies = (apiKey, movieId, page = 1) => {
    return `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const fetchMovies = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

const fetchMovieDetail = async (apiKey, movieId) => {
    try {
        const response = await axios.get(getURL4MovieDetail(apiKey, movieId));
        return response.data;
    } catch (error) {
        console.error('Error fetching movie detail:', error);
    }
}

const fetchSimilarMovies = async (apiKey, movieId) => {
    try {
        const response = await axios.get(getURL4SimilarMovies(apiKey, movieId));
        return response.data;
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}

export {
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