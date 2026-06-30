"use client";

import { useState } from 'react';
import styles from './AchievementsModal.module.css';

const ACHIEVEMENTS = [
  {
    title: '한글 (훈민정음)',
    desc: '백성을 사랑하는 마음으로 누구나 쉽게 배우고 쓸 수 있는 우리 글자, 한글을 만드셨어요.',
    img: '/images/hunmin.png'
  },
  {
    title: '측우기',
    desc: '농사를 잘 짓기 위해 비가 얼마나 내렸는지 정확하게 잴 수 있는 도구인 측우기를 만드셨어요.',
    img: '/images/cheugugi.png'
  },
  {
    title: '앙부일구 (해시계)',
    desc: '가마솥 모양의 해시계로, 해의 그림자를 보고 시간과 계절을 알 수 있게 백성들을 위해 설치하셨어요.',
    img: '/images/angbu.png'
  }
];

export default function AchievementsModal({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % ACHIEVEMENTS.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + ACHIEVEMENTS.length) % ACHIEVEMENTS.length);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>📜 세종대왕님의 위대한 업적</h2>
          <button className={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        
        <div className={styles.content}>
          <button className={styles.navBtn} onClick={prev}>◀</button>
          
          <div className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={ACHIEVEMENTS[currentIndex].img} alt={ACHIEVEMENTS[currentIndex].title} />
            </div>
            <h3>{ACHIEVEMENTS[currentIndex].title}</h3>
            <p>{ACHIEVEMENTS[currentIndex].desc}</p>
          </div>
          
          <button className={styles.navBtn} onClick={next}>▶</button>
        </div>
        
        <div className={styles.dots}>
          {ACHIEVEMENTS.map((_, idx) => (
            <span key={idx} className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
