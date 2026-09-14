import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, spacing, typography } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';

function fmt(ms) {
  if (!ms) return '0:00';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function NowPlayingScreen({ navigation }) {
  const { currentTrack, isPlaying, togglePlayPause, next, prev, position, duration, seek } = usePlayer();
  const { isFavorite, toggleFavorite, isDownloaded, downloadTrack } = useLibrary();

  if (!currentTrack) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={typography.body}>Nothing playing yet.</Text>
      </View>
    );
  }

  const fav = isFavorite(currentTrack.id);
  const dl = isDownloaded(currentTrack.id);

  return (
    <LinearGradient colors={['#3A0142', colors.background]} style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-down" size={28} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.artWrap}>
        <LinearGradient colors={colors.gradient} style={styles.art}>
          <Ionicons name="heart" size={64} color="rgba(255,255,255,0.85)" />
        </LinearGradient>
      </View>

      <View style={styles.meta}>
        <Text style={typography.h1} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 4 }]}>{currentTrack.artist}</Text>
      </View>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={duration || 1}
        value={position}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.surfaceAlt}
        thumbTintColor={colors.primary}
        onSlidingComplete={seek}
      />
      <View style={styles.timeRow}>
        <Text style={typography.caption}>{fmt(position)}</Text>
        <Text style={typography.caption}>{fmt(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={prev}>
          <Ionicons name="play-skip-back" size={30} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={34} color={colors.background} />
        </TouchableOpacity>
        <TouchableOpacity onPress={next}>
          <Ionicons name="play-skip-forward" size={30} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleFavorite(currentTrack.id)}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.primary : colors.textMuted} />
          <Text style={styles.actionLabel}>{fav ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => downloadTrack(currentTrack)}>
          <Ionicons name={dl ? 'checkmark-circle' : 'download-outline'} size={22} color={dl ? colors.success : colors.textMuted} />
          <Text style={styles.actionLabel}>{dl ? 'Offline' : 'Download'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  closeBtn: { alignSelf: 'flex-start', marginBottom: spacing.md },
  artWrap: { alignItems: 'center', marginVertical: spacing.lg },
  art: { width: 260, height: 260, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  meta: { marginBottom: spacing.md },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -spacing.xs },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: spacing.lg },
  playBtn: { backgroundColor: colors.primary, width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.xl },
  actionBtn: { alignItems: 'center' },
  actionLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});
