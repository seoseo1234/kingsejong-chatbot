"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      await signInAnonymously(auth);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(`둘러보기 실패: ${err.code || err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(`구글 로그인 실패: ${err.code || err.message}`);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.tabletScreen}>
        
        <div className={styles.titleSection}>
          <div className={styles.kingIcon}>
            <Image src="/sejong-icon.png" alt="세종대왕" width={100} height={100} />
          </div>
          <h1 className={styles.title}>
            <span className={styles.crown}>👑</span>
            세종대왕님과<br/>함께하는 한글 여행
          </h1>
        </div>

        <div className={styles.loginCard}>
          <h2 className={styles.subtitle}>📚 한글 여행을 시작해 볼까?</h2>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✏️</span>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="어린이 이름 (이메일 ID)"
                  required
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="비밀번호"
                  required
                />
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.loginBtn}>
                로그인
              </button>
              
              <button type="button" onClick={handleRegister} className={styles.registerBtn}>
                새 어린이 등록
              </button>

              <button type="button" onClick={handleGuestLogin} className={styles.guestBtn}>
                가입 안하고 둘러보기 👀
              </button>
              
              <button type="button" onClick={handleGoogleLogin} className={styles.googleBtn}>
                <span className={styles.googleIcon}>G</span> Google 계정으로 로그인
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
