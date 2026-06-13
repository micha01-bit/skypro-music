import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type initialStateType = {
  currentTrack: null | TrackType,
  isPlay: boolean,
  currentPlaylist: TrackType[],
  isShuffle: boolean,
  shuffledPlaylist: TrackType[]
}

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: [],
  isShuffle: false,
  shuffledPlaylist: []
}

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.currentPlaylist = action.payload;
      // spread-оператор — чтобы не мутировал исходный плейлист
      state.shuffledPlaylist = [...state.currentPlaylist].sort(() => Math.random() - 0.5);
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setNextTrack: (state) => {
      const playlist = state.isShuffle ? state.shuffledPlaylist : state.currentPlaylist;

      if (playlist.length === 0) return;

      const currentTrackIndex = playlist.findIndex((track) => track._id === state.currentTrack?._id);
      let nextTrackIndex: number;

      if (currentTrackIndex === -1 || currentTrackIndex === playlist.length - 1) {
        nextTrackIndex = 0; // Переход к первому треку
      } else {
        nextTrackIndex = currentTrackIndex + 1;
      }

      state.currentTrack = playlist[nextTrackIndex];
    },
    setPrevTrack: (state) => {
      const playlist = state.isShuffle ? state.shuffledPlaylist : state.currentPlaylist;

      if (playlist.length === 0) return;

      const currentTrackIndex = playlist.findIndex((track) => track._id === state.currentTrack?._id);
      let prevTrackIndex: number;

      if (currentTrackIndex === -1 || currentTrackIndex === 0) {
        prevTrackIndex = playlist.length - 1; // Переход к последнему треку
      } else {
        prevTrackIndex = currentTrackIndex - 1;
      }

      state.currentTrack = playlist[prevTrackIndex];
    },
    toggleIsShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    }
  }
})

export const { setCurrentTrack, setCurrentPlaylist, setIsPlay, setNextTrack, setPrevTrack, toggleIsShuffle } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;