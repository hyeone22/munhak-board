# DESIGN.md — 문학 공모전 모아보기 (munhak-board)

> 비주얼 무드: **모던 한국 에디토리얼** (WIRED broadsheet 구조 + Pretendard 활자)
> 종이질감 배경 · Pretendard 강한 활자 위계 · 잉크블루 링크 · 날카로운 각 · 괘선 구획
> 토큰은 `token-design.md`의 2층 구조(primitive → semantic)를 따른다. UI는 semantic만 참조한다.

---

## 1. 스택

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS 변수(2층 토큰) |
| Build | 정적 export (`output: 'export'`) |
| Data | 런타임 `fetch('/contests.json')` (주1회 갱신, 재빌드 불필요) |
| Hosting | Vercel |
| Fonts | **Pretendard** 단일 (제목·본문·UI 전부). `next/font` 또는 CDN/로컬 |

## 2. 디자인 원칙 (WIRED 무드의 핵심)

1. **종이 위의 활자** — 배경은 순백이 아니라 살짝 크림빛 종이. 콘텐츠가 인쇄물처럼 얹힌다.
2. **활자 위계로 승부** — serif 없이 Pretendard만으로. 제목은 크고 굵게(700), 메타는 작고 차분하게. 크기·굵기·자간 대비로 신문 헤드라인 같은 위계를 만든다.
3. **거의 각짐** — 모서리 4px로만 살짝. 신문 칼럼에 가깝되 한 톤만 부드럽게.
4. **괘선 우선, 그림자는 한 겹만** — 구획은 얇은 괘선으로, 카드에만 아주 연한 그림자 한 겹 허용.
5. **잉크블루 링크 + 버밀리언 강조** — 상호작용은 잉크블루, 긴급(마감임박)은 편집 레드.
6. **색은 절제** — 종이/잉크 무채색이 기본, 색은 D-day 상태와 링크에만.

---

## 3. 컬러 토큰

### 3-1. Primitive (raw scale — 의미 없음)

```
/* Paper — 크림빛 종이 계열 */
paper-0:   #FFFFFF
paper-50:  #FBFAF6   /* 페이지 배경 */
paper-100: #F3F0E8   /* 보조 표면 */
paper-200: #E7E2D6   /* 괘선/보더 */
paper-300: #D6CFBE   /* 진한 괘선 */

/* Ink — 잉크 블랙 계열 */
ink-900:   #14120E   /* 본문/제목 */
ink-700:   #38342C
ink-500:   #6A645A   /* 보조 텍스트 */
ink-400:   #8C857A   /* 캡션 */
ink-300:   #B4ADA1   /* 비활성 */

/* Blue — 잉크블루(링크) */
blue-600:  #1B3FA0
blue-700:  #142E78

/* Red — 편집 버밀리언(강조/긴급) */
red-600:   #C21F2E
red-100:   #F6E0DD

/* Amber — 임박 임계(7일 이내) */
amber-600: #9A6B12
amber-100: #F3E7CE

/* Green — 여유(차분한 포레스트) */
green-700: #2C5F46
green-100: #E0EBE2
```

### 3-2. Semantic (의미 — UI는 이것만 참조)

```
color-bg-page:        paper-50
color-bg-surface:     paper-0
color-bg-sunken:      paper-100

color-rule:           paper-200      /* 기본 괘선 */
color-rule-strong:    paper-300      /* 강조 괘선/하단 굵은 선 */

color-text-primary:   ink-900
color-text-secondary: ink-500
color-text-caption:   ink-400

color-link:           blue-600
color-link-hover:     blue-700
color-accent:         red-600        /* 브랜드 강조/마감임박 */

/* D-day 상태 — 5일/14일 컷 */
color-dday-soon-fg:   red-600        /* ≤5일 */
color-dday-soon-bg:   red-100
color-dday-near-fg:   amber-600      /* 6~14일 */
color-dday-near-bg:   amber-100
color-dday-far-fg:    green-700      /* 15일+ */
color-dday-far-bg:    green-100
color-dday-none-fg:   ink-400        /* 마감미정 */
color-dday-none-bg:   paper-100

/* 태그(장르/출처) */
color-tag-fg:         ink-700
color-tag-bg:         paper-100
color-tag-rule:       paper-200
```

