import styles from './SidebarMenu.module.css';

export default function SidebarMenu({ onOpenAchievements, onOpenFunFacts, onPlayWordGame }) {
  return (
    <div className={styles.sidebar}>
      <button className={styles.menuBtn} onClick={onOpenAchievements}>
        🌟 세종대왕의 업적
      </button>

      <div className={styles.wordGameGroup}>
        <button className={styles.subBtn} onClick={onOpenFunFacts}>
          ❓ 재미있는 사실
        </button>
        <button className={styles.subBtn} onClick={() => onPlayWordGame("세종대왕님, 우리 말놀이 해요!")}>
          🎮 한글 게임
        </button>
      </div>
    </div>
  );
}
