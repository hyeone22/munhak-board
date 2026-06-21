"use client";

export type SortKey = "deadline" | "prize" | "new";
export interface Toggles {
  imminent: boolean;
  prized: boolean;
  faved: boolean;
}

const SORTS: { key: SortKey; label: string }[] = [
  { key: "deadline", label: "마감 임박순" },
  { key: "prize", label: "상금 많은순" },
  { key: "new", label: "최근 등록순" },
];

const TOGGLES: { key: keyof Toggles; label: string }[] = [
  { key: "imminent", label: "임박만" },
  { key: "prized", label: "상금만" },
  { key: "faved", label: "즐겨찾기만" },
];

export function FilterBar({
  genres,
  active,
  onGenre,
  keyword,
  onKeyword,
  sort,
  onSort,
  toggles,
  onToggle,
}: {
  genres: string[];
  active: string;
  onGenre: (g: string) => void;
  keyword: string;
  onKeyword: (k: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  toggles: Toggles;
  onToggle: (k: keyof Toggles) => void;
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

        {/* 장르 */}
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

        {/* 정렬 + 토글 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="border border-rule bg-surface px-2 py-1 text-ink outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            {TOGGLES.map((t) => {
              const on = toggles[t.key];
              return (
                <button
                  key={t.key}
                  onClick={() => onToggle(t.key)}
                  className={`transition-colors ${
                    on ? "font-bold text-ink underline underline-offset-4" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
