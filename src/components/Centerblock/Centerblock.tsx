'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './centerblock.module.css'; 
import Filter from '../Filter/Filter';
import PlaylistTitle from '../PlaylistTitle/PlaylistTitle';
import PlaylistTracks from '../PlaylistTracks/PlaylistTracks';
import Search from '../Search/Search';
import { TrackType } from '@/sharedTypes/sharedTypes';

type CenterblockProp = {
  categoryName?: string;
  playlist: TrackType[];
  isLoading: boolean;
  error: string;
  isAuthRequired: boolean;
};

type FiltersState = {
  author?: string[];
  genre?: string[];
  year?: string[];
};

export default function Centerblock({
  categoryName,
  playlist,
  isLoading,
  error,
  isAuthRequired
}: CenterblockProp) {
  const [filters, setFilters] = useState<FiltersState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const safeFilters: {
    author: string[];
    genre: string[];
    year: string[];
  } = {
    author: filters.author || [],
    genre: filters.genre || [],
    year: filters.year || [],
  };

  const filteredPlaylist = useMemo(() => {
    let result = [...playlist];

    // 1. Фильтр по автору
    if (safeFilters.author.length > 0) {
      const targetAuthors = safeFilters.author.map(a => a.toLowerCase());
      result = result.filter(track => {
        if (!track.author) return false;
        return targetAuthors.includes(track.author.toLowerCase());
      });
    }

    // 2. Фильтр по жанру
    if (safeFilters.genre.length > 0) {
      const targetGenres = safeFilters.genre.map(g => g.toLowerCase());
      result = result.filter(track => {
        if (!track.genre) return false;
        
        const genresArray = Array.isArray(track.genre) 
          ? track.genre 
          : (track.genre as string ? [track.genre] : []);

        return genresArray.some(g => targetGenres.includes(g.toLowerCase()));
      });
    }

    // 3. Фильтр по году
    if (safeFilters.year.length > 0) {
      result = result.filter(track => {
        if (!track.release_date) return false;
        const trackYear = new Date(track.release_date).getFullYear();
        return safeFilters.year.includes(String(trackYear));
      });
    }

    // 4. Поиск по названию
    if (searchQuery) {
      result = result.filter(track => {
        if (!track.name) return false;
        return track.name.toLowerCase().startsWith(searchQuery);
      });
    }

    return result;
  }, [playlist, safeFilters, searchQuery]); 

  useEffect(() => {
    setFilters({});
    setSearchQuery('');
  }, [playlist]);

  return (
    <div className={styles.centerblock}>
      <Search onSearchChange={setSearchQuery} />
      <h2 className={styles.centerblock__h2}>{categoryName || 'Треки'}</h2>
      
      <Filter 
        playlist={playlist} 
        currentFilters={filters}
        onFiltersChange={setFilters}
      />

      <div className={styles.centerblock__content}>
        <PlaylistTitle />
        <PlaylistTracks
          playlist={filteredPlaylist}
          isLoading={isLoading}
          error={error}
          isAuthRequired={isAuthRequired}
        />
      </div>

      {!isLoading && filteredPlaylist.length === 0 && searchQuery === '' && 
       safeFilters.author.length === 0 && safeFilters.genre.length === 0 && safeFilters.year.length === 0 && (
        <div className={styles.noResultsMessage}>Нет треков в этом разделе</div>
      )}
      
      {!isLoading && filteredPlaylist.length === 0 && (searchQuery || 
       safeFilters.author.length > 0 || safeFilters.genre.length > 0 || safeFilters.year.length > 0) && (
        <div className={styles.noResultsMessage}>Нет подходящих треков</div>
      )}
    </div>
  );
}