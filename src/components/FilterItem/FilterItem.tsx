'use client';

import classNames from 'classnames';
import styles from './filterItem.module.css';
import { useState } from 'react';
import { TrackType } from '@/sharedTypes/sharedTypes';

type titleItemProp = {
  title: string;
  onClick: () => void;
  isOpen: boolean;
  activeFilter: string;
  playlist?: TrackType[];
};

export default function FilterItem({
  title,
  onClick,
  isOpen,
  activeFilter,
  playlist = []
}: titleItemProp) {
  const uniqueAuthors = playlist
    ? [...new Set(playlist.map(track => track.author))]
    : [];

  const uniqueReleaseYears = playlist
    ? [...new Set(playlist.map(track => {
        const date = new Date(track.release_date);
        return isNaN(date.getTime()) ? null : date.getFullYear();
      }).filter(year => year !== null))]
    : [];

  const uniqueGenres = playlist
    ? [...new Set(playlist.flatMap(track => track.genre || []))]
    : [];

  return (
    <>
      <div
        className={
          isOpen
            ? classNames(styles.filter__button, {
                [styles.active]: activeFilter === title,
              })
            : styles.filter__button
        }
        onClick={() => onClick()}
      >
        {title}
        {isOpen && (
          <div className={styles.filter__wrapper}>
            <ul className={styles.filter__list}>
              {title === "исполнителю" &&
                uniqueAuthors.map((author) => (
                  <li className={styles.filter__item} key={author}>
                    {author}
                  </li>
                ))}

              {title === "году выпуска" &&
                uniqueReleaseYears.map((year) => (
                  <li className={styles.filter__item} key={year}>
                    {year}
                  </li>
                ))}

              {title === "жанру" &&
                uniqueGenres.map((genre) => (
                  <li className={styles.filter__item} key={genre}>
                    {genre}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}