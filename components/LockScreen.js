"use client";

import { useState } from 'react';
import styles from './LockScreen.module.css';

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleUnlock = async (event) => {
    event.preventDefault();
    if (!pin || isChecking) return;

    setError('');
    setIsChecking(true);

    try {
      const response = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        onUnlock();
        return;
      }

      const data = await response.json();
      setError(data.error || '잠금을 해제하지 못했습니다.');
      setPin('');
    } catch {
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="lock-title">
        <h2 id="lock-title" className={styles.title}>보호 모드 작동</h2>
        <p className={styles.message}>
          바르지 않은 말이 감지되어 대화가 일시 정지되었습니다.<br />
          선생님이나 부모님께 잠금 해제를 요청하세요.
        </p>
        
        {error && <p className={styles.error} role="alert">{error}</p>}

        <form onSubmit={handleUnlock}>
          <label htmlFor="admin-pin" className={styles.srOnly}>관리자 PIN</label>
          <input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={20}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={styles.pinInput}
            placeholder="관리자 PIN"
            autoFocus
          />

          <button type="submit" disabled={isChecking || !pin} className={styles.unlockBtn}>
            {isChecking ? '확인 중...' : '잠금 해제'}
          </button>
        </form>
      </div>
    </div>
  );
}
