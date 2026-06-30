"use client";

import styles from './EthicsGate.module.css';

export default function EthicsGate({ onAgree }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1 className={styles.title}>생성형 AI 윤리 핵심가이드</h1>
        
        <div className={styles.guideList}>
          <div className={styles.guideItem}>
            <h2>가이드 1. 활용 목적</h2>
            <p><strong>생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.</strong></p>
          </div>
          
          <div className={styles.guideItem}>
            <h2>가이드 2. 주도적 학습</h2>
            <p><strong>생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.</strong></p>
          </div>
          
          <div className={styles.guideItem}>
            <h2>가이드 3. 비판적 검증</h2>
            <p><strong>생성형 AI가 틀릴 수 있다는 점을 알아요.</strong></p>
          </div>
          
          <div className={styles.guideItem}>
            <h2>가이드 4. 사고의 확장</h2>
            <p><strong>생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.</strong></p>
          </div>
          
          <div className={styles.guideItem}>
            <h2>가이드 5. 안전과 관계</h2>
            <p><strong>나의 정보와 비밀을 말하지 않아요.</strong></p>
          </div>
          
          <div className={styles.guideItem}>
            <h2>가이드 6. 투명성·윤리</h2>
            <p><strong>생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.</strong></p>
          </div>
        </div>

        <button className={styles.agreeBtn} onClick={onAgree}>
          나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
        </button>
      </div>
    </div>
  );
}
