"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import CharacterView from '@/components/CharacterView';
import ChatBubble from '@/components/ChatBubble';
import SuggestionChips from '@/components/SuggestionChips';
import LockScreen from '@/components/LockScreen';
import styles from './page.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '반갑다, 꼬마야! 짐은 조선의 4대 왕 세종이로다. 나에게 궁금한 것이 있느냐?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  
  const chatContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping || isLocked) return;
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages,
          message: text
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'SAFETY_BLOCKED') {
          setIsLocked(true);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: '미안하구나, 잠깐 집중을 잃었단다. 다시 말해주겠느냐?' }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '에구, 통신이 원활하지 않구나.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinish = async () => {
    // 요약 페이지로 상태 전달 (localStorage 임시 사용)
    localStorage.setItem('chat_history', JSON.stringify(messages));
    router.push('/summary');
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingAuth) return <div style={{textAlign: 'center', padding: '50px'}}>조선으로 가는 중...</div>;
  if (!user) return null;

  return (
    <main className={styles.main}>
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
      
      <header className={styles.header}>
        <button onClick={handleFinish} className={styles.finishBtn}>대화 마치기 (요약)</button>
        <CharacterView state={isTyping ? 'thinking' : 'idle'} />
        <button onClick={handleLogout} className={styles.logoutBtn}>퇴궐 (로그아웃)</button>
      </header>

      <div className={styles.chatSide}>
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} role={msg.role} content={msg.content} />
          ))}
          {isTyping && <ChatBubble role="assistant" content="..." />}
        </div>

        <SuggestionChips 
          onChipClick={(text) => handleSend(text)} 
          disabled={isTyping || isLocked}
        />

        <form 
          className={styles.inputArea} 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="세종대왕님께 물어보세요!"
            className={styles.input}
            disabled={isTyping || isLocked}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isTyping || isLocked}>
            ➤
          </button>
        </form>
      </div>
    </main>
  );
}
