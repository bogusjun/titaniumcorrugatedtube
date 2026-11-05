#!/usr/bin/env bash
# 온라인 구매 통합 검사 실행기. 사용법은 tests/README.md
#   로컬 Postgres 에 검사용 DB 를 새로 만들고 → 가짜 Supabase·포트원 서버를 띄우고
#   → 사이트를 검사용 설정으로 빌드·실행한 뒤 → 검사를 차례로 돌린다.
set -euo pipefail

cd "$(dirname "$0")/.."

PG_URL=${TEST_PG_URL:-postgres://postgres@127.0.0.1:54329}
DB_NAME=${TEST_DB:-atx_test}
export TEST_DATABASE_URL="$PG_URL/$DB_NAME"
WORK=$(mktemp -d)
PIDS=()

cleanup() {
  for pid in "${PIDS[@]:-}"; do kill "$pid" 2>/dev/null || true; done
  if [ "${KEEP_LOGS:-}" = "1" ]; then echo "로그: $WORK"; else rm -rf -- "$WORK"; fi
}
trap cleanup EXIT

wait_for() { # url, name
  for _ in $(seq 1 60); do
    if curl -s -o /dev/null "$1"; then return 0; fi
    sleep 1
  done
  echo "✗ $2 이(가) 시작되지 않았습니다 ($1). 로그: $WORK" >&2
  KEEP_LOGS=1
  exit 1
}

[ -d tests/node_modules ] || (cd tests && npm install --no-audit --no-fund)

echo "▶ 검사용 DB 준비: $TEST_DATABASE_URL"
psql "$PG_URL/postgres" -X -q -v ON_ERROR_STOP=1 \
  -c "DROP DATABASE IF EXISTS $DB_NAME" -c "CREATE DATABASE $DB_NAME"
for sql in tests/fixtures/supabase-bootstrap.sql supabase/migrations/002_shop.sql supabase/migrations/002_shop.sql; do
  # 002 는 두 번 실행해 재실행이 안전한지도 확인한다
  psql "$TEST_DATABASE_URL" -X -q -v ON_ERROR_STOP=1 -f "$sql" > /dev/null 2>"$WORK/psql.log" \
    || { cat "$WORK/psql.log"; exit 1; }
done
# 검사 데이터는 빌드 전에 넣는다 — 구매 상자가 있는 제품 페이지가 빌드 때 미리 만들어지기 때문
psql "$TEST_DATABASE_URL" -X -q -v ON_ERROR_STOP=1 -f tests/fixtures/shop-data.sql > /dev/null

echo "▶ 가짜 서버 시작 (Supabase :54321, 포트원 :54400)"
node tests/fakes/supabase.mjs > "$WORK/supabase.log" 2>&1 & PIDS+=($!)
node tests/fakes/portone.mjs > "$WORK/portone.log" 2>&1 & PIDS+=($!)
wait_for "http://127.0.0.1:54321/rest/v1/shop_items?select=id&limit=1" "가짜 Supabase"

# 사이트 설정 (검사 전용 값). NEXT_PUBLIC_* 는 빌드에 들어가므로 빌드 전에 정한다.
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
export SUPABASE_SERVICE_ROLE_KEY=test-service-key
export PORTONE_API_SECRET=test-secret
export PORTONE_API_URL=http://127.0.0.1:54400
export NEXT_PUBLIC_PORTONE_STORE_ID=store-test
export NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-test
export ADMIN_PASSWORD=test-admin-pw
export ADMIN_SESSION_SECRET=0123456789abcdef0123
export NEXT_TELEMETRY_DISABLED=1
unset PORTONE_WEBHOOK_SECRET SMTP_USER SMTP_PASS

echo "▶ 사이트 빌드 (.next 폴더를 덮어씁니다)"
node_modules/.bin/next build > "$WORK/build.log" 2>&1 || { tail -40 "$WORK/build.log"; exit 1; }

echo "▶ 사이트 실행 (:3012)"
node_modules/.bin/next start -p 3012 > "$WORK/next.log" 2>&1 & PIDS+=($!)
wait_for http://localhost:3012/ "사이트(:3012)"

FAILED=()
for t in db shop; do
  echo "▶ 검사: $t"
  node "tests/$t.test.mjs" || FAILED+=("$t")
done

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "✗ 실패한 검사: ${FAILED[*]}"
  KEEP_LOGS=1
  exit 1
fi
echo "✓ 모든 검사 통과"
