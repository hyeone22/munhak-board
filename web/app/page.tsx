"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Contest, ContestPayload } from "../lib/types";
import { daysLeft } from "../lib/dday";
import { parsePrizeWon } from "../lib/prize";
import { Masthead } from "../components/organisms/Masthead";
import {
  FilterBar,
  type SortKey,
  type Toggles,
} from "../components/organisms/FilterBar";
import { ContestCard } from "../components/organisms/ContestCard";

const GENRE_ORDER = ["시", "소설", "수필", "동화/아동", "희곡/극본", "백일장", "기타"];
const FAV_KEY = "munhak:favs";

export default function Page() {
  const [data, setData] = useState<Contest[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [genre, setGenre] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<SortKey>("deadline");
  const [toggles, setToggles] = useState<Toggles>({
    imminent: false,
    prized: false,
    faved: false,
  });
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const hydrated = useRef(false);

  // 데이터 로드
  useEffect(() => {
    fetch(`contests.json?_=${Date.now()}`)
      .then((r) => r.json() as Promise<ContestPayload>)
      .then((d) => {
        setData(d.contests ?? []);
        setGeneratedAt(d.generated_at ?? null);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  // 마운트: URL 쿼리 + localStorage 즐겨찾기에서 상태 복원
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("g")) setGenre(p.get("g")!);
    if (p.get("q")) setKeyword(p.get("q")!);
    if (p.get("sort")) setSort(p.get("sort") as SortKey);
    setToggles({
      imminent: p.get("imm") === "1",
      prized: p.get("prize") === "1",
      faved: p.get("fav") === "1",
    });
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      setFavs(new Set(saved));
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  // 상태 → URL 동기화 (공유 가능)
  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams();
    if (genre !== "전체") p.set("g", genre);
    if (keyword) p.set("q", keyword);
    if (sort !== "deadline") p.set("sort", sort);
    if (toggles.imminent) p.set("imm", "1");
    if (toggles.prized) p.set("prize", "1");
    if (toggles.faved) p.set("fav", "1");
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [genre, keyword, sort, toggles]);

  const toggleFav = useCallback((url: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const onToggle = useCallback((k: keyof Toggles) => {
    setToggles((prev) => ({ ...prev, [k]: !prev[k] }));
  }, []);

  const genreTabs = useMemo(() => {
    const present = new Set(data.flatMap((c) => c.genres));
    return ["전체", ...GENRE_ORDER.filter((g) => present.has(g))];
  }, [data]);

  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const filtered = data.filter((c) => {
      if (genre !== "전체" && !c.genres.includes(genre)) return false;
      if (kw && !(c.title + " " + c.organizer).toLowerCase().includes(kw)) return false;
      if (toggles.imminent) {
        const n = daysLeft(c.deadline);
        if (n === null || n < 0 || n > 14) return false;
      }
      if (toggles.prized && parsePrizeWon(c.prize) <= 0) return false;
      if (toggles.faved && !favs.has(c.url)) return false;
      return true;
    });

    const byDeadline = (a: Contest, b: Contest) => {
      const da = daysLeft(a.deadline);
      const db = daysLeft(b.deadline);
      if (da === null) return db === null ? 0 : 1;
      if (db === null) return -1;
      return da - db;
    };
    if (sort === "prize") {
      filtered.sort((a, b) => parsePrizeWon(b.prize) - parsePrizeWon(a.prize) || byDeadline(a, b));
    } else if (sort === "new") {
      filtered.sort((a, b) => (b.first_seen ?? "").localeCompare(a.first_seen ?? "") || byDeadline(a, b));
    } else {
      filtered.sort(byDeadline);
    }
    return filtered;
  }, [data, genre, keyword, sort, toggles, favs]);

  return (
    <>
      <Masthead count={data.length} generatedAt={generatedAt} />
      <FilterBar
        genres={genreTabs}
        active={genre}
        onGenre={setGenre}
        keyword={keyword}
        onKeyword={setKeyword}
        sort={sort}
        onSort={setSort}
        toggles={toggles}
        onToggle={onToggle}
      />

      <main className="mx-auto w-full max-w-content flex-1 px-4 py-4">
        {status === "loading" && (
          <p className="py-16 text-center text-[14px] text-muted">불러오는 중…</p>
        )}
        {status === "error" && (
          <p className="py-16 text-center text-[14px] text-link">
            데이터를 불러오지 못했어요 (contests.json 확인)
          </p>
        )}
        {status === "ok" && items.length === 0 && (
          <p className="py-16 text-center text-[14px] text-muted">
            조건에 맞는 공모전이 없어요.
          </p>
        )}
        {status === "ok" && items.length > 0 && (
          <div className="border-t border-rule">
            {items.map((c) => (
              <ContestCard
                key={c.url + c.title}
                contest={c}
                isFav={favs.has(c.url)}
                onToggleFav={toggleFav}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-4 bg-ink text-white/70">
        <div className="mx-auto w-full max-w-content px-4 py-8 text-[12px] leading-relaxed">
          <a
            href="contests.ics"
            className="font-bold text-white underline underline-offset-2"
          >
            🗓 마감일 캘린더(.ics) 내려받기
          </a>
          <p className="mt-2">
            데이터는 위비티·엽서시·콘테스트코리아 공개 정보를 주 1회 수집한 것입니다. 수집 과정의
            오류가 있을 수 있으니, 실제 응모 전{" "}
            <b className="font-bold text-white">원본 공고</b>에서 최종 확인하세요.
          </p>
        </div>
      </footer>
    </>
  );
}
