# CLAUDE.md — ATX 티타늄 주름관 홈페이지 (tube.atx.kr)

Claude Code 가 이 레포에서 세션을 열 때 읽는 안내. 사람용 설명은 [README.md](README.md), 할 일 목록은 [docs/BACKLOG.md](docs/BACKLOG.md).
사용자와는 한국어로, 쉬운 말로 이야기한다. 회사는 (주)에이티엑스(ATX) — 티타늄 주름관·열교환기·폐열회수기 B2B 제조사.

## 무엇인가
- Next.js 15.5 (App Router) · React 19 · Tailwind 3 · Vercel 배포. 국문(기본)/영문 `/en`/일문 `/ja`.
- 주 기능은 **제품 소개 + 견적 문의**. 국문에서만 **표준품·소켓 온라인 구매**(Supabase + 포트원 V2)가 붙는다 → [docs/SHOP_SETUP.md](docs/SHOP_SETUP.md)
- 견적 메일은 Gmail SMTP 로 atx.lsj@gmail.com 에 가고, ATX Work 처리기가 노션 영업 ToDo 로 옮긴다.

## 코드 구조 핵심
| 위치 | 내용 |
| --- | --- |
| `src/app/(ko)/` | 국문 페이지(경로 그룹 — 주소에 안 나옴). `en/`, `ja/` 는 같은 구조의 영·일 페이지 |
| `src/app/*/[...missing]` + `not-found.tsx` | 없는 주소를 언어별 404 로 |
| `src/components/{home,layout}/` (+ `en/`, `ja/` 하위) | 언어마다 컴포넌트 파일이 따로 있다 — 문구 하나에 3곳을 고쳐야 할 때가 많다 |
| `src/data/products.json` | 제품 원본(국문). 영·일 문구는 `src/data/products-i18n.ts`, 영·일 상세는 `components/product/LocalizedProductDetail.tsx` |
| `src/lib/seo.ts` | `pageMetadata()` — **모든 페이지가 canonical·hreflang·og 를 이것으로 지정** |
| `src/lib/company.ts` | 창립 2008, 업력 자동 계산 |
| `src/lib/spam-guard.ts`, `components/forms/SpamGuard.tsx` | 견적 폼 스팸 검사(숨긴 칸 + 3초) |
| `src/app/api/contact/route.ts` | 견적 메일. 제목·「라벨: 값」 형식은 ATX Work 처리기가 읽는다 |
| `src/lib/shop/*`, `src/lib/portone.ts`, `src/app/api/{cart,orders,payment}` | 온라인 구매 서버 로직(tauti 에서 옮김). 정책 값은 `lib/shop/config.ts` |
| `src/components/shop/*`, `src/app/(ko)/{cart,checkout,orders}` | 구매 상자·장바구니·결제·주문 조회 화면 |
| `src/app/admin`, `src/app/api/admin`, `src/middleware.ts` | 관리자(주문·판매 품목), 서명 세션 |
| `supabase/migrations/002_shop.sql` | 주름관 전용 Supabase 스키마(재실행 안전) |
| `src/components/legal/*-content.ts` | 이용약관·개인정보처리방침 국·영·일 본문(국문이 기준본) |

## 명령
```bash
npm run dev            # http://localhost:3005
npm run typecheck      # tsc --noEmit
npm run lint:clean     # 캐시 없는 lint — 푸시 전엔 꼭 이것 (아래 「실수하기 쉬운 점」)
npm run build
npm run check:site     # 빌드 후 서버를 띄운 상태에서: 전 페이지 응답·콘솔 오류·깨진 이미지·링크·canonical/hreflang·모바일 넘침
npm run test:shop      # 온라인 구매 통합 검사 (Postgres 16 필요) — tests/README.md
```
- `check:site` 기본 주소는 `http://localhost:3000`(`npm start`). 다른 포트면 `CHECK_BASE_URL=…`.
- 루트의 `playwright-*-audit.mjs`, `pw-screenshot.mjs` 는 예전 점검 스크립트(포트 3052·경로 고정). `check:site` 가 대체하므로 지워도 된다(사용자 확인 후).
- 사진을 `public/` 에 넣기 전: `python3 scripts/strip-image-metadata.py <파일>` (GPS 제거, 무손실). OG 이미지: `node scripts/generate-og.mjs`.
- 메일 제목 확인: `tests/fakes/smtp.py` (사용법은 파일 머리말).

