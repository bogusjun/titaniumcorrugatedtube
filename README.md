# ATX 티타늄 주름관 홈페이지 (tube.atx.kr)

Next.js 15 · 국문/영문/일문 · Vercel 배포

- 제품 소개·기술·적용 사례·견적 문의 (견적 메일 → ATX Work → 노션 영업 ToDo)
- 국문 홈페이지에서 **표준품·소켓 온라인 구매** (Supabase + 포트원 V2) — 설정: [docs/SHOP_SETUP.md](docs/SHOP_SETUP.md)
- 관리자 `/admin`: 주문 관리(발송·송장·취소/환불) · 판매 품목 가격·재고
- 개선 리스트: [docs/BACKLOG.md](docs/BACKLOG.md)

```bash
npm ci
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3005
```

- 제품 소개 문구·사진: `src/data/products.json` (영·일 번역 `src/data/products-i18n.ts`)
- 공유 미리보기(OG) 이미지 다시 만들기: `node scripts/generate-og.mjs`
- 사진 넣기 전 위치정보(GPS) 지우기: `python3 scripts/strip-image-metadata.py <파일>`
- 배포 전 확인: `npm run typecheck`, `npm run lint:clean`(캐시 없이), `npm run build`
- 사이트 전체 점검(빌드 후 `npm start` 상태에서): `npm run check:site`
- 온라인 구매 통합 검사: `npm run test:shop` — [tests/README.md](tests/README.md)
- Claude Code 용 작업 안내: [CLAUDE.md](CLAUDE.md)
