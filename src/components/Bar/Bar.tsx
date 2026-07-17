'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { setIsPlay, setNextTrack, setPrevTrack, toggleIsShuffle } from '@/store/features/trackSlice';
import { getTimePanel } from '@/utils/helpers';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useLikeTrack } from '@/hooks/useLikeTrack';

export default function Bar() {
  const dispatch = useAppDispatch();

  const isAccessToken = useAppSelector((state) => state.auth.access);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const currentTrackName = useAppSelector((state) => state.tracks.currentTrack?.name);
  const currentTrackAuthor = useAppSelector((state) => state.tracks.currentTrack?.author);
  const currentTrackIsPlay = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);

  const [volume, setVolume] = useState(0.5);
  const [isLoop, setIsLoop] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [progressBarTime, setProgressBarTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toggleLike, isLike } = useLikeTrack(currentTrack);

  // Эффект для синхронизации громкости и отключения звука
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0; 
    setIsLoadedTrack(false); // Сбрасываем флаг загрузки, так как src изменится
    setCurrentTime(0);
    setDuration(0);
    setProgressBarTime(0);
  }, [currentTrack]);

  // Основной эффект управления воспроизведением
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio || !currentTrack) return;

    const managePlayback = async () => {
      try {
        if (currentTrackIsPlay && isLoadedTrack) {
          // Если должен играть и трек загружен
          if (audio.paused || audio.ended) {
            await audio.play();
          }
        } else {
          // Если должен быть на паузе
          if (!audio.paused && !audio.ended) {
            audio.pause();
          }
        }
      } catch (error) {
        // Обработка ошибки браузера (блокировка автовоспроизведения)
        if (error instanceof Error && error.name === 'NotAllowedError') {
          console.warn('Автовоспроизведение заблокировано браузером. Требуется действие пользователя.');
          if (currentTrackIsPlay) {
            dispatch(setIsPlay(false));
          }
          return;
        }

        // Игнорируем AbortError при переключении треков (это нормально)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Ошибка управления воспроизведением:', error);
        
        if (currentTrackIsPlay) {
          dispatch(setIsPlay(false));
        }
      }
    };

    managePlayback();
  }, [currentTrackIsPlay, isLoadedTrack, currentTrack, dispatch]);

  const playPauseTrack = () => {
    dispatch(setIsPlay(!currentTrackIsPlay));
  };

  const onVolumeChange = (currentVolumeLevel: number) => {
    setVolume(currentVolumeLevel);
    if (currentVolumeLevel === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const onToggleLoop = () => setIsLoop(!isLoop);

  const onTimeUpdate = () => {
    if (audioRef.current && isLoadedTrack) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      setCurrentTime(current);
      if (duration > 0) setDuration(duration);
    }
  };

  const onLoadedMetadata = () => {
    setIsLoadedTrack(true);
  };

  const onEnded = () => {
    if (isLoop) {
      // ЛОГИКА ЦИКЛА: перезапуск текущего трека
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.error('Не удалось перезапустить трек в цикле:', err);
          dispatch(setIsPlay(false));
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

  const onSetNextTrack = () => dispatch(setNextTrack());
  const onSetPrevTrack = () => dispatch(setPrevTrack());
  const onToggleShuffle = () => dispatch(toggleIsShuffle());

  const onMute = () => {
    if (isMuted) {
      setVolume(currentVolume);
    } else {
      setCurrentVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) return null;

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
        muted={isMuted}
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
                  <use xlinkHref={
                    currentTrackIsPlay ? "/img/icon/sprite.svg#icon-pause" : "/img/icon-sprite.svg#icon-play"
                  }></use>
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
                  { [styles.btnIcon__active]: isLoop },
                  { [styles.btnIcon]: !isLoop }
                )}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  { [styles.btnIcon__active]: isShuffle },
                  { [styles.btnIcon]: !isShuffle }
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

              <div className={styles.trackPlay__like}>
                <div
                  className={classnames(styles.player__btnLike, styles.btnIcon)}
                  onClick={toggleLike}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref={`/img/icon/sprite.svg#${isLike && isAccessToken ? "icon-like-active" : "icon-like"}`}></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div
                className={styles.volume__image}
                onClick={onMute}
              >
                <svg className={styles.volume__svg}>
                  <use xlinkHref={isMuted ? "/img/icon/sprite.svg#icon-mute" : "/img/icon/sprite.svg#icon-volume"}></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(styles.volume__progressLine, styles.btn)}
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
    </div >
  )
}