import { StyleSheet, Text, View } from "react-native";
import type { Match, MatchStatus } from "../types";

type Props = {
  match: Match;
};

const STATUS_LABEL: Record<MatchStatus, string> = {
  finished: "Завершён",
  live: "Идёт",
  scheduled: "Запланирован",
  postponed: "Перенесён",
};

function formatStart(startsAt: string | null): string {
  if (!startsAt) return "Дата не назначена";
  return new Date(startsAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatScore(match: Match): string {
  if (!match.score) return "—";
  return `${match.score.home} : ${match.score.away}`;
}

function formatStatus(match: Match): string {
  if (match.status === "live" && match.minute !== undefined) {
    return `Идёт · ${match.minute}′`;
  }
  return STATUS_LABEL[match.status];
}

export function MatchCard({ match }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.teams}>
          {match.home.name} — {match.away.name}
        </Text>
      </View>

      <Text style={styles.score}>{formatScore(match)}</Text>
      <Text style={styles.meta}>{formatStart(match.startsAt)}</Text>
      <Text style={[styles.status, match.status === "live" && styles.live]}>
        {formatStatus(match)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 4,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  teams: { flex: 1, fontSize: 18, fontWeight: "600" },
  score: { fontSize: 18, fontWeight: "700" },
  meta: { fontSize: 13, color: "#6b7280" },
  status: { fontSize: 13, color: "#374151" },
  live: { color: "#b91c1c", fontWeight: "600" },
});
