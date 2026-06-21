"use client";

/** WIRED 스타일 — 칩/pill 없이 텍스트 링크 필터 + 각진 입력. */
export function FilterBar({
  genres,
  active,
  onGenre,
  keyword,
  onKeyword,
}: {
  genres: string[];
  active: string;
  onGenre: (g: string) => void;
  keyword: string;
  onKeyword: (k: string) => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-rule bg-page/95 backdrop-blur">
      <div className="mx-auto w-full max-w-content px-4 py-3">
        <input
          type="search"
          value={keyword}
          onChange={(e) => onKeyword(e.target.value)}
          placeholder="제목·주최사 검색"
          className="w-full border border-ink bg-surface px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-caption focus:border-ink"
        />
        <div className="mt-3 flex gap-4 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {genres.map((g) => {
            const on = g === active;
            return (
              <button
                key={g}
                onClick={() => onGenre(g)}
                className={`shrink-0 border-b-2 pb-1 text-[14px] whitespace-nowrap transition-colors ${
                  on
                    ? "border-ink font-bold text-ink"
                    : "border-transparent font-medium text-muted hover:text-ink"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
