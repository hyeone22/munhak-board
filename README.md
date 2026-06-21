# munhak-board

문학 공모전(시·소설·수필·희곡·백일장 등)을 한곳에 모아 보는 대시보드.

여기저기 흩어진 공모전 공고를 주 1회 자동 수집해 마감 임박순으로 보여준다.
서버·DB 없이 **GitHub Actions(수집) + GitHub Pages(대시보드)** 만으로 무료로 굴러간다.

## 구조

```
munhak-board/
├── scraper/            # 파이썬 수집기
│   ├── scrape.py       # 진입점: 출처별 수집 → 병합 → docs/contests.json
│   ├── genres.py       # 장르 분류 + 중복 제거
│   └── sources/        # 출처별 파서 (위비티, 엽서시)
├── docs/               # GitHub Pages 루트
│   ├── index.html      # 대시보드 (contests.json 읽음)
│   └── contests.json   # 수집 결과 (스크래퍼가 매주 갱신)
└── .github/workflows/  # 주 1회 cron
```

## 출처

- [위비티](https://www.wevity.com/) — 문학/문예 카테고리
- [엽서시문학공모전](https://ilovecontest.com/) — 문학 전문, 정확한 마감일 제공

## 로컬 실행

```bash
cd scraper
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python scrape.py     # docs/contests.json 생성
```

자세한 요구사항은 [docs/PRD.md](docs/PRD.md) 참고.
