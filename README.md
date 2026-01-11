# Weather App

현재 위치 및 선택한 장소(행정구역)의 날씨를 조회하고, 즐겨찾기로 저장/관리할 수 있는 SPA입니다.

## Demo
- 🌐 Live: [Weather app 바로가기](https://weather-app-alpha-two-20.vercel.app/)

---
## 1) 프로젝트 실행 방법

### 요구 사항
- Node.js (v20.19.5)

### 설치 & 실행
```bash
npm install
npm run dev
```

### 환경 변수(.env)

이 프로젝트는 Kakao Geocode API를 Vercel 프록시(/api/kakao/geocode) 로 호출합니다.
로컬에서 실행할 때 KAKAO_REST_API_KEY가 없으면 “장소 검색 → 선택한 장소 날씨 조회” 기능이 동작하지 않습니다.

프로젝트 루트에 .env.example 파일이 포함되어 있습니다.
1.	`.env.example` → `.env`로 복사
2.	키를 채워 넣기
  ```bash
  cp .env.example .env
  ```
  .env 예시:
  ```bash
  KAKAO_REST_API_KEY=YOUR_KAKAO_REST_API_KEY
  ```
  > 키가 없으면: 현재 위치 날씨 / 즐겨찾기 UI 등은 동작할 수 있지만, 지오코드(주소→좌표) 기반 기능은 실패합니다.

---
## 2) 구현한 기능

### 홈(Home)

#### 현재 위치 날씨 조회
- 브라우저 Geolocation으로 좌표를 얻고, Open-Meteo로 날씨 요약(현재/최저/최고) 표시
- 위치 권한 거부/타임아웃 등 예외 상황에 대한 안내 메시지 및 재시도 UX 제공

#### 행정구역 검색(Autocomplete)
- 로컬 행정구역 데이터 기반 검색
- 키보드 네비게이션(↑/↓/Enter/Escape) 지원
- 검색 결과 “더 보기”로 점진적 확장

#### 선택한 장소 날씨 조회
- 선택한 행정구역 텍스트 → Geocode(Kakao) → 좌표 획득 → 날씨 요약 표시
- 조회 실패/좌표 없음 케이스에 대한 상태별 메시지 제공

#### 즐겨찾기 추가
- 선택한 장소를 즐겨찾기로 저장(최대 6개)
- 제한 초과 시 안내 메시지 표시

### 즐겨찾기(Favorites)

#### 즐겨찾기 목록/관리
- 즐겨찾기 목록 표시(카드 형태)
- 별칭 수정(인라인 편집) / 삭제

#### 즐겨찾기 상세 페이지
- 요약(현재/최저/최고) 표시
- 시간대별 기온(hourly) 최대 24시간 리스트 표시
- 초기 스냅샷(placeholderData) 단계와 “실제 hourly 로딩/빈 데이터” 상태를 구분하여 안내

---
## 3) 기술적 의사결정 및 이유

### (1) Geocode 프록시를 둔 이유 (Vercel Serverless Function)
- Kakao REST API Key를 **클라이언트에 노출하지 않기 위해** `/api/kakao/geocode` 프록시를 사용했습니다.
- 프론트에서는 `/api/...`만 호출하고, **실제 Kakao API 호출은 서버리스 함수에서 처리**합니다.
- 이 구조로 로컬/배포 환경 모두에서 “키 보안 + 동일한 호출 방식”을 유지할 수 있습니다.


### (2) Weather 캐시 전략: Summary / Detail 분리
- 즐겨찾기 목록(카드)에서 모든 카드가 `hourly`까지 가져오면 **동시 요청 수가 증가**하고 네트워크 비용이 커질 수 있어,<br> 날씨 데이터를 두 단계로 분리했습니다.
- **summary**: 현재/최저/최고 (가벼움, 리스트에 적합)
- **detail**: summary + hourly (상세 페이지에서만 필요)

→ 리스트는 `summary`만 호출, 상세는 `detail` 호출로 **성능/비용을 최적화**했습니다.


### (3) 좌표 기반 캐시 키 & 정규화(precision=3)
- 날씨 조회는 “좌표가 같으면 같은 결과”로 취급할 수 있어 **좌표 기반 캐시 키**를 적용했습니다.
- 하지만 좌표는 소수점 자리 오차로 캐시가 쪼개질 수 있어,
  - `coordsKey(lat.toFixed(3), lon.toFixed(3))` 기준으로 키를 만들고
  - 쿼리 내부에서도 동일 precision으로 `coords`를 정규화해
- **캐시 일관성**을 유지했습니다.


### (4) 상세 진입 UX: `placeholderData`로 스냅샷 먼저 보여주기
- 상세(detail)로 들어갈 때 summary 캐시가 이미 있으면, detail 응답을 기다리는 동안 요약을 먼저 보여줄 수 있어,<br> detail 쿼리에 `placeholderData`를 사용해 아래 흐름을 구성했습니다.
1) summary 캐시 존재  
2) detail 초기 렌더(요약 먼저 표시)  
3) 실제 hourly 로드 완료 시 리스트 표시


