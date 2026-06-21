export function PrizeBadge({ prize }: { prize: string }) {
  if (!prize) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-xs bg-prize-bg px-2.5 py-1 text-[14px] font-bold text-prize-fg">
      🏆 {prize}
    </span>
  );
}
