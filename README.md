
# Movie Search Application (Like NETFLIX)

Netflix와 유사한 영화 검색 및 위시리스트 관리 웹 애플리케이션

&nbsp;

## 🚀 기술 스택

- **Frontend**: React.js
- **상태관리**: Redux Toolkit
- **스타일링**: Tailwind CSS
- **API**: TMDB API
- **배포**: GitHub Pages

&nbsp;

## 📌 주요 기능

- 영화 검색
- 인기 영화 목록 조회
- 위시리스트 관리
- 그리드/테이블 뷰 토글
- 반응형 디자인
&nbsp;

## 🎬 페이지 프리뷰

### 메인 페이지

최신 영화와 인기 영화를 확인할 수 있는 메인 페이지입니다.
<img src="/public/images/home.png" alt="메인 페이지">

&nbsp;

### 검색 페이지

원하는 영화를 검색하고 결과를 그리드/테이블 뷰로 확인할 수 있습니다.

<img src="/public/images/search-grid.png" alt="검색 페이지(그리드)">
#### 그리드 뷰

<img src="/public/images/search-table.png" alt="검색 페이지(테이블)">
#### 테이블 뷰

&nbsp;

### 인기 영화 

현재 인기 있는 영화 목록을 확인할 수 있습니다.
<img src="/public/images/popular.png" alt="인기 영화 페이지">

&nbsp;

### 위시리스트 페이지
사용자가 저장한 영화 목록을 관리할 수 있습니다.
<img src="/public/images/wishlist.png" alt="위시리스트 페이지">

&nbsp;

## 🔧 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/NOHHYEONGJUN/movie-web.git

# 디렉토리 이동
cd movie-web

# 의존성 설치
npm install
```

### 실행

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

&nbsp;

## 📁 프로젝트 구조

```
src/
├── api/          # API 관련 로직
├── components/   # 리액트 컴포넌트
├── constants/    # 상수 정의
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
├── store/        # Redux 스토어 및 슬라이스
└── utils/        # 유틸리티 함수
```
&nbsp;

## 📝 개발 가이드

### 코딩 컨벤션

- 함수형 컴포넌트 사용
- 파일명: PascalCase (예: MovieCard.js)
- 상수: UPPER_SNAKE_CASE
- 변수/함수: camelCase

&nbsp;

### Git 컨벤션

#### 브랜치 전략 (GitFlow)

- `main`: 배포 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치

#### 커밋 메시지 컨벤션

```
type: subject

body

footer


Type
  - feat: 새로운 기능 추가
  - fix: 버그 수정
  - docs: 문서 수정
  - style: 코드 포맷팅
  - refactor: 코드 리팩토링
  - test: 테스트 코드
  - chore: 빌드 업무 수정
 ```

&nbsp;

### Pull Request 프로세스

1. feature 브랜치 생성
2. 작업 완료 후 PR 생성
3. 코드 리뷰 진행
4. 승인 후 develop 브랜치로 머지

&nbsp;

## 🔒 보안 설정

- main 브랜치 직접 푸시 제한
- PR 승인 필수
- 빌드/테스트 통과 필수
