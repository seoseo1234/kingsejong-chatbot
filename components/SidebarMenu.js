import styles from './SidebarMenu.module.css';

export default function SidebarMenu({ onOpenAchievements, onOpenFunFacts, onPlayWordGame }) {
  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>대왕님과 함께해요</h3>
      
      <button className={styles.menuBtn} onClick={onOpenAchievements}>
        📜 세종대왕의 업적 보기
      </button>
      
      <button className={styles.menuBtn} onClick={onOpenFunFacts}>
        💡 재미있는 사실 (TMI)
      </button>
      
      <div className={styles.wordGameGroup}>
        <h4 className={styles.subtitle}>🗣️ 재미있는 말놀이</h4>
        <button className={styles.subBtn} onClick={() => onPlayWordGame('초성게임 하마!')}>
          초성게임 시작
        </button>
        <button className={styles.subBtn} onClick={() => onPlayWordGame('끝말잇기 하마!')}>
          끝말잇기 시작
        </button>
        <button className={styles.subBtn} onClick={() => onPlayWordGame('스무고개 하마!')}>
          스무고개 시작
        </button>
      </div>
    </div>
  );
}
