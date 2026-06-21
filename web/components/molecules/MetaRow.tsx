import type { Contest } from "../../lib/types";
import { prettyElig } from "../../lib/eligibility";

export function MetaRow({ contest }: { contest: Contest }) {
  const elig = prettyElig(contest.eligibility);
  return (
    <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] font-medium text-muted">
      {contest.deadline && (
        <span>
          마감 <b className="font-semibold text-ink">{contest.deadline}</b>
        </span>
      )}
      {contest.organizer && <span>{contest.organizer}</span>}
      {contest.prize && (
        <span>
          🏆 <b className="font-semibold text-ink">{contest.prize}</b>
        </span>
      )}
      {elig && <span>👤 {elig}</span>}
    </div>
  );
}
