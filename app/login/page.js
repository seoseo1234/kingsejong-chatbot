"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 로그인 성공 시 메인 대화 화면으로 이동
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.loginCard} fade-in`}>
        <h1 className={styles.title}>세종대왕 챗봇</h1>
        <p className={styles.subtitle}>교사 및 관리자 로그인</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@school.kr"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            입궐하기 (로그인)
          </button>
        </form>
      </div>
    </main>
  );
}
