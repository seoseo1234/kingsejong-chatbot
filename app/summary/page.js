"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './summary.module.css';

export default function SummaryPage() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const historyStr = localStorage.getItem('chat_history');
        if (!historyStr) {
          setSummary('대화 기록이 없어 요약할 수 없습니다.');
          setLoading(false);
          return;
        }

        const history = JSON.parse(historyStr);

        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history }),
        });

        const data = await res.json();
        
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary('요약을 가져오는데 실패했습니다.');
        }
      } catch (err) {
        console.error(err);
        setSummary('요청 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <h1 className={styles.title}>세종대왕님께 배운 점</h1>
        
        {loading ? (
          <p className={styles.loading}>세종대왕님과 나눈 이야기를 정리하고 있어요...</p>
        ) : (
          <p className={styles.content}>{summary}</p>
        )}

        <Link href="/" className={styles.homeBtn} onClick={() => localStorage.removeItem('chat_history')}>
          새로운 대화 시작하기
        </Link>
      </div>
    </main>
  );
}
