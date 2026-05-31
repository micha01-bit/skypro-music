'use client';

import { addTrackToFavorite, deleteTrackFromFavorite } from "@/app/services/tracks/trackApi";
import { TrackType } from "@/sharedTypes/sharedTypes";
import { addLikedTracks, removeLikedTracks } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { reAuth } from "@/utils/reAuth";
import { AxiosError } from "axios";
import { useState } from "react";

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TrackType | null): returnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Определяем, есть ли трек в избранном
  const isLike = favoriteTracks.some((t) => t._id === track?._id);

  // Состояние загрузки и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Функция для переключения статуса «избранное»
   * 1. Проверяет авторизацию
   * 2. Определяет действие (добавить/удалить)
   * 3. Выполняет запрос с обработкой ошибок
   */
  const toggleLike = async () => {
    // Проверка авторизации
    if (!access) {
      setErrorMsg('Нет авторизации');
      return;
    }

    // Проверка наличия трека
    if (!track) {
      setErrorMsg('Трек не найден');
      return;
    }

    // Определяем API-метод и метод обновления состояния Redux
    const actionApi = isLike ? deleteTrackFromFavorite : addTrackToFavorite;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    // Устанавливаем состояние загрузки
    setIsLoading(true);
    // Сбрасываем предыдущую ошибку
    setErrorMsg(null);

    try {
      // Выполняем запрос с автоматической обработкой токена
      await reAuth(
        (newToken) => actionApi(track._id, newToken || access),
        refresh,
        dispatch
      );

      // Обновляем состояние в Redux
      dispatch(actionSlice(track));
    } catch (error) {
      // Обрабатываем ошибки
      handleApiError(error);
    } finally {
      // Завершаем состояние загрузки
      setIsLoading(false);
    }
  };

  /**
   * Обработчик ошибок API
   * @param error — ошибка любого типа
   */
  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        // Ошибка от сервера
        setErrorMsg(error.response.data.message || 'Ошибка сервера');
      } else if (error.request) {
        // Сетевая ошибка
        setErrorMsg('Произошла ошибка сети. Проверьте подключение и попробуйте позже');
      } else {
        // Ошибка настройки запроса
        setErrorMsg('Ошибка при настройке запроса');
      }
    } else if (error instanceof Error) {
      // Обычная ошибка JavaScript
      setErrorMsg(`Ошибка: ${error.message}`);
    } else {
      // Непредвиденная ошибка
      setErrorMsg('Произошла непредвиденная ошибка');
    }
  };

  return {
    isLoading,
    errorMsg,
    toggleLike,
    isLike,
  };
};




// 'use client';

// import { addTrackToFavorite, deleteTrackFromFavorite, getFavoriteTracks } from "@/app/services/tracks/trackApi";
// import { TrackType } from "@/sharedTypes/sharedTypes";
// import { addLikedTracks, removeLikedTracks, setFavoriteTracks } from "@/store/features/trackSlice";
// import { useAppDispatch, useAppSelector } from "@/store/store";
// import { reAuth } from "@/utils/reAuth";
// import { AxiosError } from "axios";
// import { useState, useEffect } from "react";

// type returnTypeHook = {
//   isLoading: boolean;
//   errorMsg: string | null;
//   toggleLike: () => void;
//   isLike: boolean;
// };

// export const useLikeTrack = (track: TrackType | null): returnTypeHook => {
//   const { favoriteTracks } = useAppSelector((state) => state.tracks);
//   const { access, refresh } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();

//   const isLike = favoriteTracks.some((t) => t._id === track?._id);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // Эффект для загрузки любимых треков при монтировании и изменении авторизации
//   useEffect(() => {
//     const loadFavoriteTracks = async () => {
//       if (!access) return;

//       try {
//         const tracks = await reAuth(
//           (newToken) => getFavoriteTracks(newToken || access),
//           refresh,
//           dispatch
//         );
//         dispatch(setFavoriteTracks(tracks));
//       } catch (error) {
//         console.error('Ошибка загрузки любимых треков:', error);
//       }
//     };

//     loadFavoriteTracks();
//   }, [access, dispatch, refresh]);

//   const toggleLike = async () => {
//     if (!access) {
//       setErrorMsg('Нет авторизации');
//       return;
//     }

//     if (!track) {
//       setErrorMsg('Трек не найден');
//       return;
//     }

//     const actionApi = isLike ? deleteTrackFromFavorite : addTrackToFavorite;
//     const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

//     setIsLoading(true);
//     setErrorMsg(null);

//     try {
//       await reAuth(
//         (newToken) => actionApi(track._id, newToken || access),
//         refresh,
//         dispatch
//       );
//       dispatch(actionSlice(track));
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleApiError = (error: unknown) => {
//     if (error instanceof AxiosError) {
//       if (error.response) {
//         setErrorMsg(error.response.data.message || 'Ошибка сервера');
//       } else if (error.request) {
//         setErrorMsg('Произошла ошибка сети. Проверьте подключение и попробуйте позже');
//       } else {
//         setErrorMsg('Ошибка при настройке запроса');
//       }
//     } else if (error instanceof Error) {
//       setErrorMsg(`Ошибка: ${error.message}`);
//     } else {
//       setErrorMsg('Произошла непредвиденная ошибка');
//     }
//   };

//   return {
//     isLoading,
//     errorMsg,
//     toggleLike,
//     isLike,
//   };
// };