### (5) 상세 hourly “빈 데이터 vs 로딩 중” 분기
- `placeholderData`로 `hourly: []`가 들어갈 수 있어 `hourly.length === 0`만으로는
  - “진짜 데이터 없음”
  - “아직 로딩 중(placeholder 단계)”
  를 구분할 수 없습니다.
- 그래서 상세 페이지에서
  - `isLoading / isFetching`을 기준으로 “로딩 중” UI를 우선 처리하고
  - 로딩이 끝났는데도 hourly가 비면 “데이터 없음” UI를 노출하도록
- 상태 UI를 분리했습니다.


### (6) 즐겨찾기 목록 성능: prefetch로 상세 체감 개선
- 즐겨찾기 카드 hover/focus 시 detail 데이터를 **prefetch**해두면,
  상세 페이지 진입 시 hourly가 더 빠르게 표시됩니다.
- 또한, UI 레이어에서 `QueryClient`를 직접 다루지 않도록
  `usePrefetchWeatherDetailByCoords()` 훅으로 감쌌습니다.


### (7) Open-Meteo API를 사용한 이유
- 현재/일최저/일최고 + hourly 등 과제 요구에 필요한 데이터를 비교적 간단한 요청으로 구성할 수 있습니다.
- 외부 API 호출에 실패할 수 있는 케이스를 고려해 로딩/에러/빈 데이터 UI를 분리해 사용자 경험을 보장했습니다.


### (8) Kakao Geocode를 사용한 이유
- 행정구역 “텍스트”를 좌표로 변환해야 날씨 API(Open-Meteo)를 호출할 수 있어 **지오코딩이 필요**했습니다.
- 한국어/행정구역 기준 검색 품질이 안정적인 편이라 선택했습니다.
- 키 노출 방지를 위해 (1)에서 설명한 프록시 구조로 연동했습니다.

---
## 4) 사용한 기술 스택

### Frontend
- **React + TypeScript**
  - 컴포넌트 기반 UI 구성 및 타입 안정성 확보
- **React Router**
  - 홈 / 즐겨찾기 / 즐겨찾기 상세 / 404 라우팅 구성
- **TanStack Query (React Query)**
  - 날씨/지오코드 API 요청 상태 관리(loading/error/success)
  - 캐시 키 설계 및 staleTime/gcTime 기반 캐싱
  - summary/detail 분리 + placeholder/prefetch 적용
- **Zustand (+ persist)**
  - 즐겨찾기 상태 관리 및 localStorage 영속화(SPA 환경)
- **Tailwind CSS**
  - 빠른 UI 스타일링 및 반응형 레이아웃 구성

### API / External Services
- **Open-Meteo API**
  - 날씨 데이터 조회(현재/최저/최고, 시간대별 기온)
- **Kakao Local API**
  - 행정구역 텍스트 → 좌표(geocode) 변환

### Backend (Serverless)
- **Vercel Serverless Function**
  - `/api/kakao/geocode` 프록시 구현
  - Kakao REST API Key를 클라이언트에 노출하지 않도록 처리

### Deployment
- **Vercel**
  - 프론트 배포 및 Serverless Function 운영
  - 환경 변수(`KAKAO_REST_API_KEY`) 설정
