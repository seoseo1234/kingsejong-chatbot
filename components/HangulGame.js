"use client";

import { useState } from 'react';
import { GameIcon } from './UiIcons';
import styles from './HangulGame.module.css';

const QUESTIONS = [
  {
    prompt: '초성 ㅎㄱ에 알맞은 낱말은 무엇일까요?',
    choices: ['한글', '훈민정음', '해시계'],
    answer: '한글',
    hint: '우리가 지금 읽고 쓰는 글자의 이름이에요.',
  },
  {
    prompt: '“백성을 가르치는 바른 소리”라는 뜻을 가진 이름은?',
    choices: ['집현전', '훈민정음', '앙부일구'],
    answer: '훈민정음',
    hint: '세종대왕이 새 글자에 붙인 이름이에요.',
  },
  {
    prompt: '자음 ㄱ과 모음 ㅏ를 합치면 어떤 글자가 될까요?',
    choices: ['거', '가', '고'],
    answer: '가',
    hint: 'ㄱ 오른쪽에 ㅏ를 붙여 보세요.',
  },
  {
    prompt: '초성 ㅅㅈㄷㅇ에 알맞은 인물은 누구일까요?',
    choices: ['세종대왕', '장영실', '이순신'],
    answer: '세종대왕',
    hint: '한글을 만든 조선의 네 번째 왕이에요.',
  },
  {
    prompt: '훈민정음의 기본 자음은 무엇을 본떠 만들었을까요?',
    choices: ['꽃과 나무', '발음 기관', '별자리'],
    answer: '발음 기관',
    hint: '소리를 낼 때 움직이는 입과 혀의 모양을 살펴보세요.',
  },
];

export default function HangulGame({ onClose }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[questionIndex];
  const isCorrect = selected === question.answer;

  const selectChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.answer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelected('');
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelected('');
    setScore(0);
    setFinished(false);
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.icon}><GameIcon size={24} /></span>
            <div>
              <p>초성으로 배우는</p>
              <h2 id="game-title">한글 놀이</h2>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="한글 놀이 닫기">
            닫기
          </button>
        </header>

        {finished ? (
          <div className={styles.result}>
            <span className={styles.resultLabel}>놀이 완료</span>
            <strong>{QUESTIONS.length}문제 중 {score}문제를 맞혔어요</strong>
            <p>{score === QUESTIONS.length ? '모두 맞혔어요. 한글 박사로구나!' : '틀린 문제도 다시 풀면 금방 익힐 수 있어요.'}</p>
            <div className={styles.resultActions}>
              <button type="button" onClick={restart}>다시 풀기</button>
              <button type="button" className={styles.primaryBtn} onClick={onClose}>대화로 돌아가기</button>
            </div>
          </div>
        ) : (
          <div className={styles.gameBody}>
            <div className={styles.progressRow}>
              <span>{questionIndex + 1} / {QUESTIONS.length}</span>
              <span>점수 {score}</span>
            </div>
            <div className={styles.progressTrack} aria-hidden="true">
              <span style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} />
            </div>

            <h3>{question.prompt}</h3>
            <p className={styles.hint}>{question.hint}</p>

            <div className={styles.choices}>
              {question.choices.map((choice) => {
                const stateClass = selected
                  ? choice === question.answer
                    ? styles.correct
                    : choice === selected
                      ? styles.wrong
                      : styles.dimmed
                  : '';
                return (
                  <button
                    type="button"
                    key={choice}
                    className={`${styles.choice} ${stateClass}`}
                    onClick={() => selectChoice(choice)}
                    disabled={Boolean(selected)}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className={styles.feedback} role="status">
                <p>{isCorrect ? '정답이에요. 아주 잘했어요!' : `정답은 “${question.answer}”이에요.`}</p>
                <button type="button" className={styles.primaryBtn} onClick={nextQuestion}>
                  {questionIndex === QUESTIONS.length - 1 ? '결과 보기' : '다음 문제'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
