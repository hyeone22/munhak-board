export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xs border border-rule bg-tag-bg px-2 py-0.5 text-[11px] font-semibold text-tag-fg">
      {children}
    </span>
  );
}
