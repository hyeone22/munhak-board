"""마감 임박(7일 이내) 문학 공모전을 Discord 웹훅으로 알림.

주간 수집 후 실행. 환경변수 DISCORD_WEBHOOK_URL 이 없으면 아무것도 안 하고 종료(0).
(웹훅 URL은 Discord 채널 설정 → 연동 → 웹훅에서 발급 후 GitHub Secret 에 등록)
"""
import json
import os
import urllib.request
from datetime import date
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "web" / "public" / "contests.json"
WITHIN_DAYS = 7


def main():
    webhook = os.environ.get("DISCORD_WEBHOOK_URL", "").strip()
    if not webhook:
        print("DISCORD_WEBHOOK_URL 없음 — 알림 생략")
        return

    data = json.loads(DATA.read_text(encoding="utf-8"))
    today = date.today()
    soon = []
    for c in data.get("contests", []):
        d = c.get("deadline")
        if not d:
            continue
        try:
            n = (date.fromisoformat(d) - today).days
        except ValueError:
            continue
        if 0 <= n <= WITHIN_DAYS:
            soon.append((n, c))
    soon.sort(key=lambda x: x[0])

    if not soon:
        print("임박 공고 없음 — 알림 생략")
        return

    lines = [f"📚 **마감 임박 문학 공모전** (D-{WITHIN_DAYS} 이내) — 총 {len(soon)}건"]
    for n, c in soon[:20]:
        prize = f" · {c['prize']}" if c.get("prize") else ""
        label = "오늘마감" if n == 0 else f"D-{n}"
        lines.append(f"• **{label}** {c['title']}{prize}\n{c['url']}")
    content = "\n".join(lines)[:1900]

    body = json.dumps({"content": content}).encode("utf-8")
    req = urllib.request.Request(
        webhook, data=body, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        print(f"알림 전송 완료: HTTP {r.status} ({len(soon)}건)")


if __name__ == "__main__":
    main()
