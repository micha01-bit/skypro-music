'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { useAppSelector } from '@/store/store';

export default function FavoritePage() {
  const { access } = useAppSelector((state) => state.auth);
  const { favoriteTracks, isLoading, error } = useFavoriteTracks(access);

  const filteredTracks = favoriteTracks
    .filter(track => track && track._id) 
    .filter((track, index, array) =>
      array.findIndex(t => t._id === track._id) === index 
    );

  return (
    <>
      <Centerblock
        categoryName="Мои треки"
        playlist={filteredTracks}
        isLoading={isLoading}
        error={error || ''}
        isAuthRequired={false}
      />
    </>
  );
}