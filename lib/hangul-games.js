const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const INITIALS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

export const CHAIN_WORDS = [
  '가방', '가족', '가지', '가위', '가을', '간식', '감자', '강물',
  '개나리', '개미', '거울', '겨울', '고기', '고래', '고무', '고양이',
  '과일', '과자', '교실', '구름', '기린', '기차', '김밥', '꽃밭', '나무',
  '나라', '나비', '나팔', '낙엽', '내일', '냉면', '노래', '놀이터',
  '눈물', '다람쥐', '다리', '달력', '달빛', '도서관', '도토리', '동물',
  '라디오', '리본', '마늘', '마음', '마차', '모자', '무지개', '문어',
  '물고기', '미소', '미술', '미역', '바다', '바람', '바위', '바지',
  '박물관', '방울', '배추', '버스', '보리', '부엌', '비누', '비행기',
  '사과', '사람', '사슴', '사자', '산책', '새우', '선물', '소나무',
  '소리', '소방차', '수박', '수영', '시계', '시장', '식탁', '실내',
  '아기', '아침', '아이', '안경', '약속', '양말', '어깨', '얼굴',
  '여우', '연필', '오리', '우산', '우유', '운동', '음악', '의자',
  '이불', '인형', '자동차', '자두', '자리', '자전거', '장갑', '저녁',
  '주머니', '지도', '지우개', '차례', '차표', '책상', '친구', '카메라',
  '토끼', '토마토', '파도', '파랑', '파리', '포도', '표범', '피아노',
  '하늘', '하루', '하마', '학교', '한복', '호랑이', '화분', '휴지',
  '늘보', '끼니', '밭일', '밤하늘', '봄비', '불꽃', '빗물', '악기',
  '엽서', '요리', '원숭이', '유리', '입구', '주스', '코끼리', '태양',
];

export const CHAIN_STARTERS = ['학교', '바다', '사과', '하늘', '나무'];

export function normalizeKoreanWord(value) {
  return value.normalize('NFKC').replace(/\s+/g, '').trim();
}

export function validateChainWord(word, requiredStart, usedWords) {
  if (!word) return '낱말을 입력해 주세요.';
  if (!/^[가-힣]{2,10}$/.test(word)) return '두 글자 이상의 한글 낱말을 써 주세요.';
  if (requiredStart && word[0] !== requiredStart) {
    return `‘${requiredStart}’으로 시작하는 낱말을 생각해 보세요.`;
  }
  if (usedWords.includes(word)) return '이미 나온 낱말이에요. 다른 낱말을 찾아볼까요?';
  return '';
}

export function chooseChainWord(requiredStart, usedWords) {
  const available = CHAIN_WORDS.filter(
    (word) => word[0] === requiredStart && !usedWords.includes(word),
  );
  if (available.length === 0) return null;

  const ranked = available.map((word) => ({
    word,
    nextCount: CHAIN_WORDS.filter(
      (candidate) => candidate[0] === word.at(-1) && !usedWords.includes(candidate),
    ).length,
  })).sort((a, b) => b.nextCount - a.nextCount);

  const bestCount = ranked[0].nextCount;
  const best = ranked.filter((item) => item.nextCount === bestCount);
  return best[Math.floor(Math.random() * best.length)].word;
}

export function getInitialConsonants(word) {
  return [...word].map((char) => {
    const code = char.charCodeAt(0);
    if (code < HANGUL_BASE || code > HANGUL_END) return char;
    return INITIALS[Math.floor((code - HANGUL_BASE) / 588)];
  }).join(' ');
}

export const INITIAL_QUIZZES = [
  { answer: '무지개', hints: ['비가 온 뒤 하늘에서 볼 수 있어요.', '여러 가지 빛깔로 보여요.'] },
  { answer: '고양이', hints: ['수염이 있고 발소리가 조용해요.', '“야옹” 하고 울어요.'] },
  { answer: '자전거', hints: ['두 발로 힘차게 페달을 밟아요.', '바퀴가 두 개 있어요.'] },
  { answer: '도서관', hints: ['조용히 해야 하는 곳이에요.', '책을 읽거나 빌릴 수 있어요.'] },
  { answer: '소방차', hints: ['위험한 곳에 빠르게 달려가요.', '불을 끄는 사람들이 타요.'] },
  { answer: '해바라기', hints: ['키가 크고 노란 꽃이에요.', '해를 바라보는 것 같은 이름이에요.'] },
  { answer: '김밥', hints: ['김으로 밥과 여러 재료를 말아요.', '동그랗게 잘라 먹는 음식이에요.'] },
  { answer: '놀이터', hints: ['친구들과 뛰어놀 수 있는 곳이에요.', '그네와 미끄럼틀이 있어요.'] },
  { answer: '우산', hints: ['손잡이를 잡고 펼쳐요.', '비가 올 때 몸이 젖지 않게 해요.'] },
  { answer: '강아지', hints: ['사람과 친하게 지내는 동물이에요.', '“멍멍” 하고 짖어요.'] },
];

