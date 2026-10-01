import styles from './SidebarMenu.module.css';
import { BookIcon, GameIcon, LightIcon } from './UiIcons';

export default function SidebarMenu({ onOpenAchievements, onOpenFunFacts, onOpenGame }) {
  return (
    <nav className={styles.sidebar} aria-label="학습 도구">
      <button className={styles.toolBtn} onClick={onOpenAchievements}>
        <BookIcon />
        <span>업적 보기</span>
      </button>

      <button className={styles.toolBtn} onClick={onOpenFunFacts}>
        <LightIcon />
        <span>재미있는 사실</span>
      </button>

      <button className={styles.toolBtn} onClick={onOpenGame}>
        <GameIcon />
        <span>한글 놀이</span>
      </button>
    </nav>
  );
}
