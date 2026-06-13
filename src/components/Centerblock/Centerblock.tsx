import styles from './centerblock.module.css';
import Filter from '../Filter/Filter';
import PlaylistTitle from '../PlaylistTitle/PlaylistTitle';
import PlaylistTracks from '../PlaylistTracks/PlaylistTracks';
import Search from '../Search/Search';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';

type CenterblockProp = {
  categoryName?: string;
  playlist: TrackType[];
  isLoading: boolean;
  error: string;
  isAuthRequired: boolean;
};

export default function Centerblock({
  categoryName,
  playlist,
  isLoading,
  error,
  isAuthRequired
}: CenterblockProp) {
  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{categoryName || 'Треки'}</h2>
      <Filter playlist={playlist} />
      <div className={styles.centerblock__content}>
        <PlaylistTitle />
        <PlaylistTracks
          playlist={playlist}
          isLoading={isLoading}
          error={error}
          isAuthRequired={isAuthRequired}
        />
      </div>
    </div>
  );
}





// import styles from './centerblock.module.css';
// import Filter from '../Filter/Filter';
// import PlaylistTitle from '../PlaylistTitle/PlaylistTitle';
// import PlaylistTracks from '../PlaylistTracks/PlaylistTracks';
// import Search from '../Search/Search';
// import { TrackType } from '@/sharedTypes/sharedTypes';
// import { useAppSelector } from '@/store/store';


// type CenterblockProp = {
//   categoryName?: string;
//   isLoading: boolean;
//   error: string;
//   isAuthRequired: boolean;
// };

// export default function Centerblock({
//   categoryName,
//   isLoading,
//   error,
//   isAuthRequired
// }: CenterblockProp) {
//   const { allTracks } = useAppSelector((state) => state.tracks);

//   return (
//     <div className={styles.centerblock}>
//       <Search />
//       <h2 className={styles.centerblock__h2}>{categoryName || 'Треки'}</h2>
//       <Filter playlist={allTracks} />
//       <div className={styles.centerblock__content}>
//         <PlaylistTitle />
//         <PlaylistTracks
//           playlist={allTracks}
//           isLoading={isLoading}
//           error={error}
//           isAuthRequired={isAuthRequired}
//         />
//       </div>
//     </div>
//   );
// }




// import styles from './centerblock.module.css';
// import Filter from '../Filter/Filter';
// import PlaylistTitle from '../PlaylistTitle/PlaylistTitle';
// import PlaylistTracks from '../PlaylistTracks/PlaylistTracks'; 
// import Search from '../Search/Search'; 
// import { TrackType } from '@/sharedTypes/sharedTypes';


// type CenterblockProp = {
//   playlist: TrackType[],
//   categoryName?: string,
//   isLoading: boolean,
//   error: string, 
//   isAuthRequired: boolean
// }  

 
// export default function Centerblock({ playlist, categoryName, isLoading, error, isAuthRequired }: CenterblockProp) { 
//   // console.log("Отфильтрованные треки в Centerblock: ", playlist);
//   return (
//     <div className={styles.centerblock}>
//      <Search/>
//       <h2 className={styles.centerblock__h2}>{categoryName || 'Треки'}</h2>
//       <Filter playlist={playlist} />
//       <div className={styles.centerblock__content}>
//         <PlaylistTitle />
//         <PlaylistTracks playlist={playlist} isLoading={isLoading} error={error} isAuthRequired={isAuthRequired}/>
//       </div>
//     </div>
//   )
// }