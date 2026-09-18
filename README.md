# vibepan-web

바이브판의 **서비스 프론트**. 공개 저장소이며 독립적으로 검사하고 빌드한다. 기존 `myungkeun02/vibecoding-kr` 저장소와 운영 배포는 그대로 보존한다. 이 분리본을 운영 주소에 연결하기 전까지 실제 서비스는 기존 배포에서 실행된다.

## 경계

| 저장소 | 책임 | 공개 범위 | 개발 포트 |
| --- | --- | --- | --- |
| `vibepan-web` | 서비스 프론트 | 공개 | 4310 |
| `vibepan-api` | 서비스 백엔드 | 공개 | 4311 |
| `vibepan-admin-web` | 관리자 프론트 | 비공개 | 4312 |
| `vibepan-admin-api` | 관리자 백엔드 | 비공개 | 4313 |

서비스 프론트 → 서비스 API, 관리자 프론트 → 관리자 API로 통신한다. 각 프론트는 자기 출처의 `/api` 요청을 지정된 API에 전달하고, 화면은 API에서 받은 데이터로 서버 렌더링한다. 프론트에는 DB 연결, 비밀번호 해시, OAuth 비밀키, 세션 서명 키가 없다. 브라우저의 로그인 쿠키는 기존처럼 HttpOnly로 유지한다.

API에는 서버 간 연결 키 검증과 별도로 사용자/관리자 세션, 권한, Origin, CSRF 검사가 있다. 서버 간 연결 키만으로 관리자 권한을 얻을 수 없다. 프론트가 응답을 만들 때 사용하는 페이지 데이터와 보조 조회는 정해진 기능만 제공하며 SQL을 전송하는 인터페이스는 없다.

## 현재 런타임과 화면

Next.js 16.3.5 App Router + React 19.3.0 + TypeScript를 사용한다. `src/app`이 라우팅과 메타데이터를 담당하고, `src/screens`와 `src/components`는 React Server Components로 HTML을 만든다. 검색은 Next 라우터를 사용하며 브라우저 뒤로 가기와 URL 상태를 복원한다. 폼 제출·첨부·모바일 메뉴의 브라우저 동작은 클라이언트 컴포넌트에서 연결하고 화면이 바뀌면 정리한다.

현재 파비콘에서 추출한 **#FB771A**를 버튼과 강조색으로 사용한다. 밝은 화면을 기본으로 하되 사용자가 선택한 어두운 화면을 유지한다. 얇은 테두리와 작은 곡률을 적용하며 모바일 탐색·필터·상세 탭은 전용 구성을 유지한다.

`src/proxy.ts`는 백엔드 `/api/session`에서 쿠키를 준비하고, 서버 컴포넌트는 `/api/presentation` 및 허용된 조회 API로 데이터를 받는다. 이 내부 API들은 브라우저에서 직접 호출할 수 없다. 요청별 데이터는 React 요청 캐시 또는 AsyncLocalStorage로 격리하며 개인화 응답은 캐시하지 않는다. 로그인·OAuth·CSRF 검증의 주체는 Nest 백엔드다.

## 로컬 실행

