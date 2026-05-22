import styles from './centerblock.module.css';
import Filter from '../Filter/Filter';
import PlaylistTitle from '../PlaylistTitle/PlaylistTitle';
import PlaylistTracks from '../PlaylistTracks/PlaylistTracks'; 
import Search from '../Search/Search'; 
import { TrackType } from '@/sharedTypes/sharedTypes';


type CenterblockProp = {
  playlist: TrackType[],
  categoryName?: string,
  isLoading: boolean,
  error: string
} 
 
export default function Centerblock({ playlist, categoryName, isLoading, error }: CenterblockProp) {
  return (
    <div className={styles.centerblock}>
     <Search/>
      <h2 className={styles.centerblock__h2}>{categoryName || 'Треки'}</h2>
      <Filter playlist={playlist} />
      <div className={styles.centerblock__content}>
        <PlaylistTitle />
        <PlaylistTracks playlist={playlist} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}