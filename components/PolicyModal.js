import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './PolicyModal.module.css';

export default function PolicyModal({ type, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const title = type === 'terms' ? '이용약관' : '개인정보처리방침';
  const filePath = type === 'terms' ? '/docs/이용약관.md' : '/docs/개인정보처리방침.md';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('내용을 불러오지 못했습니다.');
        }
      } catch (error) {
        setContent('내용을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [filePath]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>불러오는 중...</div>
          ) : (
            <div className={styles.markdownContainer}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}
