"""엽서시문학공모전(ilovecontest.com) 스크래퍼.

목록에서 기본 필드 + 응모자격을, 상세페이지에서 상금을 best-effort로 수집한다.
(상세는 서버렌더라 requests로 접근 가능 — 위비티와 달리 봇 차단 없음.)
"""
import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from genres import classify

LIST_URL = "https://ilovecontest.com/bbs/board.php?bo_table=contest"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"}
SOURCE = "엽서시"

_AMOUNT = r"[0-9][\d,]*\s*(?:억\s*)?(?:천\s*)?만?\s*원"
_session = requests.Session()
_session.headers.update(HEADERS)


def _parse_date(text):
    """'2026.06.30' → ISO 날짜. 실패 시 None."""
    if not text:
        return None
    m = re.search(r"(20\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})", text)
    if not m:
        return None
    try:
        return datetime(int(m[1]), int(m[2]), int(m[3])).date().isoformat()
    except ValueError:
        return None


def _extract_prize(text):
    """상세 본문 텍스트에서 상금을 best-effort로 추출. 못 찾으면 빈 문자열."""
    m = re.search(r"총\s*상금[:\s]*(" + _AMOUNT + ")", text)
    if m:
        return "총상금 " + re.sub(r"\s+", "", m[1])
    m = re.search(r"대상[^\n]{0,10}?(" + _AMOUNT + ")", text)
    if m:
        return "대상 " + re.sub(r"\s+", "", m[1])
    m = re.search(r"상\s*금[:\s]*(" + _AMOUNT + ")", text)
    if m:
        return "상금 " + re.sub(r"\s+", "", m[1])
    return ""


def _fetch_prize(url):
    """상세페이지를 받아 상금을 추출. 실패해도 빈 문자열로 안전 반환."""
    try:
        resp = _session.get(url, timeout=15)
        resp.encoding = resp.apparent_encoding or "utf-8"
        soup = BeautifulSoup(resp.text, "lxml")
        for s in soup(["script", "style"]):
            s.decompose()
        return _extract_prize(soup.get_text("\n", strip=True))
    except Exception:
        return ""


def parse(html, today, with_prize=False):
    """리스트 HTML → 항목 리스트. with_prize=True면 항목별 상세에서 상금 보강(네트워크)."""
    items = []
    soup = BeautifulSoup(html, "lxml")
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
        elig_el = card.select_one(".ex7-data")
        eligibility = elig_el.get_text(strip=True) if elig_el else ""
        dday_el = card.select_one(".pc-dday-text, .mobile-dday-badge")
        dday = dday_el.get_text(strip=True) if dday_el else ""
        date_el = card.select_one(".pc-date-text")
        deadline = _parse_date(date_el.get_text(strip=True) if date_el else "")
        if deadline and deadline < today.isoformat():
            continue  # 마감 지난 건 제외
        items.append({
            "title": title,
            "url": href,
            "organizer": organ,
            "genres": classify(title, summary),
            "deadline": deadline,
            "dday": dday,
            "status": status,
            "summary": summary,
            "prize": _fetch_prize(href) if with_prize else "",
            "eligibility": eligibility,
            "sources": [SOURCE],
        })
    return items


def fetch(today, pages=2, with_prize=True):
    items = []
    for pg in range(1, pages + 1):
        url = LIST_URL + (f"&page={pg}" if pg > 1 else "")
        resp = _session.get(url, timeout=20)
        resp.encoding = resp.apparent_encoding or "utf-8"
        items.extend(parse(resp.text, today, with_prize=with_prize))
    return items
