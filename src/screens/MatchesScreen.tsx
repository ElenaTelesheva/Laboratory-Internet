import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { MATCHES_URL } from "../config";
import type { Match, MatchesResponse } from "../types";
import { MatchCard } from "../components/MatchCard";

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(MATCHES_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MatchesResponse = await res.json();
      setMatches(data.matches);
      console.log(data.matches);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить матчи");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>

      <FlatList
        data={matches}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <MatchCard match={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.listRow}
        ListEmptyComponent={
          <Text style={styles.empty}>Нет матчей по выбранному фильтру</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  list: { gap: 8, paddingBottom: 24 },
  listRow: { gap: 8 },
  listItem: { flex: 1, width: "100%", maxWidth: "50%" },
  empty: { textAlign: "center", color: "#6b7280", paddingVertical: 24 },
});
