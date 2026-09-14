# Heartify

A pink, Spotify-style music player built with React Native + Expo.

Because Heartify plays **your own audio files already on the phone** (not a licensed
streaming catalog), everything is genuinely unlimited and free forever — no premium
tier, no account, no internet required after install:

- **Offline-first** — scans your device for audio and plays it directly; no streaming
- **Unlimited, free** — every song on your phone, no paywall, ever
- **Download / offline copies** — heart a song, then tap the download icon to copy it
  into Heartify's private storage so it's guaranteed to keep playing even if you move
  or delete the original file
- **Genre & language tagging** — long-press any song in the Library tab to tag its
  genre/language (old Tamil, latest Hindi, EDM, whatever you like), then filter by it
- **Daily history** — every play is logged and grouped by day (Today / Yesterday / ...)
- **Your logo, your pink theme** — brand colors live in `src/theme/colors.js`,
  app icon/splash are already generated from your uploaded logo

## What you get in this folder

```
Heartify/
├── App.js                     entry point
├── app.json                   Expo config (name, icon, Android permissions)
├── eas.json                   build profiles (APK vs AAB)
├── package.json
├── assets/                    icon.png, adaptive-icon.png, splash.png (your logo)
└── src/
    ├── theme/colors.js         pink design tokens — edit freely
    ├── context/
    │   ├── LibraryContext.js   device scan, tags, favorites, downloads, history
    │   └── PlayerContext.js    playback engine (expo-av)
    ├── navigation/AppNavigator.js
    ├── components/             TrackRow, MiniPlayer
    └── screens/                Home, Search, Library, Favorites, History, NowPlaying
```

## Build it into a real .apk — two ways

### Option A: EAS Build (easiest, builds in the cloud, no Android Studio needed)

1. Install Node.js 18+ from nodejs.org if you don't have it.
2. Open a terminal in this folder and run:
   ```bash
   npm install
   npm install -g eas-cli
   npx expo login          # free Expo account
   eas build -p android --profile preview
   ```
3. EAS builds the APK on Expo's servers and gives you a download link when it's done
   (usually 10-20 minutes). Download it to your phone, allow "install from unknown
   sources" if asked, and install.

### Option B: Build locally with Android Studio (fully offline, no Expo account)

1. Install Node.js 18+, Android Studio, and an Android SDK (Studio installs this for you).
2. In this folder:
   ```bash
   npm install
   npx expo prebuild -p android     # generates a native /android project
   cd android
   ./gradlew assembleRelease        # or assembleDebug for a quick unsigned test build
   ```
3. Your APK appears at:
   `android/app/build/outputs/apk/release/app-release.apk`
   (or `.../debug/app-debug.apk` for the debug build)
4. Copy it to your phone and install.

> First run on your phone: Heartify will ask for audio/storage permission — grant it
> so it can find the music already on your device. That's your entire "catalog."

## Customizing further

- **Colors**: `src/theme/colors.js` — swap `colors.primary` for a different pink, etc.
- **App name / package id**: `app.json` → `expo.name`, `expo.android.package`
- **Add playlists, lyrics, equalizer, etc.**: the context/screen structure is set up
  so new screens just need a context hook + a `screens/YourScreen.js` + a nav entry
  in `AppNavigator.js`.
