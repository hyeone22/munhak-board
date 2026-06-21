import type { Contest } from "../../lib/types";
import { DdayBadge } from "../atoms/DdayBadge";
import { PrizeBadge } from "../atoms/PrizeBadge";
import { Tag } from "../atoms/Tag";
import { MetaRow } from "../molecules/MetaRow";

export function ContestCard({ contest }: { contest: Contest }) {
  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-card border border-rule bg-surface px-4 py-3.5 shadow-card transition-colors hover:border-rule-strong"
    >
      <div className="flex items-start justify-between gap-2.5">
        <h3 className="text-[18px] font-bold leading-snug tracking-tight text-ink">
          {contest.title}
        </h3>
        <DdayBadge deadline={contest.deadline} />
      </div>

      {contest.summary && (
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted">
          {contest.summary}
        </p>
      )}

      {contest.prize && (
        <div className="mt-2.5">
          <PrizeBadge prize={contest.prize} />
        </div>
      )}

      <MetaRow contest={contest} />

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {contest.genres.map((g) => (
          <Tag key={g}>{g}</Tag>
        ))}
        <span className="ml-auto text-[11px] text-caption">
          {contest.sources.join("·")}
        </span>
      </div>
    </a>
  );
}
