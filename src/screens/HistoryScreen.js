import React, { useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';

function dateLabel(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, today)) return 'Today';
  if (same(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function HistoryScreen() {
  const { history, clearHistory } = useLibrary();

  const sections = useMemo(() => {
    const groups = {};
    history.forEach((entry) => {
      const label = dateLabel(entry.playedAt);
      groups[label] = groups[label] || [];
      groups[label].push(entry);
    });
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [history]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={typography.h1}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={{ color: colors.textMuted }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, idx) => item.id + '_' + item.playedAt + '_' + idx}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={[typography.caption, { padding: spacing.md }]}>
            Songs you play will show up here, grouped by day.
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[typography.h2, { marginTop: spacing.md, marginBottom: spacing.xs }]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={typography.body}>{item.title}</Text>
              <Text style={typography.caption}>{item.artist}</Text>
            </View>
            <Text style={typography.caption}>
              {new Date(item.playedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, paddingTop: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
});
