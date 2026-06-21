import type { Contest } from "../../lib/types";
import { prettyElig } from "../../lib/eligibility";

/** byline 스타일 메타 — 칩 없이 텍스트로. 상금만 굵게 강조. */
export function MetaRow({ contest }: { contest: Contest }) {
  const elig = prettyElig(contest.eligibility);
  return (
    <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px] text-muted">
      {contest.deadline && (
        <span>
          마감 <span className="text-ink-soft">{contest.deadline}</span>
        </span>
      )}
      {contest.organizer && <span>{contest.organizer}</span>}
      {contest.prize && (
        <span>
          상금 <b className="font-bold text-ink">{contest.prize.replace(/^상금\s*/, "")}</b>
        </span>
      )}
      {elig && <span>{elig}</span>}
      <span className="ml-auto text-caption">{contest.sources.join("·")}</span>
    </div>
  );
}
