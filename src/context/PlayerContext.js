import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useLibrary } from './LibraryContext';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { addHistory, playableUri } = useLibrary();
  const soundRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const onStatus = useCallback((status) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 0);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, queueIndex]);

  const loadAndPlay = useCallback(async (track) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const uri = playableUri(track);
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      onStatus
    );
    soundRef.current = sound;
    setCurrentTrack(track);
    addHistory(track);
  }, [onStatus, addHistory, playableUri]);

  // playTrack starts a new queue (e.g. "play this list starting here")
  const playTrack = useCallback((track, list = null) => {
    if (list) {
      setQueue(list);
      setQueueIndex(list.findIndex((t) => t.id === track.id));
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }
    loadAndPlay(track);
  }, [loadAndPlay]);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    if (isPlaying) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  }, [isPlaying]);

  const next = useCallback(() => {
    setQueue((q) => {
      setQueueIndex((i) => {
        const nextI = i + 1 < q.length ? i + 1 : 0;
        if (q[nextI]) loadAndPlay(q[nextI]);
        return nextI;
      });
      return q;
    });
  }, [loadAndPlay]);

  const prev = useCallback(() => {
    setQueue((q) => {
      setQueueIndex((i) => {
        const prevI = i - 1 >= 0 ? i - 1 : q.length - 1;
        if (q[prevI]) loadAndPlay(q[prevI]);
        return prevI;
      });
      return q;
    });
  }, [loadAndPlay]);

  const seek = useCallback(async (millis) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(millis);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        queue,
        playTrack,
        togglePlayPause,
        next,
        prev,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
