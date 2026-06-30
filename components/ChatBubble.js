import React from 'react';
import styles from './ChatBubble.module.css';

const dictionary = {
  '훈민정음': '백성을 가르치는 바른 소리라는 뜻으로, 세종대왕님이 만든 한글의 옛 이름이야.',
  '집현전': '세종대왕님이 똑똑한 신하들과 함께 공부하고 연구하던 조선시대의 큰 연구실이야.',
  '측우기': '비가 얼마나 오는지 양을 재는 그릇이야.',
  '경복궁': '조선시대 왕이 살면서 나라를 다스리던 아주 큰 궁궐이야.',
  '앙부일구': '해의 그림자를 보고 시간을 알 수 있게 만든 해시계야.',
  '자격루': '물이 흐르는 힘을 이용해서 자동으로 시간을 알려주는 물시계야.'
};

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';
  
  const renderContent = () => {
    if (isUser) return content;
    
    const pattern = new RegExp(`(${Object.keys(dictionary).join('|')})`, 'g');
    const parts = content.split(pattern);
    
    return parts.map((part, index) => {
      if (dictionary[part]) {
        return (
          <span key={index} className={styles.hardWordWrapper}>
            <span className={styles.hardWord}>{part}</span>
            <span className={styles.tooltip}>{dictionary[part]}</span>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`${styles.bubbleContainer} ${isUser ? styles.userContainer : styles.assistantContainer}`}>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        {renderContent()}
      </div>
    </div>
  );
}
