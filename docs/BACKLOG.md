# tube.atx.kr 개선 리스트

운영하면서 발견한 개선점을 모두 여기에 쌓는다. 새로 발견하면 바로 추가하고, 끝나면 「완료」로 옮긴다.

- 형식: `- [ ] 제목 — 설명 (발견일 · 관련 파일)`
- 우선순위: **결정·확인** (회사가 정하거나 사실 확인할 것) → **높음** (손님·매출·법에 바로 영향) → **보통** (성능·SEO·운영 안정) → **장기** (구조 개선)

## 결정·확인 필요

- [ ] **GA4 측정 ID 발급** — GA4 속성을 만들어 측정 ID(G-…)를 Vercel 환경변수 `NEXT_PUBLIC_GA4_ID`에 넣고 재배포. GA에서 `generate_lead`를 주요 이벤트로 지정, 데이터 보관 기간을 14개월로 설정 (2026-10-27 · `src/components/analytics/Analytics.tsx`)
- [ ] **네이버 애널리틱스 ID 받기** — 파워링크 대행사(무명기획)에서 프리미엄 로그분석 공통 스크립트의 `wa` 값을 받아 `NEXT_PUBLIC_NAVER_WA`에 넣기. 전환(견적 신청) 스크립트 형식도 받아서 `trackLead()`에 추가 (2026-10-27 · `src/components/analytics/track.ts`)
- [ ] **개인정보처리방침 기본값 확인** — 보유 기간 「문의 처리 후 3년」, 책임자 성명(현재 「고객지원」 창구만), `777@atx.kr` 메일함이 외부 서비스면 위탁사 표에 추가 (2026-10-27 · `src/components/legal/privacy-content.ts`)
- [ ] **이용약관 검토** — 회원가입·결제 없는 정보·견적 사이트 기준 초안. 법무 검토가 필요하면 반영 (2026-10-27 · `src/components/legal/terms-content.ts`)
- [ ] **업력·창립 연도 불일치** — 홈은 「업력 20년+, 2007년 창립」, 회사소개는 「업력 30년+」, 연혁은 「2008년 (주)에이티엑스 설립」. 한 가지로 맞추기 (2026-10-27 · `src/components/home/*StatsSection.tsx`, `src/app/*/about/page.tsx`)
- [ ] **인증 표기 사실 확인** — 푸터 「ISO 9001:2015 · ISO 14001 · KS 인증」, 메타 설명 「ISO 9001 인증」. 실제 보유하지 않으면 표시광고법 위험 (2026-10-23 · `src/components/layout/Footer.tsx`, `src/app/layout.tsx`)
- [ ] **뉴스 내용 사실 확인** — INCHEM KOREA 2025·WEFTEC 2025 참가, Grade 9 브레이드 주름관 출시, 반도체 FAB 불산 배관 500m 공급 등이 실제 사실인지. 견본 문구면 삭제·교체 (2026-10-27 · `src/app/(ko)/news/page.tsx` 외 en·ja)
- [ ] **관리자 페이지(/admin) 존폐** — 관리자는 Supabase를 고치는데 공개 사이트는 `products.json`을 읽어서, 관리자 수정이 홈페이지에 반영되지 않음. 주문·결제 테이블도 B2B 견적 사이트와 맞지 않음. 안 쓰면 제거, 쓰면 인증 보강(고정 토큰 쿠키·Secure 없음·로그인 시도 제한 없음) (2026-10-23 · `src/app/admin`, `src/app/api/admin`, `middleware.ts`)
- [ ] **13개 언어 다국어 작업 병합 여부** — `git stash`에 보관 중(「WIP: 13개 언어 i18n…」). 9bcc9de 이전 기준이라 충돌 정리가 필요하고, `locales.ts`의 SITE_URL이 옛 도메인, `LocalizedFooter`에 개인정보처리방침·이용약관 링크가 없음. ko/ru/th 메시지 일부가 영문 그대로 (2026-10-23)

## 높음

- [ ] **영문·일문 제품 상세가 「Coming Soon」** — 7개 제품 × 2개 언어 페이지가 한 줄짜리인데 sitemap·hreflang에 올라가 있음. 번역 페이지를 만들거나, 그 전까지 sitemap·hreflang에서 빼고 noindex (2026-10-27 · `src/app/en|ja/products/[slug]/page.tsx`, `src/app/sitemap.ts`)
- [ ] **견적 문의 백업 저장·실패 알림** — Gmail SMTP 발송이 실패하면 문의가 사라지고 서버 로그에만 남음. DB나 시트에 함께 저장하고 실패 시 알림 (2026-10-23 · `src/app/api/contact/route.ts`)
- [ ] **견적 폼 스팸 방어** — honeypot, 요청 횟수 제한, Turnstile 등이 없음. 스팸이 ATX Work를 거쳐 노션 영업 ToDo까지 들어감 (2026-10-23 · `src/app/api/contact/route.ts`)

## 보통

