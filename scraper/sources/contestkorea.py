"""콘테스트코리아 문학•문예 카테고리 스크래퍼."""
import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from genres import classify

BASE = "https://www.contestkorea.com/sub/"
LIST_URL = ("https://www.contestkorea.com/sub/list.php"
            "?int_gbn=1&Txt_bcode=030110001")  # 문학•문예
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"}
SOURCE = "콘테스트코리아"


def _end_date(text):
    """'26.04.08~26.09.20' → 마감(끝) 날짜 ISO. 단일 날짜도 처리."""
    dates = re.findall(r"(\d{2})\.(\d{1,2})\.(\d{1,2})", text or "")
    if not dates:
        return None
    y, m, d = dates[-1]  # 끝 날짜
    try:
        return datetime(2000 + int(y), int(m), int(d)).date().isoformat()
    except ValueError:
        return None


def parse(html, today):
    """리스트 HTML → 항목 리스트. (네트워크 분리 — 테스트 가능)"""
    items = []
    soup = BeautifulSoup(html, "lxml")
    for li in soup.select(".list_style_1 li"):
        a = li.select_one(".txt_area a")
        title_el = li.select_one(".title")
        if not a or not title_el:
            continue
        title = title_el.get_text(strip=True)
        href = a.get("href", "")
        if not href.startswith("http"):
            href = BASE + href.lstrip("/")
        date_el = li.select_one(".date")
        deadline = _end_date(date_el.get_text(strip=True) if date_el else "")
        name_el = li.select_one(".name")
        organ = name_el.get_text(strip=True) if name_el else ""
        dday_el = li.select_one(".d-day")
        dday = dday_el.get_text(strip=True) if dday_el else ""
        if "마감" in dday:
            continue
        if deadline and deadline < today.isoformat():
            continue
        items.append({
            "title": title,
            "url": href,
            "organizer": organ,
            "genres": classify(title),
            "deadline": deadline,
            "dday": dday,
            "status": "접수중",
            "summary": "",
            "prize": "",
            "eligibility": "",
            "sources": [SOURCE],
        })
    return items


def fetch(today, pages=2):
    items = []
    for pg in range(1, pages + 1):
        resp = requests.get(LIST_URL + f"&page={pg}", headers=HEADERS, timeout=20)
        resp.encoding = resp.apparent_encoding or "utf-8"
        items.extend(parse(resp.text, today))
    return items
