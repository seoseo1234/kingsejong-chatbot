"use client";

import { useState } from 'react';
import { GameIcon } from './UiIcons';
import {
  CHAIN_STARTERS,
  INITIAL_QUIZZES,
  TWENTY_CANDIDATES,
  TWENTY_QUESTIONS,
  chooseChainWord,
  chooseTwentyConfirmationQuestion,
  chooseTwentyQuestion,
  getTwentyMatchingCandidates,
  getInitialConsonants,
  normalizeKoreanWord,
  rankTwentyCandidates,
  shuffleItems,
  validateChainWord,
} from '@/lib/hangul-games';
import styles from './HangulGame.module.css';

const MIN_TWENTY_QUESTIONS = 5;
const LAST_INFERENCE_QUESTION = 19;

function getTwentyQuestion(rankedCandidates, askedIds) {
  if (rankedCandidates.length === 0) return null;

  if (!askedIds.includes('living')) {
    return TWENTY_QUESTIONS.find((question) => question.id === 'living');
  }

  const candidateKinds = new Set(rankedCandidates.map((candidate) => candidate.kind));
  const needsFoodCheck = candidateKinds.has('food') && candidateKinds.has('object');
  if (needsFoodCheck && !askedIds.includes('food')) {
    return TWENTY_QUESTIONS.find((question) => question.id === 'food');
  }

  const bestScore = rankedCandidates[0].matchScore ?? 0;
  const closeCandidates = rankedCandidates
    .filter((candidate) => (candidate.matchScore ?? 0) >= bestScore - 4)
    .slice(0, 10);

  return chooseTwentyQuestion(closeCandidates, askedIds)
    ?? chooseTwentyQuestion(rankedCandidates.slice(0, 10), askedIds)
    ?? chooseTwentyConfirmationQuestion(rankedCandidates[0], askedIds);
}

const GAMES = [
  {
    id: 'chain',
    icon: '잇',
    title: '끝말잇기',
    description: '세종대왕과 번갈아 낱말의 끝 글자를 이어 보아요.',
    color: 'red',
  },
  {
    id: 'twenty',
    icon: '20',
    title: '스무고개',
    description: '낱말을 하나 생각하면 세종대왕이 질문으로 맞혀요.',
    color: 'blue',
  },
  {
    id: 'initial',
    icon: 'ㅊㅅ',
    title: '초성 맞히기',
    description: '초성과 힌트를 보고 숨어 있는 일상 낱말을 찾아요.',
    color: 'green',
  },
];

function createChainGame() {
  const starter = CHAIN_STARTERS[Math.floor(Math.random() * CHAIN_STARTERS.length)];
  return {
    messages: [{ speaker: 'king', word: starter }],
    usedWords: [starter],
    requiredStart: starter.at(-1),
    turns: 0,
    status: 'playing',
    feedback: `내가 먼저 ‘${starter}’이라고 했어요. ‘${starter.at(-1)}’으로 시작하는 낱말은 무엇일까요?`,
  };
}

function createTwentyGame() {
  return {
    phase: 'intro',
    candidates: TWENTY_CANDIDATES.map((candidate) => ({ ...candidate, matchScore: 0 })),
    askedIds: [],
    answers: [],
    rejectedWords: [],
    questionCount: 0,
    guess: null,
    feedback: '',
  };
}

function createInitialGame() {
  return {
    questions: shuffleItems(INITIAL_QUIZZES).slice(0, 5),
    index: 0,
    score: 0,
    hintLevel: 0,
    feedback: '',
    answered: false,
    finished: false,
  };
}

