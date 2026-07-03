"use client";

import React, { useState } from 'react';
import PolicyModal from './PolicyModal';
import styles from './Footer.module.css';

export default function Footer() {
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy' | null

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.info}>
            <span>&copy; 2026 세종대왕 챗봇. All rights reserved.</span>
            <span className={styles.separator}>|</span>
            <span>정보관리책임자: 윤서희 교사 (서울잠동초등학교)</span>
            <span className={styles.separator}>|</span>
            <span>문의: 02-419-5464</span>
          </div>
          <div className={styles.links}>
            <span className={styles.separator}>|</span>
            &nbsp;
            <button className={styles.link} onClick={() => setModalType('terms')}>이용약관</button>
            &nbsp;
            <span className={styles.separator}>|</span>
            &nbsp;
            <button className={styles.link} onClick={() => setModalType('privacy')}>개인정보처리방침</button>
          </div>
        </div>
      </footer>

      {modalType && (
        <PolicyModal 
          type={modalType} 
          onClose={() => setModalType(null)} 
        />
      )}
    </>
  );
}
