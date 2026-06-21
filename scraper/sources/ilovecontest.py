"""엽서시문학공모전(ilovecontest.com) 스크래퍼."""
import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from genres import classify

LIST_URL = "https://ilovecontest.com/bbs/board.php?bo_table=contest"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"}
SOURCE = "엽서시"


def _parse_date(text):
    """'2026.06.30' → ISO 날짜. 실패 시 None."""
    if not text:
        return None
    m = re.search(r"(20\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})", text)
    if not m:
        return None
    try:
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        return datetime(y, mo, d).date().isoformat()
    except ValueError:
        return None


def fetch(today, pages=2):
    items = []
    for pg in range(1, pages + 1):
        url = LIST_URL + (f"&page={pg}" if pg > 1 else "")
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.encoding = resp.apparent_encoding or "utf-8"
        soup = BeautifulSoup(resp.text, "lxml")
        for card in soup.select(".daangn-item"):
            subj = card.select_one(".daangn-subject")
            link = card.select_one("a.daangn-subject-link")
            if not subj or not link:
                continue
            title = subj.get_text(strip=True)
            href = link.get("href", "")
            organ_el = card.select_one(".daangn-organizer")
            organ = organ_el.get_text(strip=True) if organ_el else ""
            cate_el = card.select_one(".daangn-cate")
            status = cate_el.get_text(strip=True) if cate_el else ""
            sum_el = card.select_one(".summary-bubble-pc")
            summary = sum_el.get_text(strip=True) if sum_el else ""
            dday_el = card.select_one(".pc-dday-text, .mobile-dday-badge")
            dday = dday_el.get_text(strip=True) if dday_el else ""
            date_el = card.select_one(".pc-date-text")
            deadline = _parse_date(date_el.get_text(strip=True) if date_el else "")
            # 마감 지난 건 제외
            if deadline and deadline < today.isoformat():
                continue
            items.append({
                "title": title,
                "url": href,
                "organizer": organ,
                "genres": classify(title, summary),
                "deadline": deadline,
                "dday": dday,
                "status": status,
                "summary": summary,
                "sources": [SOURCE],
            })
    return items
