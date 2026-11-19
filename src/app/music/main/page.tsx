'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { setFavoriteTracks } from '@/store/features/trackSlice';
import { useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  const { fetchError, fetchIsLoading, allTracks } =
    useAppSelector((state) => state.tracks);

  const isAuthRequired = false;

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteTracks');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        dispatch(setFavoriteTracks(parsedFavorites));
      } catch (e) {
        console.error('Ошибка парсинга favoriteTracks из localStorage:', e);
      }
    }
  }, [dispatch]);

  return (
    <>
      <Centerblock
        playlist={allTracks}
        isLoading={fetchIsLoading}
        error={fetchError ? fetchError : ''}
        isAuthRequired={isAuthRequired}
      />
    </>
  );
}