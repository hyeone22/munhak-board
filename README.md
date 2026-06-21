# munhak-board

문학 공모전(시·소설·수필·희곡·백일장 등)을 한곳에 모아 보는 대시보드.

여기저기 흩어진 공모전 공고를 주 1회 자동 수집해 마감 임박순으로 보여준다.
서버·DB 없이 **GitHub Actions(수집) + Next.js 정적 대시보드(Vercel)** 로 굴러간다.

## 구조

```
munhak-board/
├── scraper/            # 파이썬 수집기
│   ├── scrape.py       # 진입점: 출처별 수집 → 병합 → web/public/contests.json
│   ├── genres.py       # 장르 분류 + 중복 제거
│   └── sources/        # 출처별 파서 (위비티, 엽서시)
├── web/                # Next.js 15 대시보드 (App Router, TS, Tailwind v4)
│   ├── app/            # layout / page
│   ├── components/     # Atomic (atoms·molecules·organisms)
│   ├── lib/            # 타입·D-day·자격 로직
│   ├── public/contests.json   # 수집 결과 (스크래퍼가 매주 갱신, 런타임 fetch)
│   └── DESIGN.md       # 디자인 시스템 (모던 한국 에디토리얼, 2층 토큰)
├── docs/PRD.md         # 요구사항 SSOT
└── .github/workflows/  # 주 1회 cron (금 18:00 KST)
```

## 출처

- [위비티](https://www.wevity.com/) — 문학/문예 카테고리 (목록)
- [엽서시문학공모전](https://ilovecontest.com/) — 문학 전문, 마감일·상금·자격

## 로컬 실행

```bash
# 1) 데이터 수집
cd scraper
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python scrape.py          # web/public/contests.json 생성

# 2) 대시보드
cd ../web
npm install
npm run dev                          # http://localhost:3000
```

## 배포 (Vercel)

`web/` 를 Vercel 프로젝트 루트로 연결하면 push마다 자동 빌드·배포.
주간 수집 워크플로가 `web/public/contests.json` 을 갱신·커밋하면 자동 재배포된다.

자세한 요구사항은 [docs/PRD.md](docs/PRD.md), 디자인은 [web/DESIGN.md](web/DESIGN.md) 참고.
