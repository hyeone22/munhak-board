"""문학 공모전 수집기 — 위비티·엽서시·콘테스트코리아 → web/public/contests.json."""
import hashlib
import json
import sys
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from genres import dedupe
from sources import wevity, ilovecontest, contestkorea

OUT = Path(__file__).resolve().parent.parent / "web" / "public" / "contests.json"
ICS_OUT = OUT.with_name("contests.ics")
PAGES = 3  # 출처별로 긁어올 페이지 수


def _prev_first_seen():
    """이전 수집 결과에서 url→first_seen 맵 (신규 공고 판별용)."""
    try:
        prev = json.loads(OUT.read_text(encoding="utf-8"))
        return {c["url"]: c["first_seen"]
                for c in prev.get("contests", []) if c.get("first_seen")}
    except Exception:
        return {}


def _ics_escape(s):
    return (s or "").replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", " ")


def write_ics(items):
    """마감일을 종일 일정으로 하는 .ics 생성 (캘린더 구독/가져오기용)."""
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0",
             "PRODID:-//munhak-board//KR", "CALSCALE:GREGORIAN"]
    for it in items:
        d = it.get("deadline")
        if not d:
            continue
        uid = hashlib.md5(it["url"].encode()).hexdigest()[:16]
        lines += [
            "BEGIN:VEVENT",
            f"UID:{uid}@munhak-board",
            f"DTSTART;VALUE=DATE:{d.replace('-', '')}",
            f"SUMMARY:[마감] {_ics_escape(it['title'])}",
            f"URL:{it['url']}",
            "END:VEVENT",
        ]
    lines.append("END:VCALENDAR")
    ICS_OUT.write_text("\r\n".join(lines) + "\r\n", encoding="utf-8")

SOURCES = [
    ("위비티", wevity),
    ("엽서시", ilovecontest),
    ("콘테스트코리아", contestkorea),
]
# 구조 변경 시 조용히 0건이 되면 안 되는 핵심 출처 (이 중 하나라도 0건이면 실패)
RELIABLE = ("위비티", "엽서시")
MIN_TOTAL = 15  # 중복제거 후 이보다 적으면 비정상으로 간주


def run():
    today = date.today()
    all_items = []
    counts = {}
    for name, mod in SOURCES:
        try:
            got = mod.fetch(today, pages=PAGES)
            counts[name] = len(got)
            print(f"  {name}: {len(got)}건")
            all_items.extend(got)
        except Exception as e:  # 한 출처가 깨져도 수집은 계속
            counts[name] = -1
            print(f"  {name}: 실패 — {e}", file=sys.stderr)

    merged = dedupe(all_items)
    # 마감 가까운 순(날짜 없는 건 맨 뒤)
    merged.sort(key=lambda x: (x.get("deadline") is None, x.get("deadline") or "9999"))

    # 신규 공고 표시용 first_seen (이전 수집에서 승계, 처음 보면 오늘)
    prev = _prev_first_seen()
    today_iso = today.isoformat()
    for it in merged:
        it["first_seen"] = prev.get(it["url"], today_iso)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "count": len(merged),
        "contests": merged,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    write_ics(merged)
    new_cnt = sum(1 for it in merged if it["first_seen"] == today_iso)
    print(f"총 {len(all_items)}건 수집 → 중복제거 후 {len(merged)}건 (신규 {new_cnt}) → {OUT}")

    # ── 견고성 점검: 구조 변경/차단으로 조용히 비는 것을 막는다 ──
    problems = []
    for name in RELIABLE:
        if counts.get(name, 0) <= 0:
            problems.append(f"{name} 0건 — 사이트 구조 변경/차단 의심")
    if len(merged) < MIN_TOTAL:
        problems.append(f"총 {len(merged)}건 — {MIN_TOTAL}건 미만(비정상)")
    if problems:
        print("\n⚠️ 견고성 점검 실패 — 데이터를 커밋하지 않음:", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)  # Actions 실패 → 메일 알림, 커밋 단계 건너뜀


if __name__ == "__main__":
    run()
