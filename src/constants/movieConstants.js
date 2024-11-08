export const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const GENRES = {
  28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디',
  80: '범죄', 99: '다큐멘터리', 18: '드라마', 10751: '가족',
  14: '판타지', 36: '역사', 27: '공포', 10402: '음악',
  9648: '미스터리', 10749: '로맨스', 878: 'SF',
  10770: 'TV 영화', 53: '스릴러', 10752: '전쟁', 37: '서부'
};

export const SORT_OPTIONS = {
  'popularity.desc': '인기도 높은순',
  'popularity.asc': '인기도 낮은순',
  'vote_average.desc': '평점 높은순',
  'vote_average.asc': '평점 낮은순',
  'release_date.desc': '최신순',
  'release_date.asc': '오래된순',
};

// 영화 섹션 정의
export const MOVIE_SECTIONS = [
    // {
    //   id: 'recommendedMovies',
    //   title: '내가 추천하는 영화',
    //   icon: 'Heart'
    // },
    {
      id: 'trendingMovies',
      title: '이번 주 트렌딩',
      showTrendingRank: true,
      customBadge: 'HOT',
      icon: 'TrendingUp'
    },
    {
      id: 'popularMovies',
      title: '인기 영화',
      showRank: true,
      icon: 'Star'
    },
    {
      id: 'topRatedMovies',
      title: '최고 평점 영화',
      icon: 'Star'
    },
    {
      id: 'highBudgetMovies',
      title: '블록버스터',
      customBadge: 'BIG',
      icon: 'Zap'
    },
    {
      id: 'latestMovies',
      title: '현재 상영작',
      showNew: true,
      icon: 'Film'
    },
    {
      id: 'upcomingMovies',
      title: '개봉 예정작',
      icon: 'Calendar'
    },
    {
      id: 'actionMovies',
      title: '액션 & 어드벤처',
      icon: 'Zap'
    },
    {
      id: 'comedyMovies',
      title: '코미디'
    },
    {
      id: 'horrorMovies',
      title: '공포'
    },
    {
      id: 'animationMovies',
      title: '애니메이션'
    },
    {
      id: 'romanceMovies',
      title: '로맨스'
    },
    {
      id: 'documentaryMovies',
      title: '다큐멘터리'
    },
    {
      id: 'kidsMovies',
      title: '키즈'
    }
  ];
  
  // API 응답 데이터 매핑 설정
  export const MOVIE_DATA_MAPPING = {
    popularMovies: (movie, index) => ({ ...movie, rank: index + 1 }),
    latestMovies: (movie) => ({ ...movie, isNew: true }),
    trendingMovies: (movie, index) => ({ ...movie, trendingRank: index + 1 })
  };
  
  // 공통 스타일 정의
  export const STYLES = {
    rankBadge: {
      wrapper: "absolute top-2 left-2 flex items-center gap-2",
      regular: "w-8 h-8 bg-black/60 rounded-md flex items-center justify-center",
      trending: "w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center",
      text: "text-2xl font-bold text-white"
    },
    newBadge: "bg-red-600 text-white px-2 py-1 text-sm rounded",
    customBadge: "text-sm px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full",
    loadingSpinner: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white",
    errorMessage: "bg-red-900/50 p-4 rounded-lg"
  };
  
  // 로딩/에러 상태 메시지
  export const STATUS_MESSAGES = {
    apiKeyError: 'API 키가 설정되지 않았습니다.',
    loadingFailed: '영화 데이터를 불러오는데 실패했습니다.'
  };
  



