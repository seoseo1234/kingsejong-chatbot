"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CharacterView from '@/components/CharacterView';
import ChatBubble from '@/components/ChatBubble';
import SuggestionChips, { DEFAULT_CHIPS } from '@/components/SuggestionChips';
import LockScreen from '@/components/LockScreen';
import EthicsGate from '@/components/EthicsGate';
import SidebarMenu from '@/components/SidebarMenu';
import AchievementsModal from '@/components/AchievementsModal';
import FunFactsModal from '@/components/FunFactsModal';
import HangulGame from '@/components/HangulGame';
import { MicIcon, SendIcon } from '@/components/UiIcons';
import styles from './page.module.css';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '반갑다, 2학년 학생들아! 짐은 조선의 4대 왕 세종이로다. 나에게 궁금한 것이 있느냐?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showEthicsGate, setShowEthicsGate] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFunFacts, setShowFunFacts] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_CHIPS);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const agreed = sessionStorage.getItem('ethics_agreed');
      if (agreed === 'true') {
        setShowEthicsGate(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAgreeEthics = () => {
    sessionStorage.setItem('ethics_agreed', 'true');
    setShowEthicsGate(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('이 브라우저에서는 음성 입력을 지원하지 않습니다.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => {
      setVoiceStatus('말씀해 주세요. 듣고 있습니다.');
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setInput(transcript);
        setVoiceStatus('들은 내용을 확인하고 보내기 버튼을 눌러 주세요.');
      }
    };
    recognition.onerror = () => setVoiceStatus('음성을 알아듣지 못했습니다. 다시 시도해 주세요.');
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      setVoiceStatus('이 브라우저에서는 읽어주기를 지원하지 않습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88;
    utterance.pitch = 0.95;
    const koreanVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith('ko'));
    if (koreanVoice) utterance.voice = koreanVoice;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('세종대왕님의 답변을 읽고 있습니다.');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus('');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus('답변을 읽지 못했습니다.');
    };
    window.speechSynthesis.speak(utterance);
  };

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
          setMessages(messages);
          setIsLocked(true);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: '미안하구나, 잠깐 집중을 잃었단다. 다시 말해주겠느냐?' }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          sources: Array.isArray(data.sources) ? data.sources : [],
        }]);
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '에구, 통신이 원활하지 않구나.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinish = async () => {
    // 요약 페이지로 상태 전달 (브라우저 세션이 끝나면 자동 삭제)
    sessionStorage.setItem('chat_history', JSON.stringify(messages));
    router.push('/summary');
  };

  return (
    <main className={styles.mainContainer}>
      {showEthicsGate && <EthicsGate onAgree={handleAgreeEthics} />}
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
      {showFunFacts && <FunFactsModal onClose={() => setShowFunFacts(false)} />}
      {showGame && <HangulGame onClose={() => setShowGame(false)} />}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span>세종대왕과 함께하는</span>
            <strong>한글 역사 교실</strong>
          </div>
          <div className={styles.topNav}>
            <button onClick={handleFinish} className={styles.finishBtn}>대화 마치기</button>
          </div>
        </header>

        <div className={styles.tabletScreen}>
          <div className={styles.characterArea}>
            <CharacterView state={isTyping ? 'thinking' : isSpeaking ? 'speaking' : 'idle'} />
          </div>
          
          <div className={styles.chatArea}>
            <div className={styles.chatContainer} ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  onSpeak={handleSpeak}
                />
              ))}
              {isTyping && <div className={styles.typingIndicator}>세종대왕님이 글을 쓰고 계십니다...</div>}
            </div>

            <div className={styles.inputArea}>
              <SuggestionChips
                suggestions={suggestions}
                onChipClick={(text) => handleSend(text)}
                disabled={isTyping || isLocked}
              />
              <div className={styles.inputFormWrapper}>
                <button
                  type="button"
                  className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                  onClick={handleVoiceInput}
                  disabled={isTyping || isLocked}
                  aria-label={isListening ? '음성 입력 멈추기' : '음성으로 질문하기'}
                  aria-pressed={isListening}
                >
                  <MicIcon />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="여기에 글을 써주세요..."
                  aria-label="세종대왕에게 질문하기"
                  className={styles.input}
                  disabled={isTyping}
                />
                <button onClick={() => handleSend()} disabled={isTyping || !input.trim()} className={styles.sendBtn}>
                  <span>보내기</span>
                  <SendIcon />
                </button>
              </div>
              <p className={styles.voiceStatus} role="status">{voiceStatus}</p>
            </div>
          </div>
          <div className={styles.toolDock}>
            <SidebarMenu
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenFunFacts={() => setShowFunFacts(true)}
              onOpenGame={() => setShowGame(true)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
