import styles from './ChatBubble.module.css';

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';
  
  return (
    <div className={`${styles.bubbleContainer} ${isUser ? styles.userContainer : styles.assistantContainer}`}>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        {content}
      </div>
    </div>
  );
}
