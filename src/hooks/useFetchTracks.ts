'use client';

import { getTracks } from "@/app/services/tracks/trackApi";
import { setAllTracks, setFetchError, setFetchIsLoading } from "@/store/features/trackSlice";
import { useAppDispatch } from "@/store/store";
import { AxiosError } from "axios";
import { useEffect } from "react";

export const useFetchTracks = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setFetchIsLoading(true));
    getTracks()
      .then((resp) => {
        dispatch(setAllTracks(resp));
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            dispatch(setFetchError(error.response.data));
          } else if (error.request) {
            dispatch(setFetchError("Отсутствует интернет. Попробуйте позже"));
          } else {
            dispatch(setFetchError("Неизвестная ошибка"));
          }
        }
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
  }, [dispatch]);
};