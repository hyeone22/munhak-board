"""파서 회귀 테스트 — 고정 HTML fixture로 네트워크 없이 검증.

사이트 구조가 바뀌어 파서가 깨지면 여기서 먼저 잡힌다.
fixture 갱신: tests/fixtures/*.html 를 각 출처 리스트 페이지로 다시 저장.
"""
import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sources import wevity, ilovecontest, contestkorea  # noqa: E402

FIX = Path(__file__).parent / "fixtures"
TODAY = datetime.date(2026, 6, 1)  # fixture 마감일들보다 이전 (필터에 안 걸리게)


def _load(name):
    return (FIX / name).read_text(encoding="utf-8")


def _assert_sane(items, min_count):
    assert len(items) >= min_count, f"항목이 너무 적음: {len(items)}"
    for it in items:
        assert it["title"], "제목 비어있음"
        assert it["url"].startswith("http"), f"잘못된 url: {it['url']}"
        assert isinstance(it["genres"], list) and it["genres"], "장르 없음"
        assert it["sources"], "출처 없음"
    assert any(it["deadline"] for it in items), "마감일이 하나도 안 잡힘"


def test_wevity():
    _assert_sane(wevity.parse(_load("wevity.html"), TODAY), min_count=10)


def test_ilovecontest():
    items = ilovecontest.parse(_load("ilovecontest.html"), TODAY, with_prize=False)
    _assert_sane(items, min_count=10)


def test_contestkorea():
    _assert_sane(contestkorea.parse(_load("contestkorea.html"), TODAY), min_count=1)
