export function Masthead({
  count,
  generatedAt,
}: {
  count: number;
  generatedAt: string | null;
}) {
  const when = generatedAt
    ? new Date(generatedAt).toLocaleString("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
  return (
    <header className="border-b-2 border-rule-strong bg-surface">
      <div className="mx-auto w-full max-w-content px-4 pt-6 pb-4">
        <h1 className="text-[30px] font-extrabold tracking-tighter text-ink">
          문학 공모전 모아보기
        </h1>
        <p className="mt-1 text-[13px] font-medium text-muted">
          현재 <b className="font-semibold text-ink">{count}</b>건 · 최근 수집 {when}
        </p>
      </div>
    </header>
  );
}
