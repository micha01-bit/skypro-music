'use client';

import { getFavoriteTracks } from '@/app/services/tracks/trackApi';
import { useEffect, useState } from 'react';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@/store/store';
import { setFavoriteTracks } from '@/store/features/trackSlice';
import { reAuth } from '@/utils/reAuth';
import { useAppSelector } from '@/store/store';

export const useFavoriteTracks = (accessToken: string | null) => {
  const [favoriteTracks, setFavoriteTracksLocal] = useState<TrackType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      setFavoriteTracksLocal([]);
      setError('Требуется авторизация');
      return;
    }

    const fetchFavoriteTracks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Используем reAuth для автоматической реавторизации
        const tracks = await reAuth(
          (newToken) => getFavoriteTracks(newToken || accessToken),
          refresh,
          dispatch
        );
        setFavoriteTracksLocal(tracks);
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

  return { favoriteTracks, isLoading, error };
};





// 'use client';

// import { getTracks, getFavoriteTrackIds } from "@/app/services/tracks/trackApi";
// import { useEffect, useState } from "react";
// import { TrackType } from "@/sharedTypes/sharedTypes";
// import { AxiosError } from "axios";

// export const useFavoriteTracks = (accessToken: string | null) => {
//   const [favoriteTracks, setFavoriteTracks] = useState<TrackType[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!accessToken) {
//       setFavoriteTracks([]);
//       return;
//     }

//     const fetchFavoriteTracks = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         // 1. Получаем все треки
//         const allTracks = await getTracks();
//         // 2. Получаем ID избранных треков
//         const favoriteIds = await getFavoriteTrackIds(accessToken);
//         // 3. Фильтруем треки по ID
//         const filteredTracks = allTracks.filter(track =>
//           favoriteIds.includes(track._id)
//         );
//         setFavoriteTracks(filteredTracks);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           if (error.response) {
//             setError(error.response.data.message || 'Ошибка сервера');
//           } else if (error.request) {
//             setError('Произошла ошибка сети. Проверьте подключение и попробуйте позже');
//           } else {
//             setError('Ошибка при настройке запроса');
//           }
//         } else if (error instanceof Error) {
//           setError(`Ошибка: ${error.message}`);
//         } else {
//           setError('Произошла непредвиденная ошибка');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFavoriteTracks();
//   }, [accessToken]);

//   return { favoriteTracks, isLoading, error };
// };
