# 온라인 구매 통합 검사

실제 Supabase·포트원 계정 없이 온라인 구매의 주요 흐름을 로컬에서 끝까지 확인합니다.
(같은 회사 반지몰 tauti 의 검사 도구를 이 사이트의 판매 품목 구조에 맞게 옮긴 것)

- **로컬 Postgres** 에 `supabase/migrations/002_shop.sql` 을 그대로 적용합니다(재실행 안전성 확인을 위해 두 번).
- **가짜 서버**(`tests/fakes/`)가 Supabase REST 와 포트원 결제 API 를 대신합니다.
- 사이트를 **실제로 빌드·실행**하고, Playwright 브라우저로 화면을 직접 조작합니다.

| 파일 | 내용 |
| --- | --- |
| `db.test.mjs` | 재고 함수: 주문 금액·배송비·품절·판매 중지·결제 금액 확인·만료·늦은 결제·취소 복원·공개 키 권한·마지막 1개 동시 주문·남용 제한·결제 안 된 주문 1년 뒤 파기 |
| `shop.test.mjs` | 구매 상자 → 장바구니 → 결제 → 재고 차감·페이지 갱신 → 주문 조회 → 관리자 발송·환불, 결제창 닫기·금액 조작·모바일 리디렉트·웹훅·남용 제한·판매 품목 관리·국문 전용·관리자 권한 |

## 실행

필요한 것: Node 20+, `psql`, 접속 가능한 Postgres 16 (슈퍼유저, 비밀번호 없이).

```bash
# 1) Postgres 띄우기 (예: Docker)
docker run -d --name atx-test-pg -p 54329:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres:16

# 2) 실행 (처음에는 tests/node_modules 를 자동 설치)
bash tests/run.sh
```

- 약 3~5분 걸리며, 마지막에 `✓ 모든 검사 통과` 또는 실패한 검사 이름이 나옵니다.
- 사이트를 검사용 설정으로 빌드하므로 `.next` 폴더를 덮어씁니다.
- 포트 3012·54321·54400 을 씁니다.

| 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `TEST_PG_URL` | `postgres://postgres@127.0.0.1:54329` | Postgres 접속 주소 (DB 이름 없이) |
| `TEST_DB` | `atx_test` | 매번 지우고 새로 만드는 검사용 DB 이름 |
| `TEST_CHROMIUM_PATH` | (없음) | 설치된 Playwright 와 브라우저 버전이 다를 때 Chromium 실행 파일 경로 |
| `TEST_SHOTS` | (없음) | 폴더를 지정하면 주요 화면을 캡처해 저장 |
| `KEEP_LOGS` | (없음) | `1` 이면 서버·빌드 로그 폴더를 지우지 않음 (실패하면 자동 보존) |

Claude Code 클라우드 세션에서는 브라우저가 미리 설치되어 있으니 `TEST_CHROMIUM_PATH=/opt/pw-browsers/chromium bash tests/run.sh` 로 실행합니다.

## 주의

- 가짜 서버는 이 사이트 코드가 쓰는 요청 형태만 흉내 냅니다. 실제 포트원 결제창·카드 승인은 배포 후 **테스트 채널**로 따로 확인해야 합니다.
- 메일은 SMTP 정보 없이 실행되어 「발송 생략」 로그만 남깁니다.
