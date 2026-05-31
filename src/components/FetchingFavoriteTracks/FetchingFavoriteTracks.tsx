'use client';

import { getFavoriteTracks } from "@/app/services/tracks/trackApi";
import { setFavoriteTracks, setFetchError, setFetchIsLoading } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { reAuth } from "@/utils/reAuth";
import { useEffect } from "react";

export default function FetchingFavoriteTracks() {
  const dispatch = useAppDispatch();
  const { access, refresh } = useAppSelector((state) => state.auth);
  const { fetchIsLoading: tracksLoading } = useAppSelector((state) => state.tracks);

  useEffect(() => {
    if (!access || tracksLoading) return;

    dispatch(setFetchIsLoading(true));
    reAuth(
      (newToken) => getFavoriteTracks(newToken || access),
      refresh,
      dispatch
    )
      .then((tracks) => {
        dispatch(setFavoriteTracks(tracks));
      })
      .catch((error) => {
        console.error('Ошибка загрузки избранных треков:', error);
        dispatch(setFetchError('Ошибка загрузки избранных треков'));
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
  }, [access, dispatch, refresh, tracksLoading]);

  return null;
}
