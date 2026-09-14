import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';

export default function HomeScreen({ navigation }) {
  const { tracks, loading, permissionStatus, rescan, genres } = useLibrary();
  const { playTrack, currentTrack } = usePlayer();

  const heading = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={typography.h2}>Heartify needs access to your music</Text>
        <Text style={[typography.caption, { marginTop: spacing.sm, textAlign: 'center' }]}>
          Enable audio/storage permission in system settings so Heartify can find every song on
          your device — free and offline.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={rescan}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={colors.gradient} style={styles.header}>
        <Text style={typography.h1}>{heading}</Text>
        <Text style={[typography.body, { color: colors.accent, marginTop: 2 }]}>
          {tracks.length} songs · always free · always offline
        </Text>
      </LinearGradient>

      {genres.length > 0 && (
        <FlatList
          horizontal
          data={genres}
          keyExtractor={(g) => g}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => navigation.navigate('LibraryTab', { screen: 'Library', params: { genre: item } })}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
          ListHeaderComponent={<Text style={[typography.h2, { marginBottom: spacing.sm }]}>All songs</Text>}
          ListEmptyComponent={
            <Text style={[typography.caption, { padding: spacing.md }]}>
              No audio found on this device yet.
            </Text>
          }
          renderItem={({ item }) => (
            <TrackRow
              track={item}
              active={currentTrack?.id === item.id}
              onPress={() => playTrack(item, tracks)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingTop: spacing.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  retryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    marginTop: spacing.sm,
  },
});
