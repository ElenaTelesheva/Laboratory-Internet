import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { MATCHES_URL } from "../config";
import type { Match, MatchesResponse } from "../types";
import { MatchCard } from "../components/MatchCard";
import { useFavorites } from "../hooks/useFavorites";

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggle } = useFavorites();

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Матчи тура</Text>
        <ActivityIndicator />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Матчи тура</Text>
        <Text style={styles.error}>Ошибка: {error}</Text>
        <Pressable onPress={() => load()} style={styles.retry}>
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Матчи тура</Text>
        <Text>Матчей нет</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>

      <FlatList
        data={matches}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <MatchCard
              match={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggle(item.id)}
            />
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
  error: { color: "#b91c1c" },
  retry: {
    padding: 12,
    backgroundColor: "#ef3124",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
