"use client";

import { useEffect, useRef } from 'react';
import styles from './CharacterView.module.css';

/**
 * 상태(state) props: 'idle' (대기), 'thinking' (API 요청 중), 'speaking' (답변 출력 중)
 */
export default function CharacterView({ state = 'idle' }) {
  const videoRef = useRef(null);
  const animationClass = styles[state] || styles.idle;
  const isTalking = state === 'speaking';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isTalking) {
      video.play().catch(() => {
        // 음소거 영상이지만 브라우저 정책으로 재생이 막히면 정지 이미지를 유지한다.
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [isTalking]);

  return (
    <div className={styles.container}>
      <div className={`${styles.portraitFrame} ${animationClass}`}>
        <video
          ref={videoRef}
          className={styles.character}
          src="/videos/sejong-speaking.mp4"
          poster="/images/sejong-realistic-poster.webp"
          preload="auto"
          muted
          loop
          playsInline
          aria-label={isTalking ? '말씀하고 계신 세종대왕' : '세종대왕 초상'}
        />
        <span className={styles.reconstructionLabel}>AI 재현</span>
        <span className={styles.liveIndicator} aria-hidden="true" />
      </div>
    </div>
  );
}
