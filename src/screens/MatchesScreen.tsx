import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MATCHES_URL } from "../config";
import type { Match, MatchesResponse } from "../types";

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
});
