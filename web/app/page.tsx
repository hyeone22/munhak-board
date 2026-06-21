"use client";

import { useEffect, useMemo, useState } from "react";
import type { Contest, ContestPayload } from "../lib/types";
import { daysLeft } from "../lib/dday";
import { Masthead } from "../components/organisms/Masthead";
import { FilterBar } from "../components/organisms/FilterBar";
import { ContestCard } from "../components/organisms/ContestCard";

const GENRE_ORDER = ["시", "소설", "수필", "동화/아동", "희곡/극본", "백일장", "기타"];

export default function Page() {
  const [data, setData] = useState<Contest[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [genre, setGenre] = useState("전체");
  const [keyword, setKeyword] = useState("");

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

  // 존재하는 장르만 탭으로 (정해진 순서대로)
  const genreTabs = useMemo(() => {
    const present = new Set(data.flatMap((c) => c.genres));
    return ["전체", ...GENRE_ORDER.filter((g) => present.has(g))];
  }, [data]);

  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return data
      .filter((c) => genre === "전체" || c.genres.includes(genre))
      .filter((c) =>
        kw ? (c.title + " " + c.organizer).toLowerCase().includes(kw) : true,
      )
      .sort((a, b) => {
        const da = daysLeft(a.deadline);
        const db = daysLeft(b.deadline);
        if (da === null) return db === null ? 0 : 1; // 마감미정은 뒤로
        if (db === null) return -1;
        return da - db;
      });
  }, [data, genre, keyword]);

  return (
    <>
      <Masthead count={data.length} generatedAt={generatedAt} />
      <FilterBar
        genres={genreTabs}
        active={genre}
        onGenre={setGenre}
        keyword={keyword}
        onKeyword={setKeyword}
      />

      <main className="mx-auto w-full max-w-content flex-1 px-4 py-4">
        {status === "loading" && (
          <p className="py-16 text-center text-[14px] text-muted">불러오는 중…</p>
        )}
        {status === "error" && (
          <p className="py-16 text-center text-[14px] text-accent">
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
              <ContestCard key={c.url + c.title} contest={c} />
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
