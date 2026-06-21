"""위비티 문학/문예 카테고리 스크래퍼."""
import re
from datetime import timedelta

import requests
from bs4 import BeautifulSoup

from genres import classify

BASE = "https://www.wevity.com/"
LIST_URL = "https://www.wevity.com/index.php?c=find&s=1&gub=1&cidx=23&gp=3"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"}
SOURCE = "위비티"


def _parse_day(text, today):
    """'D-40 접수중' 같은 텍스트 → (dday, status, deadline_iso)."""
    status = ""
    for kw in ("접수중", "접수예정", "마감", "오늘마감"):
        if kw in text:
            status = kw
            break
    m = re.search(r"D-?\s*(\d+)", text)
    if m:
        n = int(m.group(1))
        deadline = (today + timedelta(days=n)).isoformat()
        return f"D-{n}", status or "접수중", deadline
    if "오늘마감" in text or re.search(r"D-?\s*DAY", text, re.I):
        return "D-0", status or "오늘마감", today.isoformat()
    return "", status, None


def parse(html, today):
    """리스트 HTML → 항목 리스트. (네트워크 분리 — 테스트 가능)"""
    items = []
    soup = BeautifulSoup(html, "lxml")
    ul = soup.select_one("ul.list")
    if ul:
        for li in ul.find_all("li", recursive=False):
            if "top" in (li.get("class") or []):
                continue
            a = li.select_one(".tit a")
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if href.startswith("?"):
                href = BASE + "index.php" + href
            elif href.startswith("index.php"):
                href = BASE + href
            organ_el = li.select_one(".organ")
            organ = organ_el.get_text(strip=True) if organ_el else ""
            sub_el = li.select_one(".sub-tit")
            field = sub_el.get_text(strip=True) if sub_el else ""
            day_el = li.select_one(".day")
            day_txt = day_el.get_text(" ", strip=True) if day_el else ""
            dday, status, deadline = _parse_day(day_txt, today)
            if status == "마감":
                continue  # 이미 마감된 건 제외
            items.append({
                "title": title,
                "url": href,
                "organizer": organ,
                "genres": classify(title, field),
                "deadline": deadline,
                "dday": dday,
                "status": status,
                "summary": "",
                "prize": "",        # 위비티 상세는 봇 차단 → 원문 링크로 위임
                "eligibility": "",
                "sources": [SOURCE],
            })
    return items


def fetch(today, pages=2):
    items = []
    for pg in range(1, pages + 1):
        url = LIST_URL + (f"&pg={pg}" if pg > 1 else "")
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.encoding = resp.apparent_encoding or "utf-8"
        items.extend(parse(resp.text, today))
    return items