export default function HangulGame({ onClose }) {
  const [activeGame, setActiveGame] = useState('menu');
  const [chain, setChain] = useState(createChainGame);
  const [chainInput, setChainInput] = useState('');
  const [twenty, setTwenty] = useState(createTwentyGame);
  const [revealedWord, setRevealedWord] = useState('');
  const [initial, setInitial] = useState(createInitialGame);
  const [initialInput, setInitialInput] = useState('');

  const openGame = (gameId) => {
    if (gameId === 'chain') {
      setChain(createChainGame());
      setChainInput('');
    }
    if (gameId === 'twenty') {
      setTwenty(createTwentyGame());
      setRevealedWord('');
    }
    if (gameId === 'initial') {
      setInitial(createInitialGame());
      setInitialInput('');
    }
    setActiveGame(gameId);
  };

  const submitChainWord = (event) => {
    event.preventDefault();
    if (chain.status !== 'playing') return;

    const word = normalizeKoreanWord(chainInput);
    const error = validateChainWord(word, chain.requiredStart, chain.usedWords);
    if (error) {
      setChain((current) => ({ ...current, feedback: error }));
      return;
    }

    const usedAfterChild = [...chain.usedWords, word];
    const kingWord = chooseChainWord(word.at(-1), usedAfterChild);
    if (!kingWord) {
      setChain((current) => ({
        ...current,
        messages: [...current.messages, { speaker: 'child', word }],
        usedWords: usedAfterChild,
        turns: current.turns + 1,
        status: 'won',
        feedback: `‘${word.at(-1)}’으로 시작하는 낱말이 떠오르지 않는구나. 네가 이겼어요!`,
      }));
      setChainInput('');
      return;
    }

    setChain((current) => ({
      ...current,
      messages: [
        ...current.messages,
        { speaker: 'child', word },
        { speaker: 'king', word: kingWord },
      ],
      usedWords: [...usedAfterChild, kingWord],
      requiredStart: kingWord.at(-1),
      turns: current.turns + 1,
      feedback: `좋아요! 나는 ‘${kingWord}’. 이제 ‘${kingWord.at(-1)}’으로 시작해 보세요.`,
    }));
    setChainInput('');
  };

  const startTwentyQuestions = () => {
    setTwenty({ ...createTwentyGame(), phase: 'question' });
  };

  const currentMatchingCandidates = getTwentyMatchingCandidates(
    twenty.answers,
    twenty.rejectedWords,
  );
  const currentTwentyQuestion = getTwentyQuestion(
    currentMatchingCandidates.length > 0 ? currentMatchingCandidates : twenty.candidates,
    twenty.askedIds,
  );

  const answerTwentyQuestion = (answer) => {
    if (!currentTwentyQuestion || twenty.phase !== 'question') return;
    const nextAnswers = [
      ...twenty.answers,
      { questionId: currentTwentyQuestion.id, answer },
    ];
    const nextCandidates = rankTwentyCandidates(nextAnswers, twenty.rejectedWords);
    const matchingCandidates = getTwentyMatchingCandidates(nextAnswers, twenty.rejectedWords);
    const nextAskedIds = [...twenty.askedIds, currentTwentyQuestion.id];
    const nextCount = twenty.questionCount + 1;
    const nextQuestion = getTwentyQuestion(
      matchingCandidates.length > 0 ? matchingCandidates : nextCandidates,
      nextAskedIds,
    );
    const hasAskedEnough = nextCount >= MIN_TWENTY_QUESTIONS;
    const hasClearAnswer = matchingCandidates.length === 1;
    const shouldGuess = hasClearAnswer && (hasAskedEnough || !nextQuestion);
    const cannotInfer = nextCount >= LAST_INFERENCE_QUESTION || !nextQuestion;

    setTwenty((current) => ({
      ...current,
      candidates: nextCandidates,
      askedIds: nextAskedIds,
      answers: nextAnswers,
      questionCount: nextCount,
      phase: shouldGuess ? 'guess' : cannotInfer ? 'stumped' : 'question',
      guess: shouldGuess ? matchingCandidates[0] : null,
      feedback: answer === 'unknown' ? '괜찮아요. 다른 질문으로 알아볼게요.' : '',
    }));
  };

  const answerTwentyGuess = (isCorrect) => {
    if (isCorrect) {
      setTwenty((current) => ({ ...current, phase: 'won' }));
      return;
    }

    const rejectedWords = [...twenty.rejectedWords, twenty.guess.word];
    const remaining = rankTwentyCandidates(twenty.answers, rejectedWords);
    const nextCount = twenty.questionCount + 1;
    if (remaining.length === 0 || nextCount >= 20) {
      setTwenty((current) => ({
        ...current,
        candidates: remaining,
        questionCount: nextCount,
        phase: 'stumped',
      }));
      return;
    }

    const nextQuestion = getTwentyQuestion(remaining, twenty.askedIds);
    const shouldAskMore = nextCount < LAST_INFERENCE_QUESTION && Boolean(nextQuestion);
    setTwenty((current) => ({
      ...current,
      candidates: remaining,
      rejectedWords,
      questionCount: nextCount,
      phase: shouldAskMore ? 'question' : 'stumped',
      guess: null,
      feedback: '아하, 아니었군요. 조금 더 생각해 볼게요.',
    }));
  };

  const currentInitialQuestion = initial.questions[initial.index];

  const submitInitialAnswer = (event) => {
    event.preventDefault();
    if (initial.answered || initial.finished) return;

    const answer = normalizeKoreanWord(initialInput);
    if (!answer) {
      setInitial((current) => ({ ...current, feedback: '생각한 낱말을 입력해 주세요.' }));
      return;
    }

    if (answer === currentInitialQuestion.answer) {
      setInitial((current) => ({
        ...current,
        score: current.score + 1,
        feedback: '정답이에요! 초성을 아주 잘 읽었어요.',
        answered: true,
      }));
      return;
    }

    setInitial((current) => ({
      ...current,
      hintLevel: Math.min(2, current.hintLevel + 1),
      feedback: '아직 아니에요. 힌트를 보고 다시 생각해 보세요.',
    }));
    setInitialInput('');
  };

  const nextInitialQuestion = () => {
    if (initial.index === initial.questions.length - 1) {
      setInitial((current) => ({ ...current, finished: true }));
      return;
    }
    setInitial((current) => ({
      ...current,
      index: current.index + 1,
      hintLevel: 0,
      feedback: '',
      answered: false,
    }));
    setInitialInput('');
  };

  const showInitialHint = () => {
    setInitial((current) => ({
      ...current,
      hintLevel: Math.min(2, current.hintLevel + 1),
      feedback: '',
    }));
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
              <p>낱말로 생각을 키우는</p>
              <h2 id="game-title">한글 놀이</h2>
            </div>
          </div>
          <div className={styles.headerActions}>
            {activeGame !== 'menu' && (
              <button type="button" className={styles.backBtn} onClick={() => setActiveGame('menu')}>
                놀이 고르기
              </button>
            )}
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="한글 놀이 닫기">
              닫기
            </button>
          </div>
        </header>

        {activeGame === 'menu' && (
          <div className={styles.menuBody}>
            <div className={styles.welcome}>
              <span aria-hidden="true">아</span>
              <div>
                <h3>어떤 말놀이를 해 볼까요?</h3>
                <p>틀려도 괜찮아요. 천천히 생각하고 재미있게 말해 보아요.</p>
              </div>
            </div>
            <div className={styles.gameGrid}>
              {GAMES.map((game) => (
                <button
                  type="button"
                  key={game.id}
                  className={`${styles.gameCard} ${styles[game.color]}`}
                  onClick={() => openGame(game.id)}
                >
                  <span className={styles.gameBadge} aria-hidden="true">{game.icon}</span>
                  <strong>{game.title}</strong>
                  <span>{game.description}</span>
                  <em>놀이 시작 →</em>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGame === 'chain' && (
          <div className={styles.gameBody}>
            <div className={styles.gameHeading}>
              <span className={`${styles.gameBadge} ${styles.red}`}>잇</span>
              <div>
                <h3>끝말잇기</h3>
                <p>앞 낱말의 마지막 글자로 새 낱말을 시작해요.</p>
              </div>
            </div>

            <div className={styles.wordTrail} aria-label="끝말잇기 낱말 기록">
              {chain.messages.map((message, index) => (
                <div key={`${message.word}-${index}`} className={`${styles.wordTurn} ${styles[message.speaker]}`}>
                  <span>{message.speaker === 'king' ? '세종대왕' : '나'}</span>
                  <strong>{message.word}</strong>
                </div>
              ))}
            </div>

            <div className={styles.feedback} role="status">{chain.feedback}</div>
            {chain.turns >= 5 && chain.status === 'playing' && (
              <p className={styles.streak}>별 다섯 개만큼 이어 갔어요! 아주 훌륭해요.</p>
            )}

            {chain.status === 'playing' ? (
              <form className={styles.answerForm} onSubmit={submitChainWord}>
                <label htmlFor="chain-word">
                  <b>{chain.requiredStart}</b>으로 시작하는 낱말
                </label>
                <div className={styles.inputRow}>
                  <input
                    id="chain-word"
                    value={chainInput}
                    onChange={(event) => setChainInput(event.target.value)}
                    maxLength={10}
                    autoComplete="off"
                    placeholder={`${chain.requiredStart}으로 시작해요`}
                  />
                  <button type="submit" className={styles.primaryBtn}>말하기</button>
                </div>
              </form>
            ) : (
              <button type="button" className={styles.primaryBtn} onClick={() => openGame('chain')}>
                다시 하기
              </button>
            )}
          </div>
        )}

        {activeGame === 'twenty' && (
          <div className={styles.gameBody}>
            <div className={styles.gameHeading}>
              <span className={`${styles.gameBadge} ${styles.blue}`}>20</span>
              <div>
                <h3>스무고개</h3>
                <p>아이가 생각하고 세종대왕이 맞혀요.</p>
              </div>
            </div>

            {twenty.phase === 'intro' && (
              <div className={styles.instructionCard}>
                <span className={styles.thought} aria-hidden="true">?</span>
                <h4>낱말 하나를 마음속으로 정해 주세요.</h4>
                <p>동물, 음식, 물건처럼 우리 주변에서 자주 보는 낱말이면 좋아요. 소리 내어 말하면 안 돼요!</p>
                <button type="button" className={styles.primaryBtn} onClick={startTwentyQuestions}>
                  생각했어요
                </button>
              </div>
            )}

            {twenty.phase === 'question' && currentTwentyQuestion && (
              <div className={styles.twentyStage}>
                <div className={styles.questionCount}>{twenty.questionCount + 1}번째 질문 · 최대 20번</div>
                <div className={styles.kingQuestion}>
                  <span aria-hidden="true">세종</span>
                  <strong>{currentTwentyQuestion.text}</strong>
                </div>
                {twenty.feedback && <p className={styles.smallFeedback}>{twenty.feedback}</p>}
                <div className={styles.answerChoices}>
                  <button type="button" onClick={() => answerTwentyQuestion('yes')}>예</button>
                  <button type="button" onClick={() => answerTwentyQuestion('no')}>아니요</button>
                  <button type="button" onClick={() => answerTwentyQuestion('unknown')}>잘 모르겠어요</button>
                </div>
              </div>
            )}

            {twenty.phase === 'guess' && (
              <div className={styles.instructionCard}>
                <span className={styles.thought} aria-hidden="true">!</span>
                <p>{twenty.questionCount + 1}번째 질문</p>
                <h4>혹시 <b>‘{twenty.guess?.word}’</b>인가요?</h4>
                <div className={styles.answerChoices}>
                  <button type="button" onClick={() => answerTwentyGuess(true)}>맞아요!</button>
                  <button type="button" onClick={() => answerTwentyGuess(false)}>아니에요</button>
                </div>
              </div>
            )}

            {twenty.phase === 'won' && (
              <div className={styles.result}>
                <span className={styles.resultLabel}>맞혔어요</span>
                <strong>마음속 낱말은 ‘{twenty.guess?.word}’!</strong>
                <p>{twenty.questionCount + 1}번 만에 알아냈어요. 대답을 참 잘해 주었어요.</p>
                <button type="button" className={styles.primaryBtn} onClick={() => openGame('twenty')}>다시 하기</button>
              </div>
            )}

            {twenty.phase === 'stumped' && (
              <div className={styles.result}>
                <span className={styles.resultLabel}>아이가 이겼어요</span>
                <strong>이번 낱말은 정말 어렵구나!</strong>
                <p>어떤 낱말이었는지 세종대왕에게 알려 줄래요?</p>
                <input
                  className={styles.revealInput}
                  value={revealedWord}
                  onChange={(event) => setRevealedWord(event.target.value)}
                  maxLength={15}
                  placeholder="정답 낱말"
                  aria-label="생각했던 낱말"
                />
                {revealedWord && <p className={styles.revealMessage}>‘{revealedWord}’였군요! 다음에는 꼭 기억할게요.</p>}
                <button type="button" className={styles.primaryBtn} onClick={() => openGame('twenty')}>다시 하기</button>
              </div>
            )}
          </div>
        )}

        {activeGame === 'initial' && (
          <div className={styles.gameBody}>
            <div className={styles.gameHeading}>
              <span className={`${styles.gameBadge} ${styles.green}`}>ㅊㅅ</span>
              <div>
                <h3>초성 맞히기</h3>
                <p>첫소리를 보고 숨어 있는 낱말을 찾아요.</p>
              </div>
            </div>

            {initial.finished ? (
              <div className={styles.result}>
                <span className={styles.resultLabel}>놀이 완료</span>
                <strong>5문제 중 {initial.score}문제를 맞혔어요!</strong>
                <p>초성에서 낱말을 떠올리는 힘이 쑥쑥 자랐어요.</p>
                <button type="button" className={styles.primaryBtn} onClick={() => openGame('initial')}>다시 하기</button>
              </div>
            ) : (
              <>
                <div className={styles.progressRow}>
                  <span>{initial.index + 1} / {initial.questions.length}</span>
                  <span>점수 {initial.score}</span>
                </div>
                <div className={styles.progressTrack} aria-hidden="true">
                  <span style={{ width: `${((initial.index + 1) / initial.questions.length) * 100}%` }} />
                </div>
                <div className={styles.initialPuzzle}>
                  <span>이 초성은 어떤 낱말일까요?</span>
                  <strong>{getInitialConsonants(currentInitialQuestion.answer)}</strong>
                </div>

                {initial.hintLevel > 0 && (
                  <div className={styles.hints}>
                    {currentInitialQuestion.hints.slice(0, initial.hintLevel).map((hint, index) => (
                      <p key={hint}><b>힌트 {index + 1}</b>{hint}</p>
                    ))}
                  </div>
                )}

                {!initial.answered ? (
                  <>
                    <form className={styles.answerForm} onSubmit={submitInitialAnswer}>
                      <label htmlFor="initial-word">정답 낱말</label>
                      <div className={styles.inputRow}>
                        <input
                          id="initial-word"
                          value={initialInput}
                          onChange={(event) => setInitialInput(event.target.value)}
                          maxLength={12}
                          autoComplete="off"
                          placeholder="낱말을 써 보세요"
                        />
                        <button type="submit" className={styles.primaryBtn}>확인</button>
                      </div>
                    </form>
                    {initial.hintLevel < 2 && (
                      <button type="button" className={styles.hintBtn} onClick={showInitialHint}>
                        힌트 하나 보기
                      </button>
                    )}
                  </>
                ) : (
                  <button type="button" className={styles.primaryBtn} onClick={nextInitialQuestion}>
                    {initial.index === initial.questions.length - 1 ? '결과 보기' : '다음 문제'}
                  </button>
                )}
                {initial.feedback && <div className={styles.feedback} role="status">{initial.feedback}</div>}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