- [ ] **국문 페이지를 정적 페이지로** — `(ko)/layout.tsx`의 `headers()` 호출 때문에 국문 페이지만 요청마다 새로 렌더링됨(영문·일문은 미리 생성). 관리자 경로 판별용인데 `/admin`은 `(ko)` 밖이라 필요 없음. 함께 `middleware.ts`의 x-pathname 주입도 정리 (2026-10-23)
- [ ] **영문·일문 페이지의 `<html lang="ko">`** — 루트 레이아웃이 lang을 고정함 (2026-10-23 · `src/app/layout.tsx`)
- [ ] **커스텀 404 페이지** — 지금은 Next 기본 영문 404라 메뉴가 없음. `not-found.tsx` 추가 (2026-10-23)
- [ ] **og:url이 모든 하위 페이지에서 홈 주소** — 자체 openGraph가 없는 국문 페이지는 루트 레이아웃의 `url: https://tube.atx.kr`을 물려받음 (2026-10-27 · `src/app/layout.tsx`)
- [ ] **메타 키워드·설명 정리** — 「반도체 배관·화학 배관·내식성 배관」, 「플렉시블 호스」 중심 문구를 「고부식 환경 열교환」 방향으로 (2026-10-23 · `src/app/layout.tsx`, `src/app/en|ja/layout.tsx`)
- [ ] **이미지 용량 정리** — `public` 341MB. 20~30MB 원본(KTL 시험성적서, 폐열회수기 설치 사진)과 코드에서 쓰지 않는 파일 45개(약 83MB) (2026-10-23 · `public/images`)
- [ ] **쉘앤튜브형 대표 사진이 표준품 사진과 같은 파일** — `heat-exchanger-square-2.jpg`와 `ts-dual-outlet-front.jpg`가 완전히 같음 (2026-10-27 · `src/data/products.json`)
- [ ] **보안 헤더** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy 없음. `poweredByHeader: false`로 X-Powered-By 숨기기 (2026-10-23 · `next.config.mjs`)
- [ ] **오류·가동 감시** — Sentry 같은 오류 수집이나 가동 감시가 없어 폼이 고장 나도 알 수 없음 (2026-10-23)
- [ ] **sitemap 날짜** — `lastModified`가 배포할 때마다 그 시각으로 찍혀 변경 신호가 무의미 (2026-10-23 · `src/app/sitemap.ts`)
- [ ] **영문·일문 견적 폼에 첨부 기능 없음** — 국문 폼만 도면·사진 첨부가 있음. 같은 규칙(`@/lib/attachments`)으로 붙이면 됨 (2026-10-27 · `src/app/en|ja/support/ContactForm.tsx`)
- [ ] **4MB 넘는 도면 받기** — 지금은 Vercel 함수 요청 한도(4.5MB) 때문에 첨부 합계 4MB, 넘으면 메일로 안내. 큰 DWG가 자주 오면 Vercel Blob(또는 Supabase Storage)에 브라우저에서 바로 올리고 서버가 받아 메일에 붙인 뒤 지우는 방식으로 확장. Vercel에서 Blob 저장소 생성 필요 (2026-10-27 · `src/lib/attachments.ts`)
- [ ] **Next 16 대비** — 15.5는 보안 패치만 받는 구버전 라인. `next lint`가 15.5에서 사용 중단 예고 → ESLint CLI로 전환. postcss `overrides`는 Next 16에서 정리 (2026-10-27 · `package.json`)

## 장기

- [ ] **언어별 중복 구조 통합** — 국문·영문·일문 페이지와 홈 컴포넌트가 파일 단위로 따로 있어 문구 하나에 여러 곳을 고쳐야 함. 국문 5,554줄 vs 영문·일문 약 1,700줄로 내용 차이도 큼 (2026-10-23)
- [ ] **뉴스·사례 CMS화** — 지금은 코드 안 배열이라 글 하나에 개발·배포가 필요 (2026-10-23)
- [ ] **제품 상세 페이지 분리** — `(ko)/products/[slug]/page.tsx`가 1,600줄 넘음 (2026-10-23)
- [ ] **운영 문서** — README가 기본 템플릿. 환경변수, 견적 메일과 ATX Work 결합, OG 이미지 생성(`node scripts/generate-og.mjs`) 정리 (2026-10-23)
- [ ] **테스트·CI** — 자동 테스트와 CI가 없음. 루트의 `playwright-*-audit.mjs`를 정식 테스트로 (2026-10-23)

## 완료

- [x] 견적 폼 도면·사진 첨부가 실제로 메일에 첨부되도록 수정 — 최대 3개·합계 4MB, 1MB 넘는 사진은 자동 축소, 끌어다 놓기·개별 취소, 서버 재검증, 방침 수집 항목에 첨부 파일 추가 (2026-10-27)
- [x] Next 15.5 · React 19 · nodemailer 10 업그레이드, `npm audit` 0건 (2026-10-27 · 4b1f779)
- [x] 개인정보처리방침(국·영·일) + 견적 폼 필수 동의, 서버 검증 (2026-10-27)
- [x] OG 이미지 — 사이트 공통 3장, 제품별 7장 (2026-10-27)
- [x] GA4·네이버 애널리틱스 ID를 환경변수로, 견적 접수 시 `generate_lead` 이벤트 (2026-10-27)
- [x] 이용약관(국·영·일), 푸터 사업자등록번호 131-86-09143 (2026-10-27)
- [x] 정식 주소 tube.atx.kr, 견적 메일 ATX Work 연결, 메일 HTML 이스케이프 (2026-10-22 · 9bcc9de)
