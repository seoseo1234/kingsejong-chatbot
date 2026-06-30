"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// 로그인 페이지의 스타일을 재사용합니다.
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // 1. 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. 닉네임 설정
      await updateProfile(userCredential.user, {
        displayName: nickname
      });

      // 3. 메인으로 이동
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(`등록 실패: ${err.code || err.message}`);
    }
  };

  const handleGoBack = () => {
    router.push('/login');
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.tabletScreen}>
        
        <div className={styles.titleSection}>
          <div className={styles.kingIcon}>
            <Image src="/sejong-icon.png" alt="세종대왕" width={100} height={100} />
          </div>
          <h1 className={styles.title}>
            새 어린이 등록
          </h1>
        </div>

        <div className={styles.loginCard}>
          <h2 className={styles.subtitle}>반가워! 네 이름은 뭐니?</h2>
          
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📧</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="이메일 (ID)"
                  required
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="비밀번호"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✏️</span>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={styles.input}
                  placeholder="사용할 이름 (닉네임)"
                  required
                />
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.registerBtn}>
                등록하기
              </button>
              
              <button type="button" onClick={handleGoBack} className={styles.guestBtn}>
                뒤로 가기
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
