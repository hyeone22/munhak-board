import { ddayInfo, type DdayState } from "../../lib/dday";

const STYLES: Record<DdayState, string> = {
  soon: "text-soon-fg bg-soon-bg",
  near: "text-near-fg bg-near-bg",
  far: "text-far-fg bg-far-bg",
  none: "text-none-fg bg-none-bg",
};

export function DdayBadge({ deadline }: { deadline: string | null }) {
  const { state, label } = ddayInfo(deadline);
  return (
    <span
      className={`shrink-0 rounded-xs px-2 py-1 text-[11px] font-bold tracking-tight ${STYLES[state]}`}
    >
      {label}
    </span>
  );
}
