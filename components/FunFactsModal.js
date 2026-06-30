"use client";

import styles from './FunFactsModal.module.css';

const FACTS = [
  {
    emoji: '🥩',
    title: '엄청난 고기 사랑!',
    desc: '세종대왕님은 식사 때마다 고기반찬이 없으면 밥을 드시지 않을 정도로 고기를 아주 좋아하셨어요.'
  },
  {
    emoji: '📚',
    title: '독서왕 세종',
    desc: '어릴 때부터 책을 너무 많이 읽어서 눈병이 났는데도 몰래 책을 읽으셨다고 해요.'
  },
  {
    emoji: '🏃',
    title: '운동 부족?',
    desc: '책만 읽고 앉아있는 것을 좋아하셔서, 아버지 태종 임금님이 밖에서 뛰어놀라고 잔소리를 하셨대요.'
  },
  {
    emoji: '🎶',
    title: '절대음감의 소유자',
    desc: '음악을 아주 좋아하시고 귀가 밝아서, 악기 소리가 아주 조금만 틀려도 바로 알아채셨어요.'
  }
];

export default function FunFactsModal({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>💡 세종대왕님의 재미있는 비밀</h2>
          <button className={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        
        <div className={styles.content}>
          {FACTS.map((fact, idx) => (
            <div key={idx} className={styles.factCard}>
              <div className={styles.emoji}>{fact.emoji}</div>
              <div className={styles.textSection}>
                <h3>{fact.title}</h3>
                <p>{fact.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