export const TWENTY_CANDIDATES = [
  { word: '강아지', kind: 'animal', living: true, pet: true, land: true, water: false, flies: false, big: false, sound: true, barks: true, food: false, sweet: false, fruit: false, hot: false, tool: false, electric: false, wearable: false, school: false, wheels: false },
  { word: '고양이', kind: 'animal', living: true, pet: true, land: true, water: false, flies: false, big: false, sound: true, meows: true },
  { word: '코끼리', kind: 'animal', living: true, pet: false, land: true, water: false, flies: false, big: true, sound: true, trunk: true },
  { word: '기린', kind: 'animal', living: true, pet: false, land: true, water: false, flies: false, big: true, sound: false, longNeck: true },
  { word: '토끼', kind: 'animal', living: true, pet: true, land: true, water: false, flies: false, big: false, sound: false },
  { word: '호랑이', kind: 'animal', living: true, pet: false, land: true, water: false, flies: false, big: true, sound: true, stripes: true },
  { word: '돌고래', kind: 'animal', living: true, pet: false, land: false, water: true, flies: false, big: true, sound: true },
  { word: '문어', kind: 'animal', living: true, pet: false, land: false, water: true, flies: false, big: false, sound: false, eightArms: true },
  { word: '독수리', kind: 'animal', living: true, pet: false, land: false, water: false, flies: true, big: true, sound: true },
  { word: '나비', kind: 'animal', living: true, pet: false, land: false, water: false, flies: true, big: false, sound: false },
  { word: '사과', kind: 'food', living: false, food: true, sweet: true, fruit: true, hot: false, round: true },
  { word: '수박', kind: 'food', living: false, food: true, sweet: true, fruit: true, hot: false, round: true, big: true },
  { word: '바나나', kind: 'food', living: false, food: true, sweet: true, fruit: true, hot: false, round: false },
  { word: '김밥', kind: 'food', living: false, food: true, sweet: false, fruit: false, hot: false, round: true },
  { word: '떡볶이', kind: 'food', living: false, food: true, sweet: false, fruit: false, hot: true, round: false, riceCake: true },
  { word: '아이스크림', kind: 'food', living: false, food: true, sweet: true, fruit: false, hot: false, cold: true },
  { word: '라면', kind: 'food', living: false, food: true, sweet: false, fruit: false, hot: true, round: false, noodles: true },
  { word: '우산', kind: 'object', living: false, food: false, tool: true, electric: false, wearable: false, school: false, wheels: false, handheld: true },
  { word: '연필', kind: 'object', living: false, food: false, tool: true, electric: false, wearable: false, school: true, wheels: false, handheld: true },
  { word: '책', kind: 'object', living: false, food: false, tool: false, electric: false, wearable: false, school: true, wheels: false, handheld: true },
  { word: '안경', kind: 'object', living: false, food: false, tool: false, electric: false, wearable: true, school: false, wheels: false, handheld: false, helpsVision: true },
  { word: '신발', kind: 'object', living: false, food: false, tool: false, electric: false, wearable: true, school: false, wheels: false, handheld: false, wornOnFeet: true },
  { word: '자전거', kind: 'object', living: false, food: false, tool: false, electric: false, wearable: false, school: false, wheels: true, handheld: false, ride: true },
  { word: '자동차', kind: 'object', living: false, food: false, tool: false, electric: false, wearable: false, school: false, wheels: true, handheld: false, ride: true, big: true },
  { word: '휴대전화', kind: 'object', living: false, food: false, tool: false, electric: true, wearable: false, school: false, wheels: false, handheld: true },
  { word: '냉장고', kind: 'object', living: false, food: false, tool: false, electric: true, wearable: false, school: false, wheels: false, handheld: false, big: true },
  { word: '시계', kind: 'object', living: false, food: false, tool: false, electric: true, wearable: true, school: false, wheels: false, handheld: false },
];

