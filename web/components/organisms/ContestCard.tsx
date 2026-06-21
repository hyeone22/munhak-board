import type { Contest } from "../../lib/types";
import { ddayInfo, isNew } from "../../lib/dday";
import { MetaRow } from "../molecules/MetaRow";

/** WIRED story-row — 박스/그림자/뱃지 없이 가는 괘선으로 나뉜 기사 행. */
export function ContestCard({
  contest,
  isFav,
  onToggleFav,
}: {
  contest: Contest;
  isFav: boolean;
  onToggleFav: (url: string) => void;
}) {
  const { state, label } = ddayInfo(contest.deadline);
  const ddayClass =
    state === "soon"
      ? "text-ink font-bold"
      : state === "near"
        ? "text-ink-soft font-semibold"
        : "text-muted font-medium";

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-b border-rule py-5"
    >
      {/* eyebrow — NEW + 장르 */}
      {(contest.genres.length > 0 || isNew(contest.first_seen)) && (
        <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.06em]">
          {isNew(contest.first_seen) && <span className="text-link">NEW</span>}
          <span className="text-muted">{contest.genres.join(" · ")}</span>
        </div>
      )}

      {/* 제목 + D-day */}
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <h3 className="text-[21px] font-bold leading-snug tracking-tight text-ink group-hover:text-link">
          {contest.title}
        </h3>
        <div className="flex shrink-0 items-baseline gap-2.5">
          <button
            type="button"
            aria-label="즐겨찾기"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFav(contest.url);
            }}
            className={`text-[16px] leading-none ${isFav ? "text-ink" : "text-rule hover:text-muted"}`}
          >
            {isFav ? "★" : "☆"}
          </button>
          <span className={`text-[14px] tracking-tight ${ddayClass}`}>{label}</span>
        </div>
      </div>

      {contest.summary && (
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">
          {contest.summary}
        </p>
      )}

      <MetaRow contest={contest} />
    </a>
  );
}
