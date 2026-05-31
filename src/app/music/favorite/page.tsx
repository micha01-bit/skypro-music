'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useAppSelector } from '@/store/store';
import FetchingFavoriteTracks from '@/components/FetchingFavoriteTracks/FetchingFavoriteTracks';

export default function FavoritePage() {
  const { favoriteTracks, fetchIsLoading, fetchError } = useAppSelector((state) => state.tracks);
  const isAuthRequired = true;

  return (
    <>
      <FetchingFavoriteTracks />
      <Centerblock
        categoryName="Мои треки"
        playlist={favoriteTracks}
        isLoading={fetchIsLoading}
        error={fetchError || ''}
        isAuthRequired={isAuthRequired}
      />
    </>
  );
}






// 'use client';

// import Centerblock from '@/components/Centerblock/Centerblock';
// import { useAppSelector } from '@/store/store';


// export default function FavoritePage() {
//   const { favoriteTracks, fetchIsLoading, fetchError } = useAppSelector((state) => state.tracks);

//   const isAuthRequired = true;

//   return (
//     <>
//       <Centerblock
//         categoryName="Мои треки"
//         playlist={favoriteTracks}
//         isLoading={fetchIsLoading}
//         error={fetchError || ''} 
//         isAuthRequired={isAuthRequired}  
//         />
//     </>
//   )
// }