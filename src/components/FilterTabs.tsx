import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Filter } from "../types";

type Props = {
  value: Filter;
  onChange: (next: Filter) => void;
  counts?: Record<Filter, number>;
};

const OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Предстоящие" },
  { value: "finished", label: "Завершённые" },
];

export function FilterTabs({ value, onChange, counts  }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <View style={styles.content}>
              <Text style={[styles.label, active && styles.labelActive]}>
                {opt.label}
                {counts ? ` (${counts[opt.value]})` : ''}
              </Text>
              {opt.value === "live" && (
                <View style={[styles.dot, active && styles.dotActive]} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: "row",  gap: 6, flexWrap: "wrap" },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#e5e7eb",
  },
  tabActive: { backgroundColor: "#ef3124" },
  content: { flexDirection: "row", alignItems: "center", gap: 4 },
  label: { fontSize: 18, color: "#374151" },
  labelActive: { color: "#fff" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ef3124" },
  dotActive: { backgroundColor: "#fff" },
});
