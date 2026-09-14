import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';

export default function TrackRow({ track, onPress, active }) {
  const { isFavorite, toggleFavorite, isDownloaded, downloadTrack } = useLibrary();
  const fav = isFavorite(track.id);
  const dl = isDownloaded(track.id);

  return (
    <TouchableOpacity style={[styles.row, active && styles.rowActive]} onPress={onPress}>
      <View style={styles.artFallback}>
        <Ionicons name="musical-notes" size={18} color={colors.primarySoft} />
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={[typography.body, active && { color: colors.primary }]}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={typography.caption}>
          {track.artist} {dl ? '· Downloaded' : ''}
        </Text>
      </View>
      <TouchableOpacity hitSlop={8} onPress={() => downloadTrack(track)} style={styles.iconBtn}>
        <Ionicons
          name={dl ? 'checkmark-circle' : 'download-outline'}
          size={20}
          color={dl ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>
      <TouchableOpacity hitSlop={8} onPress={() => toggleFavorite(track.id)} style={styles.iconBtn}>
        <Ionicons
          name={fav ? 'heart' : 'heart-outline'}
          size={20}
          color={fav ? colors.primary : colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  rowActive: { backgroundColor: colors.surfaceAlt },
  artFallback: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1, marginRight: spacing.sm },
  iconBtn: { paddingHorizontal: 4 },
});