## 실수하기 쉬운 점
- **미들웨어는 `src/middleware.ts`** 여야 한다. 루트에 두면 조용히 무시된다(2026-11-05 까지 실제로 그랬음). Node 런타임(세션 서명에 `node:crypto`).
- **lint 캐시가 오류를 가린다.** 로컬 `next lint` 는 통과했는데 Vercel 빌드만 실패한 적 있음 → 푸시 전 `npm run lint:clean`.
- `[...missing]` 경로 때문에 내부 주소로 가는 `<a href="/...">` 는 lint 오류 → `next/link` 의 `Link` 를 쓴다.
- **canonical 을 레이아웃에 두지 않는다.** 하위 페이지가 홈 주소를 물려받는다. 새 페이지는 `pageMetadata({ locale, path, title, description })`.
- 국문 레이아웃에서 `headers()`·`cookies()` 를 부르면 국문 전체가 동적 렌더링으로 바뀐다. 헤더는 `useSearchParams` 를 쓰므로 `<Suspense fallback={<HeaderBase query={null} />}>` 패턴을 유지(빼면 서버 HTML 에서 메뉴가 사라짐).
- **견적 메일 제목 「[ATX 주름관 견적문의]」와 본문 라벨을 바꾸면 ATX Work 처리기**(`atxlsj-png/atx-worklog` 의 `scripts/gmail/gmail-en-inquiry-processor.js`)도 같이 고쳐야 한다. 스팸 의심 제목 「[ATX 주름관 스팸의심]」·주문 메일 「[ATX 주름관 주문]」에는 그 글자를 넣지 않는다(노션에 올라가지 않게).
- 온라인 구매: 금액은 항상 서버가 DB 가격으로 계산. 가격은 부가세 포함. **카드 결제분은 세금계산서를 따로 발행할 수 없다**(매출전표가 증빙) — 세금계산서 칸을 다시 넣지 말 것.
- 배송비·무료 기준은 `lib/shop/config.ts` 값이 약관 문구에도 그대로 들어간다. 약관·방침을 바꾸면 영·일도 고치고 시행일(`*_EFFECTIVE_DATE`, 부칙)을 올린다(불리한 변경 30일, 그 외 7일 공지).
- 깨진 JPEG 는 Next 이미지 최적화가 실패해 원본(수 MB)을 그대로 보낸다 — 새 사진은 `sharp` 로 열리는지 확인.
- **레포는 공개(public)** 다. 키·비밀번호를 커밋하지 말 것(`.env.local` 만, 목록은 `.env.example`).
- 클라우드 세션에서는 tube.atx.kr·vercel.com 접속과 강제 푸시·브랜치 삭제가 막혀 있었다. 로컬에서는 가능하지만 강제 푸시는 사용자 확인 후에만.

