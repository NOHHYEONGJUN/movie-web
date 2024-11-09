
# 🎬 Movie Search Application (Like NETFLIX) 🎬

### &nbsp; Netflix와 유사한 영화 검색 및 위시리스트 관리 웹 애플리케이션

&nbsp;

## 🚀 기술 스택

- **Frontend**: React.js
- **상태관리**: Redux Toolkit
- **스타일링**: Tailwind CSS
- **API**: TMDB API
- **배포**: GitHub Pages
- **CI/CD**: GitHub Actions

&nbsp;

&nbsp;

## 📌 주요 기능

- 영화 검색
- 인기 영화 목록 조회
- 위시리스트 관리
- 그리드/테이블 뷰 토글
- 반응형 디자인

&nbsp;

&nbsp;

## 🎬 페이지 프리뷰

### 메인 페이지

최신 영화와 인기 영화를 확인할 수 있는 메인 페이지입니다.

<img src="/public/images/home.png" alt="메인 페이지">

&nbsp;

### 검색 페이지

원하는 영화를 검색하고 결과를 그리드/테이블 뷰로 확인할 수 있습니다.

#### 그리드 뷰
<img src="/public/images/search-grid.png" alt="검색 페이지(그리드)">

#### 테이블 뷰
<img src="/public/images/search-table.png" alt="검색 페이지(테이블)">

&nbsp;

### 인기 영화 

현재 인기 있는 영화 목록을 확인할 수 있습니다.

<img src="/public/images/popular.png" alt="인기 영화 페이지">

&nbsp;

### 위시리스트 페이지

사용자가 저장한 영화 목록을 관리할 수 있습니다.

<img src="/public/images/wishlist.png" alt="위시리스트 페이지">

&nbsp;

### 모바일 최적화

반응형 구현을 통해 모바일 사용자 경험을 개선했습니다.

<table cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: none; margin: 0; padding: 0;">
<tr style="border: none; margin: 0; padding: 0;">
<td width="50%" style="border: none; margin: 0; padding: 0;">
<img src="/public/images/mobile1.png" width="100%" alt="모바일 화면1">
</td>
<td width="50%" style="border: none; margin: 0; padding: 0;">
<img src="/public/images/mobile2.png" width="100%" alt="모바일 화면2">
</td>
</tr>
</table>

&nbsp;

&nbsp;

## 🔧 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상

&nbsp;

### 설치

```bash
# 저장소 클론
git clone https://github.com/NOHHYEONGJUN/movie-web.git

# 디렉토리 이동
cd movie-web

# 의존성 설치
npm install
```

&nbsp;

### 실행

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

&nbsp;

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

&nbsp;

#### 브랜치 운영 규칙

1. 기능 개발은 feature/ 브랜치에서 진행
2. 개발 완료된 기능은 PR을 통해 develop 브랜치로 병합
3. develop 브랜치에서 테스트 및 main 브랜치로 PR
5. 최종 배포는 main 브랜치에서 수행

&nbsp;

#### 커밋 메시지 컨벤션

```
# 커밋 메시지 템플릿
# ▼ <header> 작성

# ▼ <빈 줄>

# ▼ <body> 작성

# ▼ <빈 줄>

# ▼ <footer> 작성

################
# feat : 새로운 기능 추가
# fix : 버그 수정
# docs : 문서 수정
# test : 테스트 코드 추가
# refact : 코드 리팩토링
# style : 코드 의미에 영향을 주지 않는 변경사항
# chore : 빌드 부분 혹은 패키지 매니저 수정사항
################
```

&nbsp;

#### PR 템플릿

```
## 개요
<!---- 변경 사항. -->

<!---- Resolves: #(Isuue Number) -->

## PR Type

- [ ] 새로운 기능 추가
- [ ] 버그 수정
- [ ] UI/UX 수정
- [ ] 간단한 코드 수정 (로직에 영향 X)
- [ ] 코드 리팩토링
- [ ] 주석 추가 및 수정
- [ ] 빌드 부분 혹은 패키지 매니저 수정
- [ ] 파일 혹은 폴더명 수정
- [ ] 파일 혹은 폴더 삭제

## PR Checklist

- [ ] 커밋 메시지 컨벤션에 맞게 작성
- [ ] 변경 사항에 대한 테스트
```

&nbsp;

### Pull Request 프로세스

1. feature 브랜치 생성
2. 작업 완료 후 PR 생성
3. CI 파이프라인 통과 확인
4. 코드 리뷰 진행 (리뷰어 최소 1명 이상 지정)
5. 승인 후 develop 브랜치로 머지

&nbsp;

&nbsp;

## 🔒 보안 설정

- main 브랜치 직접 푸시 제한
- PR 승인 필수
- 빌드/테스트 통과 필수

&nbsp;

&nbsp;

## 🔄 CI/CD

### GitHub Actions Workflow

```
name: Deploy React App to GitHub Pages

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build React app
        env:
          REACT_APP_TMDB_API_KEY: ${{ secrets.REACT_APP_TMDB_API_KEY }}
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```