"use client";

import styles from './CharacterView.module.css';

/**
 * 상태(state) props: 'idle' (대기), 'thinking' (API 요청 중), 'speaking' (답변 출력 중)
 */
export default function CharacterView({ state = 'idle' }) {
  // state에 따라 적절한 CSS 애니메이션 클래스 적용
  const animationClass = styles[state] || styles.idle;

  return (
    <div className={styles.container}>
      <div className={`${styles.character} ${animationClass}`} />
    </div>
  );
}
