import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LibraryContext = createContext(null);

const KEYS = {
  TAGS: 'heartify:tags',        // { [id]: { genre, language } }
  FAVORITES: 'heartify:favs',   // string[] of ids
  DOWNLOADS: 'heartify:downloads', // { [id]: localUri }
  HISTORY: 'heartify:history',  // { id, title, artist, playedAt }[]
};

const DOWNLOAD_DIR = FileSystem.documentDirectory + 'heartify_offline/';

export function LibraryProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [downloads, setDownloads] = useState({});
  const [history, setHistory] = useState([]);

  // ---- boot: load persisted state ----
  useEffect(() => {
    (async () => {
      const [t, f, d, h] = await Promise.all([
        AsyncStorage.getItem(KEYS.TAGS),
        AsyncStorage.getItem(KEYS.FAVORITES),
        AsyncStorage.getItem(KEYS.DOWNLOADS),
        AsyncStorage.getItem(KEYS.HISTORY),
      ]);
      if (t) setTags(JSON.parse(t));
      if (f) setFavorites(JSON.parse(f));
      if (d) setDownloads(JSON.parse(d));
      if (h) setHistory(JSON.parse(h));
      await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true }).catch(() => {});
    })();
  }, []);

  const persist = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));

  // ---- scan the device for playable audio (this IS the "unlimited free library":
  // every audio file already on the phone, no store, no paywall) ----
  const scanLibrary = useCallback(async () => {
    setLoading(true);
    const perm = await MediaLibrary.requestPermissionsAsync();
    setPermissionStatus(perm.status);
    if (perm.status !== 'granted') {
      setLoading(false);
      return;
    }
    let all = [];
    let page = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 500,
    });
    all = all.concat(page.assets);
    while (page.hasNextPage) {
      page = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 500,
        after: page.endCursor,
      });
      all = all.concat(page.assets);
    }
    const mapped = all.map((a) => ({
      id: a.id,
      title: stripExt(a.filename),
      artist: 'Unknown Artist',
      duration: a.duration,
      uri: a.uri,
      filename: a.filename,
    }));
    setTracks(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    scanLibrary();
  }, [scanLibrary]);

  // ---- tags: genre / language, user-editable since raw device files rarely carry them ----
  const setTag = useCallback((id, patch) => {
    setTags((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      persist(KEYS.TAGS, next);
      return next;
    });
  }, []);

  // ---- favorites ----
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persist(KEYS.FAVORITES, next);
      return next;
    });
  }, []);
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  // ---- downloads: copy the file into the app's private sandbox so it plays back
  // reliably offline even if the original file moves or the SD card is removed ----
  const downloadTrack = useCallback(async (track) => {
    if (downloads[track.id]) return downloads[track.id];
    const dest = DOWNLOAD_DIR + track.id + '_' + safeName(track.filename);
    await FileSystem.copyAsync({ from: track.uri, to: dest });
    setDownloads((prev) => {
      const next = { ...prev, [track.id]: dest };
      persist(KEYS.DOWNLOADS, next);
      return next;
    });
    return dest;
  }, [downloads]);

  const removeDownload = useCallback(async (id) => {
    const uri = downloads[id];
    if (uri) await FileSystem.deleteAsync(uri, { idempotent: true });
    setDownloads((prev) => {
      const next = { ...prev };
      delete next[id];
      persist(KEYS.DOWNLOADS, next);
      return next;
    });
  }, [downloads]);

  const isDownloaded = useCallback((id) => Boolean(downloads[id]), [downloads]);

  // ---- history: one entry per play, newest first, capped so storage doesn't grow forever ----
  const addHistory = useCallback((track) => {
    setHistory((prev) => {
      const entry = { id: track.id, title: track.title, artist: track.artist, playedAt: Date.now() };
      const next = [entry, ...prev].slice(0, 1000);
      persist(KEYS.HISTORY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist(KEYS.HISTORY, []);
  }, []);

  // ---- derived helpers ----
  const genres = Array.from(new Set(Object.values(tags).map((t) => t.genre).filter(Boolean)));
  const languages = Array.from(new Set(Object.values(tags).map((t) => t.language).filter(Boolean)));

  const getFilteredTracks = ({ query = '', genre = null, language = null } = {}) => {
    return tracks.filter((t) => {
      const tag = tags[t.id] || {};
      if (genre && tag.genre !== genre) return false;
      if (language && tag.language !== language) return false;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  };

  const playableUri = (track) => downloads[track.id] || track.uri;

  return (
    <LibraryContext.Provider
      value={{
        tracks,
        loading,
        permissionStatus,
        rescan: scanLibrary,
        tags,
        setTag,
        genres,
        languages,
        favorites,
        toggleFavorite,
        isFavorite,
        downloads,
        downloadTrack,
        removeDownload,
        isDownloaded,
        history,
        addHistory,
        clearHistory,
        getFilteredTracks,
        playableUri,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);

function stripExt(name) {
  return name ? name.replace(/\.[^/.]+$/, '') : 'Untitled';
}
function safeName(name) {
  return (name || 'track').replace(/[^a-zA-Z0-9._-]/g, '_');
}
