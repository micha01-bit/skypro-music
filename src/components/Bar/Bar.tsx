
 
 
 
 
'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRef, useEffect, useState, ChangeEvent } from 'react';
import { setIsPlay, setNextTrack, setPrevTrack, toggleIsShuffle } from '@/store/features/trackSlice';
import { getTimePanel } from '@/utils/helpers';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function Bar() {
  const dispatch = useAppDispatch();

  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const currentTrackName = useAppSelector(
    (state) => state.tracks.currentTrack?.name,
  );
  const currentTrackAuthor = useAppSelector(
    (state) => state.tracks.currentTrack?.author,
  );
  const currentTrackIsPlay = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);

  const [volume, setVolume] = useState(0.5);
  const [isLoop, setIsLoop] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [progressBarTime, setProgressBarTime] = useState(0);

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

  // Обновление громкости при изменении состояния
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Сброс состояния загрузки при смене трека
  useEffect(() => {
    setIsLoadedTrack(false);
  }, [currentTrack]);

  if (!currentTrack) return <></>;

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

  const onVolumeChange = (currentVolumeLevel: number) => {
    if (audioRef.current) {
      setVolume(currentVolumeLevel);
    }
  };

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const onTimeUpdate = () => {
    if (audioRef.current && isLoadedTrack) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      // Не вызываем play() здесь — управление через useEffect выше
      setIsLoadedTrack(true);
    }
  };

  const onEnded = () => {
    dispatch(setIsPlay(false));

    if (isLoop) {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.warn('Loop playback failed:', error);
        });
      }
    } else {
      dispatch(setNextTrack());
    }
  };

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgressBarTime(newTime);
    }
  };

  const onSetNextTrack = () => {
    dispatch(setNextTrack());
  };

  const onSetPrevTrack = () => {
    dispatch(setPrevTrack());
  };

  const onToggleShuffle = () => {
    dispatch(toggleIsShuffle());
  };

  return (
    <div className={styles.bar}>
      <audio
        className={styles.audio}
        controls
        ref={audioRef}
        src={currentTrack?.track_file}
        loop={isLoop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      <div className={styles.bar__content}>
        <div className={styles.trackPlay__timeBlock}>
          <div className={styles.trackPlay__time}>
            {getTimePanel(currentTime, duration)}
          </div>
        </div>
        <ProgressBar
          max={duration || 0}
          value={currentTime || 0}
          step={0.1}
          onChange={onChangeProgress}
          readOnly={!isLoadedTrack}
        />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={classnames(styles.player__btnPrev, styles.btn)}
                onClick={onSetPrevTrack}
              >
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
              <div
                className={classnames(styles.player__btnNext, styles.btn)}
                onClick={onSetNextTrack}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
                            <div
                onClick={onToggleLoop}
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  { [styles.btnIcon__active]: isLoop }
                )}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  { [styles.btnIcon__active]: isShuffle }
                )}
                onClick={onToggleShuffle}
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
                    styles.btnIcon
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon
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
                    styles.btn
                  )}
                  type="range"
                  name="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

