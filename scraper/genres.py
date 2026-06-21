"""제목/요약으로 장르 태그를 분류하고, 같은 공모전을 중복 제거한다."""
import re

# 우선순위 순서대로 검사. 한 공모전이 여러 장르를 가질 수 있다.
GENRE_KEYWORDS = {
    "시": ["시 ", "시집", "시조", "동시", "창작시", "정형시", "자유시", "디카시", "엽서시"],
    "소설": ["소설", "장편", "단편", "콩트", "웹소설", "앤솔로지"],
    "수필": ["수필", "에세이", "산문", "수기", "편지", "독후감", "감상문", "서평"],
    "동화/아동": ["동화", "아동문학", "어린이", "청소년문학", "그림책"],
    "희곡/극본": ["희곡", "시나리오", "극본", "대본", "드라마", "스토리텔링"],
    "백일장": ["백일장", "글짓기"],
}


def classify(*texts):
    """주어진 텍스트들에서 장르 태그 리스트를 뽑는다."""
    blob = " ".join(t for t in texts if t)
    tags = []
    for genre, kws in GENRE_KEYWORDS.items():
        if any(kw in blob for kw in kws):
            tags.append(genre)
    if not tags:
        tags.append("기타")
    return tags


def _norm(title):
    """중복 판정용 키: 회차/특수문자/공백 제거 후 비교."""
    t = title or ""
    t = re.sub(r"제?\s*\d+\s*회", "", t)        # 제16회, 16회 → 제거
    t = re.sub(r"20\d{2}\s*년?", "", t)          # 연도 제거
    t = re.sub(r"[^\w가-힣]", "", t)             # 공백/기호 제거
    return t.lower()


def dedupe(items):
    """제목 정규화 키로 중복 병합. 마감일이 명시된 항목을 우선 채택."""
    merged = {}
    for it in items:
        key = _norm(it["title"])
        if key not in merged:
            merged[key] = it
            continue
        existing = merged[key]
        # 출처 합치기
        srcs = set(existing.get("sources", [])) | set(it.get("sources", []))
        # 마감일이 있는 쪽을 base로
        base = existing if existing.get("deadline") else it
        other = it if base is existing else existing
        base = dict(base)
        base["sources"] = sorted(srcs)
        base["genres"] = sorted(set(base.get("genres", [])) | set(other.get("genres", [])))
        if not base.get("deadline") and other.get("deadline"):
            base["deadline"] = other["deadline"]
        if not base.get("summary") and other.get("summary"):
            base["summary"] = other["summary"]
        merged[key] = base
    return list(merged.values())
