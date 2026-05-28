// 'use client';
 
import styles from './playlistTracks.module.css';
import PlaylistTrack from '../PlaylistTrack/PlaylistTrack';
import { TrackType } from '@/sharedTypes/sharedTypes';
import Loading from '../Loading/Loading'; 
 
 
type PlaylistTracksProp = {
  playlist: TrackType[],
  isLoading: boolean,
  error: string
}

export default function PlaylistTracks({ playlist, isLoading, error }: PlaylistTracksProp) {
  return (
    <div className={styles.content__playlist}>
      {error ?
        <div className={styles.errorContainer}>{error}</div>
        :
        <div className={styles.errorContainer}>{error}</div>
      }
      {isLoading ?
        <Loading />
        :
        playlist.map((track) =>
        <PlaylistTrack
          key={track._id}
          track={track} 
          playlist={playlist}
        />
      )}
    </div>
  )
}