import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  currentPlaylist: TrackType[];
  isShuffle: boolean;
  shuffledPlaylist: TrackType[];
  allTracks: TrackType[];
  favoriteTracks: TrackType[];
  fetchError: null | string;
  fetchIsLoading: boolean;
};

const loadFavoriteTracks = (): TrackType[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem('favoriteTracks');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: [],
  isShuffle: false,
  shuffledPlaylist: [],
  allTracks: [],
  favoriteTracks: [], 
  fetchError: null,
  fetchIsLoading: true,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.currentPlaylist = action.payload;
      state.shuffledPlaylist = [...state.currentPlaylist].sort(() => Math.random() - 0.5);
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setNextTrack: (state) => {
      const playlist = state.isShuffle ? state.shuffledPlaylist : state.currentPlaylist;
      const currentTrackIndex = playlist.findIndex((track) => track._id === state.currentTrack?._id);

      if (currentTrackIndex !== playlist.length - 1) {
        const nextTrackIndex = currentTrackIndex + 1;
        state.currentTrack = playlist[nextTrackIndex];
      }
    },
    setPrevTrack: (state) => {
      const playlist = state.isShuffle ? state.shuffledPlaylist : state.currentPlaylist;
      const currentTrackIndex = playlist.findIndex((track) => track._id === state.currentTrack?._id);

      if (currentTrackIndex !== 0) {
        const prevTrackIndex = currentTrackIndex - 1;
        state.currentTrack = playlist[prevTrackIndex];
      }
    },
    toggleIsShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    setAllTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.allTracks = action.payload;
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('favoriteTracks', JSON.stringify(action.payload));
        } catch (error) {
        }
      }
    },
    addLikedTracks: (state, action: PayloadAction<TrackType>) => {
      const isAlreadyLiked = state.favoriteTracks.some(
        (track) => track._id === action.payload._id
      );

      if (!isAlreadyLiked) {
        state.favoriteTracks = [...state.favoriteTracks, action.payload];

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('favoriteTracks', JSON.stringify(state.favoriteTracks));
          } catch (error) {
            
          }
        }
      }
    },
    removeLikedTracks: (state, action: PayloadAction<TrackType>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id !== action.payload._id
      );

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('favoriteTracks', JSON.stringify(state.favoriteTracks));
        } catch (error) {
          console.error('Ошибка сохранения в localStorage:', error);
        }
      }
    },
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    }
  }
});

export const {
  setCurrentTrack,
  setCurrentPlaylist,
  setIsPlay,
  setNextTrack,
  setPrevTrack,
  toggleIsShuffle,
  setAllTracks,
  setFavoriteTracks,
  addLikedTracks,
  removeLikedTracks,
  setFetchError,
  setFetchIsLoading
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer; 