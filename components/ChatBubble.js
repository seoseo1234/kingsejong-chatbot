"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SpeakerIcon } from './UiIcons';
import { HARD_WORDS, splitHardWords } from '@/lib/hard-words';
import styles from './ChatBubble.module.css';

const VIEWPORT_MARGIN = 12;
const TOOLTIP_GAP = 10;

// 어려운 낱말: 누르면 풀이가 열리고, 다시 누르거나 다른 곳을 누르면 닫힌다. 마우스는 올리기만 해도 보인다.
// 채팅창 스크롤 영역에 가려지지 않도록 풀이는 body 에 띄운다.
function HardWord({ word }) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipId = useId();
  const isOpen = isPinned || isHovered;

  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const { width, height } = tooltip.getBoundingClientRect();
    const center = trigger.left + trigger.width / 2;
    const left = Math.min(
      Math.max(center - width / 2, VIEWPORT_MARGIN),
      window.innerWidth - width - VIEWPORT_MARGIN,
    );
    const placeBelow = trigger.top - height - TOOLTIP_GAP < VIEWPORT_MARGIN;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${placeBelow ? trigger.bottom + TOOLTIP_GAP : trigger.top - height - TOOLTIP_GAP}px`;
    tooltip.style.setProperty('--arrow-left', `${center - left}px`);
    tooltip.dataset.placement = placeBelow ? 'below' : 'above';
    tooltip.style.visibility = 'visible';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const close = () => {
      setIsPinned(false);
      setIsHovered(false);
    };
    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || tooltipRef.current?.contains(event.target)) return;
      close();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.hardWord} ${isOpen ? styles.hardWordOpen : ''}`}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        onClick={() => {
          setIsPinned((pinned) => !pinned);
          setIsHovered(false);
        }}
        onPointerEnter={(event) => event.pointerType === 'mouse' && setIsHovered(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setIsHovered(false)}
      >
        {word}
      </button>
      {isOpen && createPortal(
        <span ref={tooltipRef} id={tooltipId} role="tooltip" className={styles.tooltip}>
          <strong>{word}</strong>
          {HARD_WORDS[word]}
        </span>,
        document.body,
      )}
    </>
  );
}

export default function ChatBubble({ role, content, sources = [], onSpeak }) {
  const isUser = role === 'user';

  const renderContent = () => {
    if (isUser) return content;

    return splitHardWords(content).map((part, index) => (
      part.word ? <HardWord key={index} word={part.word} /> : part.text
    ));
  };

  return (
    <div className={`${styles.bubbleContainer} ${isUser ? styles.userContainer : styles.assistantContainer}`}>
      <div className={styles.messageBlock}>
        <div className={styles.messageLabel}>{isUser ? '나' : '세종대왕'}</div>
        <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
          {renderContent()}
        </div>
        {!isUser && (
          <div className={styles.messageTools}>
            <button type="button" onClick={() => onSpeak?.(content)} className={styles.speakBtn}>
              <SpeakerIcon />
              다시 듣기
            </button>
            {sources.length > 0 && (
              <div className={styles.sources}>
                <span>확인한 자료</span>
                {sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
