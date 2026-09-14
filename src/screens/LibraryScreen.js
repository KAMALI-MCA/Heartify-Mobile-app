import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';

export default function LibraryScreen({ route }) {
  const { getFilteredTracks, genres, languages, setTag, tags } = useLibrary();
  const { playTrack, currentTrack } = usePlayer();
  const [genre, setGenre] = useState(route?.params?.genre || null);
  const [language, setLanguage] = useState(null);
  const [editing, setEditing] = useState(null); // track being tagged
  const [genreInput, setGenreInput] = useState('');
  const [langInput, setLangInput] = useState('');

  useEffect(() => {
    if (route?.params?.genre) setGenre(route.params.genre);
  }, [route?.params?.genre]);

  const filtered = getFilteredTracks({ genre, language });

  const openEditor = (track) => {
    const t = tags[track.id] || {};
    setGenreInput(t.genre || '');
    setLangInput(t.language || '');
    setEditing(track);
  };

  const saveTag = () => {
    setTag(editing.id, { genre: genreInput.trim() || undefined, language: langInput.trim() || undefined });
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h1, { padding: spacing.md, paddingTop: spacing.xl }]}>Library</Text>

      <View style={styles.filterRow}>
        <FilterPicker label="Genre" value={genre} options={genres} onChange={setGenre} />
        <FilterPicker label="Language" value={language} options={languages} onChange={setLanguage} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={[typography.caption, { padding: spacing.md }]}>
            Nothing matches this filter. Long-press a song anywhere to tag its genre/language.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => openEditor(item)}>
            <TrackRow
              track={item}
              active={currentTrack?.id === item.id}
              onPress={() => playTrack(item, filtered)}
            />
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!editing} transparent animationType="slide" onRequestClose={() => setEditing(null)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={typography.h2}>{editing?.title}</Text>
            <Text style={[typography.caption, { marginTop: spacing.xs, marginBottom: spacing.md }]}>
              Tag this song so it's easy to browse by genre & language
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Genre (e.g. Pop, Kollywood, Lo-fi)"
              placeholderTextColor={colors.textFaint}
              value={genreInput}
              onChangeText={setGenreInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Language (e.g. Tamil, English, Hindi)"
              placeholderTextColor={colors.textFaint}
              value={langInput}
              onChangeText={setLangInput}
            />
            <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(null)}>
                <Text style={{ color: colors.textMuted }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveTag}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterPicker({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginRight: spacing.sm }}>
      <TouchableOpacity style={styles.filterBtn} onPress={() => setOpen((o) => !o)}>
        <Text style={{ color: colors.text }}>{value || label}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { onChange(null); setOpen(false); }}>
            <Text style={{ color: colors.textMuted }}>All</Text>
          </TouchableOpacity>
          {options.map((o) => (
            <TouchableOpacity key={o} style={styles.dropdownItem} onPress={() => { onChange(o); setOpen(false); }}>
              <Text style={{ color: colors.text }}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm, zIndex: 10 },
  filterBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    minWidth: 140,
    zIndex: 20,
  },
  dropdownItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.surface, padding: spacing.lg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  input: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  saveBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.sm },
});
