'use client';

import { useParams } from 'next/navigation';
import Centerblock from '@/components/Centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { getCategoryTracks } from '@/app/services/tracks/trackApi';
import { TrackType, CategoryType } from '@/sharedTypes/sharedTypes';
import { AxiosError } from 'axios';
import { useAppSelector } from '@/store/store';

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const isAuthRequired = false;

  const { fetchIsLoading, allTracks, fetchError } = useAppSelector((state) => state.tracks);

  const [categoryTracks, setCategoryTracks] = useState<TrackType[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (!params.id || fetchIsLoading || !allTracks.length) {
      setIsLoading(false);
      return;
    }

    getCategoryTracks(params.id)
      .then((res: CategoryType) => {
        setCategoryName(res.name);

        const categoryIdsAsStrings = res.items.map((id) => String(id));

        const filteredTracks = allTracks.filter((track) =>
          categoryIdsAsStrings.includes(String(track._id))
        );

        setCategoryTracks(filteredTracks);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data?.message || 'Ошибка сервера');
          } else {
            setError('Отсутствует интернет');
          }
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchIsLoading, allTracks, params.id]);

  return (
    <>
      <Centerblock
        categoryName={categoryName}
        playlist={categoryTracks}
        isLoading={isLoading}
        error={fetchError || error}
        isAuthRequired={isAuthRequired}
      />
    </>
  );
}