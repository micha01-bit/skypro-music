'use client';

import { addTrackToFavorite, deleteTrackFromFavorite } from "@/app/services/tracks/trackApi";
import { TrackType } from "@/sharedTypes/sharedTypes";
import { addLikedTracks, removeLikedTracks } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { reAuth } from "@/utils/reAuth";
import { AxiosError } from "axios";
import { useState, useRef } from "react";

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

  // Реф для блокировки повторных кликов
  const isProcessing = useRef(false);

  // Безопасная проверка типа favoriteTracks
  const isLike = Array.isArray(favoriteTracks)
    ? favoriteTracks.some((t) => t._id === track?._id)
    : false;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = async () => {
    // Блокируем повторные клики во время обработки
    if (isProcessing.current || isLoading) return;
    isProcessing.current = true;
    setIsLoading(true);
    setErrorMsg(null);

    if (!access) {
      setErrorMsg('Нет авторизации');
      isProcessing.current = false;
      setIsLoading(false);
      return;
    }

    if (!track) {
      setErrorMsg('Трек не найден');
      isProcessing.current = false;
      setIsLoading(false);
      return;
    }

    const actionApi = isLike ? deleteTrackFromFavorite : addTrackToFavorite;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    // Оптимистическое обновление Redux
    dispatch(actionSlice(track));

    try {
      await reAuth(
        (newToken) => actionApi(track._id, newToken || access),
        refresh,
        dispatch
      );
    } catch (error) {
      // Откат при ошибке
      const rollbackAction = isLike ? addLikedTracks : removeLikedTracks;
      dispatch(rollbackAction(track));
      handleApiError(error);
    } finally {
      isProcessing.current = false;
      setIsLoading(false);
    }
  };

  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Ошибка сервера');
      } else if (error.request) {
        setErrorMsg('Произошла ошибка сети. Проверьте подключение и попробуйте позже');
      } else {
        setErrorMsg('Ошибка при настройке запроса');
      }
    } else if (error instanceof Error) {
      setErrorMsg(`Ошибка: ${error.message}`);
    } else {
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