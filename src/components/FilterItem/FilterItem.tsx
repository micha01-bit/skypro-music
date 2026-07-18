'use client';

import classNames from 'classnames';
import styles from './filterItem.module.css';
import { useMemo } from 'react';
import { TrackType } from '@/sharedTypes/sharedTypes';

type titleItemProp = {
  title: string;
  onClick: (title: string) => void;
  isOpen: boolean;
  currentValues?: string[]; 
  onSelect: (value: string) => void;
  playlist: TrackType[];
};

export default function FilterItem({
  title,
  onClick,
  isOpen,
  currentValues,
  onSelect,
  playlist
}: titleItemProp) {
  const uniqueAuthors = useMemo(() => [...new Set(playlist.map(track => track.author || ''))].filter(Boolean), [playlist]);
  
  const uniqueReleaseYears = useMemo(() => {
    return [...new Set(
      playlist
        .map(track => {
          if (!track.release_date) return null;
          const date = new Date(track.release_date);
          return isNaN(date.getTime()) ? null : date.getFullYear();
        })
        .filter((year): year is number => year !== null)
    )];
  }, [playlist]);

  const uniqueGenres = useMemo(() => {
    const flattened = playlist.flatMap(track => 
      Array.isArray(track.genre) ? track.genre : (track.genre ? [track.genre] : [])
    );
    return [...new Set(flattened.filter(Boolean))];
  }, [playlist]);

  return (
    <>
      <div
        className={
          isOpen
            ? classNames(styles.filter__button, { [styles.active]: true })
            : styles.filter__button
        }
        onClick={() => onClick(title)}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
      >
        {title}
        
        {isOpen && (
          <div className={styles.filter__wrapper}>
            <ul className={styles.filter__list} data-testid="filter-list">
              
              {title === "исполнителю" &&
                uniqueAuthors.map((author) => {
                  const isSelected = currentValues?.includes(author);
                  return (
                    <li
                      key={author}
                      className={classNames(styles.filter__item, {
                        [styles.selected]: isSelected
                      })}
                      onClick={() => onSelect(author)}
                    >
                      {author}
                    </li>
                  );
                })}

              {title === "году выпуска" &&
                uniqueReleaseYears.map((year) => {
                  const yearStr = String(year);
                  const isSelected = currentValues?.includes(yearStr);
                  return (
                    <li
                      key={yearStr}
                      className={classNames(styles.filter__item, {
                        [styles.selected]: isSelected
                      })}
                      onClick={() => onSelect(yearStr)}
                    >
                      {yearStr}
                    </li>
                  );
                })}

              {title === "жанру" &&
                uniqueGenres.map((genre) => {
                  const isSelected = currentValues?.includes(genre);
                  return (
                    <li
                      key={genre}
                      className={classNames(styles.filter__item, {
                        [styles.selected]: isSelected
                      })}
                      onClick={() => onSelect(genre)}
                    >
                      {genre}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}