## 이 프로젝트에서 정한 것 (2026-11-04~05)
- 창립 연도: 이 레포 master 는 2008((주)에이티엑스 설립)로 통일된 상태(PR #1). **다른 세션의 열린 PR #3 은 사용자가 2026-11-05 에 1991(업력 35년)로 결정했다고 적고 있어 서로 다르다** — 아래 「검토 중」 첫 줄.
- 카탈로그 PDF 버튼 제거(파일 생기면 되살림 — BACKLOG).
- 영·일 제품 목록·상세는 데이터 기반 페이지로(국문의 풍부한 섹션은 아직 미번역).
- 페이지별 canonical·hreflang(x-default 포함), 보안 헤더(CSP 는 보류), 언어별 404, 국문 정적화.
- 견적 폼 스팸 방어: 숨긴 칸은 조용히 버림, 3초 안 제출은 「스팸의심」 제목으로 메일함에만.
- 온라인 구매 = **3번안**: 표준품 3종 + 소켓 4종만, **국문만, 카드만**, 비회원. 주름관 전용 **새 Supabase 프로젝트(서울 리전)**, 메일은 기존 Gmail, tauti 구조 재사용.
- 관리자 = 주문 관리 + 판매 품목만(옛 제품 편집·AI 문구·업로드 화면 제거), 비밀번호 + 12시간 서명 세션.
- PR 병합은 사용자가 정한 대로 **스쿼시**.

## 아직 검토 중 · 사용자 결정 필요
- **창립 연도 2008 vs 1991** — PR #3(다른 세션, `claude/ledger-tube-2a976a`)이 `src/lib/company.ts` 를 1991 로 바꾸고 연혁 「1991 현대티타늄 창립」을 되살림. 근거는 사이트 대장(`bogusjun/ATX_website` → `00_운영관제/사이트-대장.md` 4-1). PR #3 을 병합하면 1991 로 확정된다.
- **인증 표기** — PR #3: KS·ISO 14001 미보유라 삭제, ISO 45001 추가(사이트 대장 기준). 「ASME 대응」 표현은 유지. 발급 기관(KR/TÜV) 확인 필요.
- **PR #3 과 PR #4 는 둘 다 `docs/BACKLOG.md`·`Footer.tsx` 를 고친다** — 나중에 병합하는 쪽은 충돌을 풀어야 한다. PR #3 은 「Create a merge commit」 방식을 요청함(저장소를 비공개로 바꾸고 Vercel Hobby 면 커밋 작성자가 계정 주인이 아닐 때 배포가 막힘).
- **PR #4(온라인 구매) 병합 여부** — 병합해도 「판매 중」을 켜기 전엔 구매 상자가 안 나온다. 하지만 약관·방침 개정(시행 2026-11-12)이 함께 공개된다.
- 배송비 4,000원 · 10만 원 이상 무료는 **임시값**. 교환·반품 조건(7일·가공품 제외·단순 변심 왕복 배송비)도 회사 확인 전.
- 저장소 공개 상태 — git 기록에 GPS 가 남은 원본 사진(비공개 전환 또는 기록 정리).
- 고객지원 「기술 자료 다운로드」 6개(파일 준비 또는 섹션 숨김).
- 사실 확인: 뉴스 내용, 고객지원 FAQ, 홈 수치(납품 500+·재주문율 99% 등), 폐열회수기 특허 「출원/등록」, 표준품 「공차 45mm」.
- 세금계산서가 필요한 B2B 손님용 계좌이체·가상계좌(별도 흐름 필요), 카드 매출전표 링크.
- `git stash` 에 있다는 13개 언어 작업(개발 PC 에만 있음).
- 그 밖의 개선 후보는 docs/BACKLOG.md.

## 회사·사용자에게 받아야 할 것
- 대표자 이름, 통신판매업 신고번호 → `src/lib/shop/config.ts` `SELLER`
- 배송비·무료 기준, 교환·반품 조건 확정
- 포트원 가입(상점 ID·채널 키·API Secret·웹훅 시크릿), PG 계약 후 PG 사명(개인정보처리방침 위탁 표)
- 새 Supabase 프로젝트 URL·service_role 키, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`(16자+) → Vercel 환경변수
- GA4 측정 ID, 네이버 애널리틱스 `wa`
- 카탈로그·기술 자료 PDF, 인증서 사본, 최신 뉴스

## 관련 레포
- `bogusjun/tauti` — 같은 회사 티타늄 반지몰(Next 16). 온라인 구매·관리자·통합 검사의 원본 구조.
- `atxlsj-png/atx-worklog` — ATX Work. 견적 메일을 노션 영업 ToDo 로 옮기는 처리기.
- `bogusjun/ATX_website` — 회사 사이트들의 운영 대장(`00_운영관제/사이트-대장.md`): 회사 공통 사실 확정값(창립·인증 등)의 근거.
