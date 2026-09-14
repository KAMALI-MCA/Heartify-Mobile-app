import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';

export default function FavoritesScreen() {
  const { tracks, favorites, downloadTrack } = useLibrary();
  const { playTrack, currentTrack } = usePlayer();

  const favTracks = tracks.filter((t) => favorites.includes(t.id));

  const downloadAll = () => favTracks.forEach((t) => downloadTrack(t));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[typography.h1]}>Favorites</Text>
        {favTracks.length > 0 && (
          <TouchableOpacity style={styles.dlAllBtn} onPress={downloadAll}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Download all</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favTracks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={[typography.caption, { padding: spacing.md }]}>
            Tap the heart on any song to save it here.
          </Text>
        }
        renderItem={({ item }) => (
          <TrackRow
            track={item}
            active={currentTrack?.id === item.id}
            onPress={() => playTrack(item, favTracks)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  dlAllBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.pill },
});
