const ELIG_MAP: Record<string, string> = {
  초: "초등",
  중: "중등",
  고: "고등",
  청: "청소년",
  대: "대학생",
  일: "일반",
  신인: "신인",
  작가: "작가",
};

/** 엽서시 코드 자격("초, 중, 고…")을 읽기 쉽게. '제한없음' 포함 시 '누구나'. */
export function prettyElig(s: string): string {
  if (!s) return "";
  if (s.includes("제한없음")) return "누구나";
  const parts = s
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((x) => ELIG_MAP[x] ?? x);
  return [...new Set(parts)].join("·");
}
