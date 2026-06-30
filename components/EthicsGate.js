"use client";

import { useState } from 'react';
import styles from './EthicsGate.module.css';

export default function EthicsGate({ onAgree }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1>핵심 가치</h1>
          <h1>핵심 가이드</h1>
        </div>
        
        <div className={styles.guideList}>
          {/* Guide 1 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeOrange}>주도성</span>
              <span className={styles.badgeGreen}>합목적성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 1</h2>
              <h3>활용 목적</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.</h4>
              <p>생성형 AI를 사용하기 전에 '지금 내가 왜 쓰려고 하지?'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Guide 2 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeOrange}>주도성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 2</h2>
              <h3>주도적 학습</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.</h4>
              <p>막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Guide 3 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeOrange}>주도성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 3</h2>
              <h3>비판적 검증</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>생성형 AI가 틀릴 수 있다는 점을 알아요.</h4>
              <p>생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 한 번 더 확인하는 습관을 가져요.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Guide 4 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeOrange}>주도성</span>
              <span className={styles.badgeGreen}>합목적성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 4</h2>
              <h3>사고의 확장</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.</h4>
              <p>생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 나의 경험과 생각을 더하여 최종 결과물을 만들어요.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Guide 5 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeBlue}>안전성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 5</h2>
              <h3>안전과 관계</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>나의 정보와 비밀을 말하지 않아요.</h4>
              <p>이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요. 고민은 실제 사람들과 나누어요.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Guide 6 */}
          <div className={styles.guideItem}>
            <div className={styles.badges}>
              <span className={styles.badgeYellow}>투명성</span>
            </div>
            <div className={styles.titleSection}>
              <h2>가이드 6</h2>
              <h3>투명성·윤리</h3>
            </div>
            <div className={styles.contentSection}>
              <h4>생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.</h4>
              <p>어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 정직한 태도예요.</p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={isChecked} 
              onChange={(e) => setIsChecked(e.target.checked)} 
              className={styles.checkbox}
            />
            나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
          </label>
          <button 
            className={styles.agreeBtn} 
            onClick={onAgree} 
            disabled={!isChecked}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
