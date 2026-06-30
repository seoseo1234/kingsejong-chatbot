"use client";

import { useState } from 'react';
import styles from './LockScreen.module.css';

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    // 엄격한 차단 해제를 위한 관리자 PIN
    const CORRECT_PIN = localStorage.getItem('admin_pin') || 'admin1100'; 
    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.title}>보호 모드 작동</h2>
        <p className={styles.message}>
          바르지 않은 말이 감지되어 대화가 일시 정지되었습니다.<br />
          선생님이나 부모님께 잠금 해제를 요청하세요.
        </p>
        
        {error && <p className={styles.error}>비밀번호가 틀렸습니다.</p>}
        
        <input 
          type="password" 
          maxLength={10}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className={styles.pinInput}
          placeholder="PIN"
        />
        
        <button onClick={handleUnlock} className={styles.unlockBtn}>
          잠금 해제
        </button>
      </div>
    </div>
  );
}
