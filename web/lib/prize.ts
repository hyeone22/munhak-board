/** 상금 문자열을 만원 단위 숫자로 (정렬용, best-effort). "9,000만원"→9000, "1억"→10000. */
export function parsePrizeWon(prize?: string): number {
  if (!prize) return 0;
  const s = prize.replace(/,/g, "");
  let total = 0;
  const eok = s.match(/(\d+(?:\.\d+)?)\s*억/);
  if (eok) total += parseFloat(eok[1]) * 10000;
  const cheonman = s.match(/(\d+)\s*천\s*만/);
  if (cheonman) total += parseInt(cheonman[1]) * 1000;
  if (!eok && !cheonman) {
    const man = s.match(/(\d+)\s*만/);
    if (man) total += parseInt(man[1]);
  }
  return total;
}
