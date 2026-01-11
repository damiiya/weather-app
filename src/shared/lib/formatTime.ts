export function formatHourMinute(iso: string) {
  const t = iso.replace(" ", "T");
  const hm = t.slice(-5);
  return hm.length === 5 ? hm : iso;
}
