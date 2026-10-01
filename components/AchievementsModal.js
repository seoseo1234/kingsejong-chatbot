"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './AchievementsModal.module.css';

const ACHIEVEMENTS = [
  {
    title: '한글 (훈민정음)',
    desc: '백성을 사랑하는 마음으로 누구나 쉽게 배우고 쓸 수 있는 우리 글자, 한글을 만드셨어요.',
    img: '/images/hunmin.png',
    source: 'https://www.hangeul.go.kr/exhi/dailyExhibition.do?curr_menu_cd=0102010000',
  },
  {
    title: '측우기',
    desc: '세종 시대에는 비가 얼마나 내렸는지 같은 방법으로 재고 기록하는 측우기 제도가 마련됐어요.',
    img: '/images/cheugugi.png',
    source: 'https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_092_0030',
  },
  {
    title: '앙부일구 (해시계)',
    desc: '가마솥 모양의 해시계로, 해의 그림자를 보고 시간과 계절을 알 수 있게 백성들을 위해 설치하셨어요.',
    img: '/images/angbu.png',
    source: 'https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1121108450000&pageNo=1_1_2_0',
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
          <h2>세종대왕 시대의 주요 업적</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="업적 보기 닫기">닫기</button>
        </div>
        
        <div className={styles.content}>
          <button className={styles.navBtn} onClick={prev}>◀</button>
          
          <div className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={ACHIEVEMENTS[currentIndex].img}
                alt={ACHIEVEMENTS[currentIndex].title}
                width={250}
                height={250}
              />
            </div>
            <h3>{ACHIEVEMENTS[currentIndex].title}</h3>
            <p>{ACHIEVEMENTS[currentIndex].desc}</p>
            <a href={ACHIEVEMENTS[currentIndex].source} target="_blank" rel="noreferrer">
              공공기관 자료 확인
            </a>
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
