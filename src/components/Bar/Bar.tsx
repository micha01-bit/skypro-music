'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRef, useEffect } from 'react';
import { setIsPlay } from '@/store/features/trackSlice';

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const currentTrackName = useAppSelector(
    (state) => state.tracks.currentTrack?.name,
  );
  const currentTrackAuthor = useAppSelector(
    (state) => state.tracks.currentTrack?.author,
  );
  const currentTrackIsPlay = useAppSelector((state) => state.tracks.isPlay);

  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false); // синхронизация состояния

  // Синхронизация isPlay с реальным состоянием аудиоэлемента
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncState = () => {
      isPlayingRef.current = !audio.paused;
      if (isPlayingRef.current !== currentTrackIsPlay) {
        dispatch(setIsPlay(isPlayingRef.current));
      }
    };

    audio.addEventListener('play', syncState);
    audio.addEventListener('pause', syncState);

    return () => {
      audio.removeEventListener('play', syncState);
      audio.removeEventListener('pause', syncState);
    };
  }, [dispatch, currentTrackIsPlay]);

  // Управление воспроизведением при смене isPlay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const controlPlayback = async () => {
      try {
        if (currentTrackIsPlay && audio.paused) {
          await audio.play();
        } else if (!currentTrackIsPlay && !audio.paused) {
          audio.pause();
        }
      } catch (error) {
        console.warn('Playback failed:', error);
      }
    };

    controlPlayback();
  }, [currentTrackIsPlay, currentTrack]);

  const playPauseTrack = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        dispatch(setIsPlay(true));
      } else {
        audio.pause();
        dispatch(setIsPlay(false));
      }
    } catch (error) {
      console.error('Play/Pause failed:', error);
    }
  };

  if (!currentTrack) return <></>;

  return (
    <div className={styles.bar}>
      <audio
        className={styles.audio}
        controls
        ref={audioRef}
        src={currentTrack?.track_file}
      ></audio>  
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={playPauseTrack}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      currentTrackIsPlay
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  ></use>
                </svg>
              </div>
              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={classnames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrackName}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrackAuthor}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classnames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
