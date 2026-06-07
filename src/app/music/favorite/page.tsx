'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { useAppSelector } from '@/store/store';

export default function FavoritePage() {
  const { access } = useAppSelector((state) => state.auth);
  const { favoriteTracks, isLoading, error } = useFavoriteTracks(access);

  return (
    <>
      <Centerblock
        categoryName="Мои треки"
        playlist={favoriteTracks}
        isLoading={isLoading}
        error={error || ''}
        isAuthRequired={false}
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