export const TWENTY_QUESTIONS = [
  { id: 'living', text: '살아 있는 것인가요?', property: 'living' },
  { id: 'food', text: '먹을 수 있는 것인가요?', property: 'food' },
  { id: 'pet', text: '사람과 집에서 함께 살기도 하나요?', property: 'pet', kinds: ['animal'] },
  { id: 'water', text: '주로 물속에서 사나요?', property: 'water', kinds: ['animal'] },
  { id: 'flies', text: '하늘을 날 수 있나요?', property: 'flies', kinds: ['animal'] },
  { id: 'land', text: '주로 땅 위에서 움직이나요?', property: 'land', kinds: ['animal'] },
  { id: 'big', text: '어른보다 크거나 무거운 편인가요?', property: 'big' },
  { id: 'sound', text: '우리가 알아들을 만한 울음소리를 내나요?', property: 'sound', kinds: ['animal'] },
  { id: 'sweet', text: '단맛이 나나요?', property: 'sweet', kinds: ['food'] },
  { id: 'fruit', text: '과일인가요?', property: 'fruit', kinds: ['food'] },
  { id: 'hot', text: '보통 따뜻하거나 뜨겁게 먹나요?', property: 'hot', kinds: ['food'] },
  { id: 'cold', text: '차갑게 먹는 음식인가요?', property: 'cold', kinds: ['food'] },
  { id: 'round', text: '둥근 모양에 가까운가요?', property: 'round', kinds: ['food'] },
  { id: 'electric', text: '전기나 배터리를 사용하나요?', property: 'electric', kinds: ['object'] },
  { id: 'wearable', text: '몸에 걸치거나 착용하나요?', property: 'wearable', kinds: ['object'] },
  { id: 'school', text: '학교에서 자주 사용하나요?', property: 'school', kinds: ['object'] },
  { id: 'wheels', text: '바퀴가 있나요?', property: 'wheels', kinds: ['object'] },
  { id: 'ride', text: '사람이 타고 이동할 수 있나요?', property: 'ride', kinds: ['object'] },
  { id: 'handheld', text: '한 손으로 들 수 있나요?', property: 'handheld', kinds: ['object'] },
  { id: 'tool', text: '무언가를 할 때 도구처럼 사용하나요?', property: 'tool', kinds: ['object'] },
  { id: 'barks', text: '“멍멍” 하고 짖나요?', property: 'barks', kinds: ['animal'] },
  { id: 'meows', text: '“야옹” 하고 우나요?', property: 'meows', kinds: ['animal'] },
  { id: 'trunk', text: '코가 아주 길게 생겼나요?', property: 'trunk', kinds: ['animal'] },
  { id: 'longNeck', text: '목이 아주 긴 동물인가요?', property: 'longNeck', kinds: ['animal'] },
  { id: 'stripes', text: '몸에 줄무늬가 있나요?', property: 'stripes', kinds: ['animal'] },
  { id: 'eightArms', text: '다리가 여덟 개 있나요?', property: 'eightArms', kinds: ['animal'] },
  { id: 'riceCake', text: '떡이 들어간 음식인가요?', property: 'riceCake', kinds: ['food'] },
  { id: 'noodles', text: '면을 먹는 음식인가요?', property: 'noodles', kinds: ['food'] },
  { id: 'helpsVision', text: '눈이 잘 보이도록 도와주나요?', property: 'helpsVision', kinds: ['object'] },
  { id: 'wornOnFeet', text: '발에 신는 물건인가요?', property: 'wornOnFeet', kinds: ['object'] },
];

export function chooseTwentyQuestion(candidates, askedIds) {
  const unanswered = TWENTY_QUESTIONS.filter((question) => !askedIds.includes(question.id));
  let bestQuestion = null;
  let bestDifference = Number.POSITIVE_INFINITY;

  for (const question of unanswered) {
    const yesCount = candidates.filter((item) => Boolean(item[question.property])).length;
    const noCount = candidates.length - yesCount;
    if (yesCount === 0 || noCount === 0) continue;
    const difference = Math.abs(yesCount - noCount);
    if (difference < bestDifference) {
      bestDifference = difference;
      bestQuestion = question;
    }
  }

  return bestQuestion;
}

export function chooseTwentyConfirmationQuestion(candidate, askedIds) {
  if (!candidate) return null;

  const unanswered = TWENTY_QUESTIONS.filter((question) => (
    !askedIds.includes(question.id)
    && (!question.kinds || question.kinds.includes(candidate.kind))
  ));
  return unanswered.find((question) => Boolean(candidate[question.property]))
    ?? unanswered[0]
    ?? null;
}

export function rankTwentyCandidates(answers, rejectedWords = []) {
  const rejected = new Set(rejectedWords);
  const questionsById = new Map(
    TWENTY_QUESTIONS.map((question) => [question.id, question]),
  );

  return TWENTY_CANDIDATES
    .filter((candidate) => !rejected.has(candidate.word))
    .map((candidate) => {
      const matchScore = answers.reduce((score, item) => {
        if (item.answer === 'unknown') return score;
        const question = questionsById.get(item.questionId);
        if (!question) return score;
        const expected = item.answer === 'yes';
        return score + (Boolean(candidate[question.property]) === expected ? 2 : -2);
      }, 0);

      return { ...candidate, matchScore };
    })
    .sort((left, right) => right.matchScore - left.matchScore);
}

export function getTwentyMatchingCandidates(answers, rejectedWords = []) {
  const rejected = new Set(rejectedWords);
  const questionsById = new Map(
    TWENTY_QUESTIONS.map((question) => [question.id, question]),
  );
  const definiteAnswers = answers.filter((item) => item.answer !== 'unknown');

  return TWENTY_CANDIDATES.filter((candidate) => {
    if (rejected.has(candidate.word)) return false;
    return definiteAnswers.every((item) => {
      const question = questionsById.get(item.questionId);
      if (!question) return true;
      return Boolean(candidate[question.property]) === (item.answer === 'yes');
    });
  });
}

export function filterTwentyCandidates(candidates, question, answer) {
  if (answer === 'unknown') return candidates;
  const expected = answer === 'yes';
  return candidates.filter((item) => Boolean(item[question.property]) === expected);
}

export function shuffleItems(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}
