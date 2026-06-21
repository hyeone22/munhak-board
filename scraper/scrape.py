"""문학 공모전 수집기 — 위비티 + 엽서시 → docs/contests.json."""
import json
import sys
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from genres import dedupe
from sources import wevity, ilovecontest, contestkorea

OUT = Path(__file__).resolve().parent.parent / "web" / "public" / "contests.json"
PAGES = 3  # 출처별로 긁어올 페이지 수


def run():
    today = date.today()
    all_items = []
    for name, mod in [("위비티", wevity), ("엽서시", ilovecontest),
                      ("콘테스트코리아", contestkorea)]:
        try:
            got = mod.fetch(today, pages=PAGES)
            print(f"  {name}: {len(got)}건")
            all_items.extend(got)
        except Exception as e:  # 한 출처가 깨져도 나머지는 살린다
            print(f"  {name}: 실패 — {e}", file=sys.stderr)

    merged = dedupe(all_items)
    # 마감 가까운 순(날짜 없는 건 맨 뒤)
    merged.sort(key=lambda x: (x.get("deadline") is None, x.get("deadline") or "9999"))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "count": len(merged),
        "contests": merged,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"총 {len(all_items)}건 수집 → 중복제거 후 {len(merged)}건 → {OUT}")


if __name__ == "__main__":
    run()
