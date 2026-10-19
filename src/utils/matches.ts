import type { Match, Filter } from "../types";

export function compareMatches(a: Match, b: Match): number {
  const rank = (m: Match) => {
    if (m.status === "live") return 0;
    if (m.status === "finished") return 2;
    return 1; // scheduled, postponed
  };

  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;

  // внутри одной группы — по дате (без даты в конец)
  const aTime = a.startsAt
    ? new Date(a.startsAt).getTime()
    : Number.MAX_SAFE_INTEGER;
  const bTime = b.startsAt
    ? new Date(b.startsAt).getTime()
    : Number.MAX_SAFE_INTEGER;
  return aTime - bTime;
}

export function filterMatches(matches: Match[], filter: Filter): Match[] {
  if (filter === "all") return matches;
  if (filter === "live") return matches.filter((m) => m.status === "live");
  if (filter === "upcoming") {
    return matches.filter(
      (m) => m.status === "scheduled" || m.status === "postponed",
    );
  }
  if (filter === "finished")
    return matches.filter((m) => m.status === "finished");
  return matches;
}