---

## 4. 타이포그래피

전부 **Pretendard**. 위계는 크기·굵기·자간으로만.

| 토큰 | 크기/굵기/자간 | 용도 |
|---|---|---|
| `type-masthead` | 30px / 800 / -0.03em | 페이지 타이틀(제호) |
| `type-headline` | 18px / 700 / -0.02em | 공모전 제목 |
| `type-body` | 14px / 400 | 요약/본문 |
| `type-meta` | 13px / 500 | 마감·주최·상금 메타 |
| `type-label` | 11px / 600 / 0.02em | 태그·D-day·라벨 |
| `type-caption` | 12px / 400 | 푸터·주석 |

- serif가 없는 대신 **제목(700~800)과 메타(400~500)의 굵기 대비**를 크게 줘서 위계를 만든다.
- 제목 줄간 1.3, 본문 1.55.

## 5. 형태(Shape) · 간격 · 괘선

```
radius-card:  4px        /* 카드·입력 — 살짝만 둥글게 */
radius-xs:    2px        /* 태그·뱃지 */
radius-pill:  999px      /* 필터 탭(유일하게 완전 둥근 요소) */

border-hairline: 1px solid color-rule
border-strong:   2px solid color-rule-strong
shadow-card:     0 1px 2px rgba(20,18,14,.05)   /* 아주 연한 한 겹 */

space: 4 / 8 / 12 / 16 / 24 / 32 / 48 (px 스케일)
maxWidth-content: 1120px
```

- 깊이는 **괘선이 우선**, 카드에만 `shadow-card` 한 겹.
- 카드는 4px 각, 괘선 테두리 + 옅은 그림자. 사이 간격 8px.

---

## 6. 컴포넌트 인벤토리 (Atomic)

데이터 필드(`title, url, organizer, deadline, dday, genres[], prize, eligibility, summary, sources[]`) 기준.

### Atoms
- **DdayBadge** — D-day 상태별 색(soon/near/far/none). 라벨 타입. *마감일로 클라이언트 재계산.*
- **Tag** — 장르/출처 칩. `radius-xs`, 괘선 테두리.
- **MetaItem** — 아이콘 + 라벨(마감/주최/상금/자격) 한 조각.
- **SearchField** — 검색 입력(괘선 하단 강조, 각짐).
- **FilterPill** — 장르 탭. `radius-pill`, 활성 시 잉크 반전.
- **InkLink** — 잉크블루 링크.

### Molecules
- **CardHeadline** — 공모전 제목(Pretendard 700) + DdayBadge(우상단).
- **MetaRow** — MetaItem들의 가로 나열(마감·주최·상금·자격).
- **TagRow** — 장르 Tag들 + 출처(우측 정렬).

### Organisms
- **ContestCard** — CardHeadline + summary + MetaRow + TagRow. 클릭 시 원문 새창. 종이 카드(각짐, 괘선).
- **FilterBar** — SearchField + FilterPill 그룹(가로 스크롤).
- **Masthead** — 제호(masthead) + 수집 건수/시각(발행정보처럼).

### Template / Page
- **DashboardPage** — Masthead → FilterBar → ContestCard 리스트. 마감 임박순 정렬, 장르/검색 필터(클라이언트).

---

## 7. 상호작용 / 상태

- **정렬:** 마감 임박순 기본(마감미정은 맨 뒤).
- **필터:** 장르 탭(전체+존재하는 장르만) · 검색(제목+주최사).
- **D-day:** `deadline`으로 매 렌더 재계산 → 주1회 수집이어도 숫자 정확.
- **빈 상태:** "조건에 맞는 공모전이 없어요." (차분하게, 가운데)
- **로딩/에러:** fetch 실패 시 Masthead에 "데이터를 불러오지 못했어요" 표기.
- **반응형:** 920px 컨테이너, 모바일에서 MetaRow 줄바꿈, 폰트 약간 축소.

## 8. 면책 (푸터)

> 위비티·엽서시 공개 정보를 주 1회 수집. 오류가 있을 수 있으니 응모 전 **원본 공고**에서 최종 확인.
