"use client";

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
          className="w-full rounded-card border border-rule bg-surface px-3 py-2.5 text-[14px] text-ink outline-none placeholder:text-caption focus:border-rule-strong"
        />
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {genres.map((g) => {
            const on = g === active;
            return (
              <button
                key={g}
                onClick={() => onGenre(g)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  on
                    ? "border-ink bg-ink text-surface"
                    : "border-rule bg-surface text-muted hover:border-rule-strong"
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
