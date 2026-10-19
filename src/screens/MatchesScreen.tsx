import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ImageBackground,
} from "react-native";
import { MATCHES_URL } from "../config";
import type { Match, MatchesResponse, Filter } from "../types";
import { MatchCard } from "../components/MatchCard";
import { FilterTabs } from "../components/FilterTabs";
import { UpdatedAgo } from "../components/UpdatedAgo";
import { useFavorites } from "../hooks/useFavorites";
import { compareMatches, filterMatches } from "../utils/matches";

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggle } = useFavorites();

  const [filter, setFilter] = useState<Filter>("all");

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(MATCHES_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MatchesResponse = await res.json();
      setMatches(data.matches);
      setLastUpdated(new Date());
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

  const filtered = filterMatches(matches, filter).sort(compareMatches);

  const counts: Record<Filter, number> = {
    all: matches.length,
    live: filterMatches(matches, "live").length,
    upcoming: filterMatches(matches, "upcoming").length,
    finished: filterMatches(matches, "finished").length,
  };

  return (
    <ImageBackground
      source={require("../../assets/football.jpg")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Матчи тура</Text>

          <View style={styles.panel}>
            <FilterTabs value={filter} onChange={setFilter} counts={counts} />
          </View>
          <FlatList
            data={filtered}
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
          <View style={styles.update}>
            {lastUpdated && <UpdatedAgo since={lastUpdated} />}
            <Pressable onPress={load} style={styles.retry}>
              <Text style={styles.retryText}>Обновить</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  overlay: {
    backgroundColor: "#0000007f",
    height: "100%",
  },
  container: {
    width: "100%",
    maxWidth: 800,
    flex: 1,
    padding: 16,
    gap: 24,
    margin: "auto",
  },
  title: { fontSize: 60, fontWeight: "700", color: "white" },
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
  panel: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  update: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
});
