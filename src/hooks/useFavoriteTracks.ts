'use client';

import { getFavoriteTracks } from '@/app/services/tracks/trackApi';
import { useEffect, useState } from 'react';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFavoriteTracks } from '@/store/features/trackSlice';
import { reAuth } from '@/utils/reAuth';

export const useFavoriteTracks = (accessToken: string | null) => {
  const [localFavoriteTracks, setLocalFavoriteTracks] = useState<TrackType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.auth);
  const reduxFavoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  useEffect(() => {
    setLocalFavoriteTracks(reduxFavoriteTracks);
  }, [reduxFavoriteTracks]);

  useEffect(() => {
    if (!accessToken) {
      setLocalFavoriteTracks([]);
      setError('Требуется авторизация');
      return;
    }

    const fetchFavoriteTracks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tracks = await reAuth(
          (newToken) => getFavoriteTracks(newToken || accessToken),
          refresh,
          dispatch
        );
        // Обновляем и Redux, и локальное состояние
        dispatch(setFavoriteTracks(tracks));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            setError('Требуется повторная авторизация');
          } else if (error.response?.status === 404) {
            setError('Эндпоинт API не найден. Проверьте URL.');
          } else if (error.response) {
            setError(error.response.data.message || 'Ошибка сервера');
          } else if (error.request) {
            setError('Произошла ошибка сети. Проверьте подключение и попробуйте позже');
          } else {
            setError('Ошибка при настройке запроса');
          }
        } else if (error instanceof Error) {
          setError(`Ошибка: ${error.message}`);
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteTracks();
  }, [accessToken, dispatch, refresh]);


  return { favoriteTracks: localFavoriteTracks, isLoading, error };
};