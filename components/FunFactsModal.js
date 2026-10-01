"use client";

import styles from './FunFactsModal.module.css';

const FACTS = [
  {
    mark: '28',
    title: '처음에는 스물여덟 글자',
    desc: '1443년에 만든 훈민정음은 자음 17자와 모음 11자, 모두 28자로 시작했어요.',
    source: 'https://www.hangeul.go.kr/webzine/202010/sub1_3.html',
  },
  {
    mark: '雨',
    title: '전국에서 비를 기록했어요',
    desc: '세종 시대에는 같은 방법으로 비의 양을 재고 기록하도록 측우기 제도를 전국에 마련했어요.',
    source: 'https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_092_0030',
  },
  {
    mark: '日',
    title: '그림자로 시간과 계절을',
    desc: '앙부일구는 해의 그림자를 이용해 시간뿐 아니라 계절의 변화도 살펴볼 수 있는 해시계예요.',
    source: 'https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1121108450000&pageNo=1_1_2_0',
  },
  {
    mark: '時',
    title: '스스로 시간을 알린 물시계',
    desc: '자격루는 물의 흐름을 이용해 정해진 시간이 되면 자동으로 시각을 알려 주었어요.',
    source: 'https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_e31_0060_0030_0030',
  }
];

export default function FunFactsModal({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>세종대왕 시대의 재미있는 사실</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="재미있는 사실 닫기">닫기</button>
        </div>
        
        <div className={styles.content}>
          {FACTS.map((fact, idx) => (
            <div key={idx} className={styles.factCard}>
              <div className={styles.emoji}>{fact.mark}</div>
              <div className={styles.textSection}>
                <h3>{fact.title}</h3>
                <p>{fact.desc}</p>
                <a href={fact.source} target="_blank" rel="noreferrer">공공기관 자료 확인</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
