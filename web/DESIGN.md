# DESIGN.md — 문학 공모전 모아보기 (munhak-board)

> 레퍼런스: **WIRED** ([awesome-design-md/wired](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/wired))
> 순흑백 에디토리얼 — 인쇄 잡지를 웹으로 옮긴 듯한 면. 색 액센트 없음, 각짐, 그림자 없음, 가는 괘선.
> 토큰은 2층(primitive → semantic). UI는 semantic만 참조.

---

## 1. 스택

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind v4 + CSS변수 2층 토큰 |
| Build | 정적 export (`output: 'export'`) |
| Data | 런타임 `fetch('/contests.json')` (주1회 갱신, 재빌드 불필요) |
| Hosting | Vercel |
| Fonts | **Pretendard** 단일 (제목·본문·UI 전부) |

## 2. 디자인 원칙 (WIRED)

1. **순흑백 듀엣** — `#000` 잉크 / `#fff` 캔버스. 유일한 색은 인라인 링크 블루(`#057dbc`). 칩·뱃지·강조색 없음.
2. **활자 위계로 승부** — 제목은 크고 굵게, 메타는 작고 차분하게. 크기·굵기·자간 대비로 잡지 헤드라인 같은 위계.
3. **각짐(0px)** — 모서리 둥글림 없음. 버튼·입력·행 전부 직각.
4. **괘선이 유일한 구획** — 박스 카드/그림자 없이, 행 사이를 1px 괘선으로만 나눈다(기사 그리드).
5. **칩 대신 텍스트** — 장르는 제목 위 eyebrow 라벨, 메타는 byline 텍스트. 알약·배경칩 일절 없음.

## 3. 컬러 토큰

### Primitive
```
--black:         #000000
--white:         #ffffff
--ink-soft:      #1a1a1a
--gray-body:     #757575   /* 보조 텍스트 */
--gray-hairline: #e0e0e0   /* 괘선 */
--gray-canvas:   #f5f5f5   /* 드문 틴트 */
--blue-link:     #057dbc   /* 유일한 색 — 링크 */
```

### Semantic (UI는 이것만)
```
--color-page / surface : white
--color-sunken         : gray-canvas
--color-rule           : gray-hairline
--color-ink            : black
--color-ink-soft       : ink-soft
--color-muted/caption  : gray-body
--color-link           : blue-link
```

## 4. 타이포그래피

전부 **Pretendard**. 위계는 크기·굵기·자간으로만.

| 토큰 | 크기/굵기/자간 | 용도 |
|---|---|---|
| masthead | 34px / 800 / -0.02em | 제호 |
| eyebrow | 12px / 700 / 0.06~0.12em | 장르 라벨·제호 위 라벨 |
| headline | 21px / 700 / -0.02em | 공모전 제목 |
| body | 15px / 400 | 요약 |
| meta | 13px / 400 | byline 메타 |
| dday | 14px / 500~700 | D-day(텍스트) |

## 5. 형태 · 간격 · 깊이

```
radius: 0 (직각)          ── 둥근 요소 없음
border-hairline: 1px var(--color-rule)
border-masthead: 2px var(--color-ink)   /* 제호 하단 */
shadow: 없음               ── 깊이는 괘선/대비로만
space: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48
maxWidth-content: 1280px
```

## 6. 컴포넌트 인벤토리

데이터 필드(`title, url, organizer, deadline, dday, genres[], prize, eligibility, summary, sources[]`).

- **Masthead** — eyebrow + 제호(800) + 수집 건수/시각. 하단 2px 검정 괘선.
- **FilterBar** — 각진 검색 입력(검정 1px 테두리) + 장르 **밑줄 텍스트 링크**(active=굵은 검정+밑줄). 칩 아님.
- **ContestCard (story-row)** — 박스/그림자 없이 하단 1px 괘선. 구성: 장르 eyebrow → 제목(+우측 D-day 텍스트) → 요약 → MetaRow.
- **MetaRow** — byline 텍스트(마감·주최·상금·자격·출처). 상금만 굵게 강조(칩 없이).
- **DashboardPage** — Masthead → FilterBar → story-row 리스트 → 검정 footer 밴드.

## 7. 상호작용 / 상태

- **정렬:** 마감 임박순(미정 뒤로).
- **필터:** 장르 텍스트링크(전체+존재 장르) · 검색(제목+주최사).
- **D-day:** `deadline`으로 매 렌더 재계산. 색 뱃지 없이 텍스트 — 임박(≤5)만 굵은 검정, 그 외 회색.
- **빈 상태:** "조건에 맞는 공모전이 없어요."
- **footer:** 검정 밴드(흰 텍스트) + 면책 — 응모 전 원본 확인.
- **반응형:** 1280 컨테이너, 모바일에서 메타 줄바꿈.
