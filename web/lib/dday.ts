export type DdayState = "soon" | "near" | "far" | "none";

/** 마감일(YYYY-MM-DD)까지 남은 일수. 클라이언트에서 매 렌더 재계산. */
export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

/** 5일/14일 컷으로 상태·라벨 결정 (DESIGN.md). */
export function ddayInfo(deadline: string | null): { state: DdayState; label: string } {
  const n = daysLeft(deadline);
  if (n === null) return { state: "none", label: "마감미정" };
  if (n < 0) return { state: "none", label: "마감" };
  if (n === 0) return { state: "soon", label: "오늘마감" };
  if (n <= 5) return { state: "soon", label: `D-${n}` };
  if (n <= 14) return { state: "near", label: `D-${n}` };
  return { state: "far", label: `D-${n}` };
}
