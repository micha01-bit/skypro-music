'use client';
 
import styles from './playlistTracks.module.css';
import PlaylistTrack from '../PlaylistTrack/PlaylistTrack';
import { data } from '@/data';


export default function PlaylistTracks() {
  return (
    <div className={styles.content__playlist}>
      {data.map((track) => (
        <PlaylistTrack
          key={track._id}
          track={track} 
          playlist={data}
        />
      ))}
    </div>
  );
}