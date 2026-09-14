import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, next, position, duration } = usePlayer();
  const navigation = useNavigation();

  if (!currentTrack) return null;

  const progress = duration ? position / duration : 0;

  return (
    <TouchableOpacity
      style={styles.wrap}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('NowPlaying')}
    >
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      <View style={styles.content}>
        <View style={styles.art}>
          <Ionicons name="musical-notes" size={16} color={colors.primarySoft} />
        </View>
        <View style={styles.info}>
          <Text numberOfLines={1} style={typography.body}>{currentTrack.title}</Text>
          <Text numberOfLines={1} style={typography.caption}>{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity hitSlop={10} onPress={togglePlayPause} style={styles.btn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={10} onPress={next} style={styles.btn}>
          <Ionicons name="play-skip-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  art: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  info: { flex: 1, marginRight: spacing.sm },
  btn: { paddingHorizontal: spacing.xs },
});
