'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useFetchTracks } from '@/hooks/useFetchTracks';
import { useAppSelector } from '@/store/store';

export default function Home() {
  useFetchTracks();

  const { allTracks, fetchError, fetchIsLoading } = useAppSelector(
    (state) => state.tracks
  );

  return (
    <>
      <Centerblock
        playlist={allTracks} // обязательно передаём playlist
        isLoading={fetchIsLoading}
        error={fetchError || ''}
        isAuthRequired={false}
      />
    </>
  );
}




// 'use client';


// import Centerblock from '@/components/Centerblock/Centerblock';
// import { setFavoriteTracks } from '@/store/features/trackSlice';
// import { useAppSelector } from '@/store/store';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';


// export default function Home() {
//   const dispatch = useDispatch();

//   const { fetchError, fetchIsLoading, allTracks } = useAppSelector((state) => state.tracks);

//   const isAuthRequired = false; 
   

//   useEffect(() => {
//     const savedFavorites = localStorage.getItem('favoriteTracks');
//     const favoriteTracks = savedFavorites ? JSON.parse(savedFavorites) : []
//     dispatch(setFavoriteTracks(favoriteTracks));
//   }, [dispatch]);


//   return (
//     <>
//       <Centerblock 
//         playlist={allTracks}
//         isLoading={fetchIsLoading}
//         error={fetchError ? fetchError : ''}
//         isAuthRequired={isAuthRequired}
//       />
//     </>
//   );
// }