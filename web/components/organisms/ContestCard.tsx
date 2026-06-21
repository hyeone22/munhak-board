import type { Contest } from "../../lib/types";
import { ddayInfo } from "../../lib/dday";
import { MetaRow } from "../molecules/MetaRow";

/** WIRED story-row — 박스/그림자/뱃지 없이 가는 괘선으로 나뉜 기사 행. */
export function ContestCard({ contest }: { contest: Contest }) {
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
      {/* eyebrow — 장르 */}
      {contest.genres.length > 0 && (
        <div className="text-[12px] font-bold tracking-[0.06em] text-muted">
          {contest.genres.join(" · ")}
        </div>
      )}

      {/* 제목 + D-day */}
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <h3 className="text-[21px] font-bold leading-snug tracking-tight text-ink group-hover:text-link">
          {contest.title}
        </h3>
        <span className={`shrink-0 text-[14px] tracking-tight ${ddayClass}`}>{label}</span>
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
