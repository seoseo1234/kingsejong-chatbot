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

const MALE_VOICE_HINTS = ['injoon', 'hyunsu', 'joon', 'male', '남성'];
const NATURAL_VOICE_HINTS = ['natural', 'neural', 'online', 'premium'];
const FEMALE_VOICE_HINTS = ['sunhi', 'heami', 'yuna', 'female', '여성'];

function selectNarratorVoice(voices) {
  return voices
    .filter((voice) => voice.lang.toLowerCase().startsWith('ko'))
    .map((voice) => {
      const name = voice.name.toLowerCase();
      const naturalScore = NATURAL_VOICE_HINTS.some((hint) => name.includes(hint)) ? 80 : 0;
      const maleScore = MALE_VOICE_HINTS.some((hint) => name.includes(hint)) ? 60 : 0;
      const femalePenalty = FEMALE_VOICE_HINTS.some((hint) => name.includes(hint)) ? -40 : 0;
      const onlineScore = voice.localService ? 0 : 15;
      return { voice, score: naturalScore + maleScore + femalePenalty + onlineScore };
    })
    .sort((a, b) => b.score - a.score)[0]?.voice;
}

async function loadSpeechVoices(synthesis) {
  const available = synthesis.getVoices();
  if (available.length > 0) return available;

  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      synthesis.removeEventListener?.('voiceschanged', finish);
      resolve(synthesis.getVoices());
    };
    synthesis.addEventListener?.('voiceschanged', finish, { once: true });
    window.setTimeout(finish, 700);
  });
}

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
  const [isPresentingAnswer, setIsPresentingAnswer] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const ttsAbortRef = useRef(null);
  const audioCacheRef = useRef(new Map());
  const presentationTimerRef = useRef(null);
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
    ttsAbortRef.current?.abort();
    window.clearTimeout(presentationTimerRef.current);
    audioRef.current?.pause();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
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

  const speakWithBrowserVoice = async (text, isFallback = false) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setVoiceStatus('이 브라우저에서는 읽어주기를 지원하지 않습니다.');
      return;
    }

    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    setVoiceStatus(isFallback
      ? 'Gemini 음성을 불러오지 못해 기기의 기본 목소리로 읽습니다.'
      : '세종대왕님의 목소리를 준비하고 있습니다.');

    const voices = await loadSpeechVoices(synthesis);
    const narratorVoice = selectNarratorVoice(voices);
    const spokenText = text
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*/g, '$1  ')
      .trim();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'ko-KR';
    utterance.rate = narratorVoice && NATURAL_VOICE_HINTS.some(
      (hint) => narratorVoice.name.toLowerCase().includes(hint),
    ) ? 0.9 : 0.82;
    utterance.pitch = 0.78;
    utterance.volume = 1;
    if (narratorVoice) utterance.voice = narratorVoice;
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
    synthesis.speak(utterance);
  };

  const stopGeneratedAudio = () => {
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const handleSpeak = async (text) => {
    stopGeneratedAudio();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setVoiceStatus('자연스러운 세종대왕 목소리를 준비하고 있습니다.');

    const controller = new AbortController();
    ttsAbortRef.current = controller;

    try {
      let audioBlob = audioCacheRef.current.get(text);

      if (!audioBlob) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Gemini TTS request failed');

        audioBlob = await response.blob();
        if (!audioBlob.type.startsWith('audio/')) throw new Error('Invalid audio response');

        if (audioCacheRef.current.size >= 8) {
          const oldestKey = audioCacheRef.current.keys().next().value;
          audioCacheRef.current.delete(oldestKey);
        }
        audioCacheRef.current.set(text, audioBlob);
      }

      if (controller.signal.aborted) return;

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audioUrlRef.current = audioUrl;
      ttsAbortRef.current = null;

      audio.onplay = () => {
        setIsSpeaking(true);
        setVoiceStatus('세종대왕님의 목소리로 읽고 있습니다.');
      };
      audio.onended = () => {
        stopGeneratedAudio();
        setIsSpeaking(false);
        setVoiceStatus('');
      };
      audio.onerror = () => {
        stopGeneratedAudio();
        setIsSpeaking(false);
        setVoiceStatus('음성을 재생하지 못했습니다. 다시 눌러주세요.');
      };

      await audio.play();
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.warn('Gemini TTS 재생 실패, 브라우저 음성으로 전환합니다.', error);
      stopGeneratedAudio();
      await speakWithBrowserVoice(text, true);
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping || isLocked) return;

    window.clearTimeout(presentationTimerRef.current);
    setIsPresentingAnswer(false);
    
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
        window.clearTimeout(presentationTimerRef.current);
        setIsPresentingAnswer(true);
        const presentationDuration = Math.min(6000, Math.max(2400, data.response.length * 35));
        presentationTimerRef.current = window.setTimeout(
          () => setIsPresentingAnswer(false),
          presentationDuration,
        );
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
        void handleSpeak(data.response);
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
            <CharacterView
              state={isSpeaking || isPresentingAnswer ? 'speaking' : isTyping ? 'thinking' : 'idle'}
            />
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