Node 22.12 이상, pnpm 10.30.1을 사용한다. `.env.example`을 `.env`로 복사하여 실제 값을 로컬에서 설정한다.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm start
```

`API_ORIGIN`은 연결할 백엔드 주소이며, `FRONTEND_ORIGIN`은 이 화면의 외부 주소다. `API_PROXY_SECRET`은 대응하는 API와 동일하게 설정한다. 이 값은 서버에서만 사용하며 `NEXT_PUBLIC_` 등의 공개 환경변수나 브라우저 번들에 넣지 않는다. `SITE_URL`은 일반 서비스의 외부 주소다. 관리자 화면은 `FRONTEND_ORIGIN`과 `ADMIN_SITE_URL`을 관리자 외부 주소로 설정한다.

`pnpm dev`는 Next 개발 서버를, `pnpm start`는 빌드된 서버를 시작한다. Node 실행에서는 `server.mjs`가 실제 소켓 주소로 내부 IP 헤더를 덮어쓴다. `TRUST_PROXY=1`은 앞단 프록시만 원본 서버에 접근하며 그 프록시가 전달 IP를 덮어쓰는 구성에서만 사용한다. 기본값은 전달 헤더를 신뢰하지 않는다.

Vercel의 기본 Next 배포에서는 커스텀 Node 진입점 대신 플랫폼의 `x-vercel-forwarded-for`를 사용한다. 로컬 통합 검사는 Node 진입점을 대상으로 하므로 Vercel 운영 연결 전에는 실제 도메인의 쿠키·OAuth 왕복·업로드·IP 제한을 확인한다. 프론트 서버에서 지정한 Nest API로 접근할 수 있어야 한다. Next의 페이지 이동 응답은 307이며 API/OAuth의 기존 응답 계약은 유지한다.

## GitHub Actions와 배포

각 저장소의 push/PR에서 의존성 잠금 파일대로 설치한 뒤 형식 검사, 단위 테스트, 빌드를 실행한다. CI에는 운영 키를 전달하지 않는다. 관리자 API 저장소에는 네 프로세스가 함께 동작하는 통합 검사를 둔다.

각 저장소에 Dockerfile이 있으므로 향후 별도 배포 대상을 연결할 수 있다. 현재 운영 서버·DNS·Google 콜백·운영 DB는 자동으로 변경하지 않는다. 저장소 분리 자체가 네 대의 서버 구매나 운영 이전을 의미하지 않는다.

DB는 초기에는 하나를 공유하고, 두 API의 DB 계정·권한은 실제 분리 배포 시 용도별로 제한한다. 업로드는 개발 통합 검사에서 전용 폴더를 공유한다. 서로 다른 운영 서버에서는 같은 객체 저장소를 설정해야 하며 로컬 볼륨이 다른 서버에 자동 공유된다고 가정하지 않는다. Tailscale 적용 시 관리자 프론트와 API의 네트워크 접근을 함께 제한한다.

## API 호환성

프론트의 `src/contracts`는 대응하는 백엔드 페이지 조회 응답의 타입 사본이다. 백엔드의 `src/views`는 화면에 필요한 데이터를 조회하며, SQL과 접근 권한 검사는 백엔드에서 수행한다. 타입 사본만으로 런타임 호환성을 보장하지 않으므로 변경 시 통합 검사를 함께 통과시킨다. 공통 데이터 타입과 순수 표시 함수는 초기 분리 시점의 사본으로 보관하며, 변경 시 대응 저장소를 함께 갱신한다. API 세부 버전과 배포 조합은 관리자 API의 통합 검사 설정에서 관리한다.

기존 공개 저장소를 보존하므로 이미 공개된 과거 관리자 코드나 커밋 작성자 이메일은 과거 이력에 남는다. 새 비공개 저장소는 과거 공개본을 소급하여 비공개로 만들지 않는다.

## Vercel 배포 설정

`vercel.json`은 Next.js 기본 배포, Node 22, pnpm 잠금 파일과 Singapore(`sin1`) 실행 위치를 사용한다. `.vercelignore`는 로컬 키와 검증 자료를 배포에서 제외한다. Vercel 배포는 `server.mjs`를 사용하지 않는다.

Vercel 서버 환경변수에 `APP_ENV=production`, `SITE_URL`, `ADMIN_SITE_URL`, 이 프론트의 `FRONTEND_ORIGIN`, Railway의 `API_ORIGIN`, 해당 API의 `API_PROXY_SECRET`을 설정한다. 이 값에 `NEXT_PUBLIC_` 접두어를 붙이지 않는다. DB·OAuth·세션 키는 Railway에만 둔다. Preview 환경의 도메인은 운영 Origin과 다르므로 실제 로그인·쓰기 검증은 운영 도메인 전환 뒤 수행한다.

첨부 요청은 Vercel의 외부 rewrite로 API에 전송하며 BFF에서 파일 본문을 읽지 않는다. API의 인증·CSRF·5MB 이미지 검사는 그대로 적용된다. 실제 Vercel 환경에서 최대 크기 업로드를 확인한 후 운영 도메인을 전환한다.

첨부 경로는 `vercel.json`의 CDN 라우팅에서 Railway로 바로 전달한다. Next Proxy에서 외부 rewrite를 반환하는 방식도 Vercel 함수의 본문 제한을 받으므로 5MB 첨부에는 사용하지 않는다. API 주소와 전송 키는 라우팅의 환경변수 allowlist를 통해 서버에서만 적용되며 저장소에는 값이 없다. 이 경로의 IP 헤더는 사용자 입력을 덮어쓰고, 업로드 제한은 API에서 사용자별로 적용한다.
