import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';

export default function SearchScreen() {
  const { getFilteredTracks } = useLibrary();
  const { playTrack, currentTrack } = usePlayer();
  const [query, setQuery] = useState('');
  const results = query ? getFilteredTracks({ query }) : [];

  return (
    <View style={styles.container}>
      <Text style={[typography.h1, { padding: spacing.md, paddingTop: spacing.xl }]}>Search</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Song title..."
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        ListEmptyComponent={
          query ? (
            <Text style={[typography.caption, { padding: spacing.md }]}>No matches.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TrackRow
            track={item}
            active={currentTrack?.id === item.id}
            onPress={() => playTrack(item, results)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.sm, marginLeft: spacing.sm },
});
