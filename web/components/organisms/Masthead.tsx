/** WIRED masthead band — 검정 잉크 제호 + 굵은 하단 괘선. */
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
    <header className="border-b-2 border-ink bg-surface">
      <div className="mx-auto w-full max-w-content px-4 pt-7 pb-4">
        <div className="text-[12px] font-bold tracking-[0.12em] text-muted">
          문학 공모전 아카이브
        </div>
        <h1 className="mt-1 text-[34px] font-extrabold leading-none tracking-tight text-ink">
          문학 공모전 모아보기
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          현재 <b className="font-bold text-ink">{count}</b>건 · 최근 수집 {when}
        </p>
      </div>
    </header>
  );
}
