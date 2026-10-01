const KNOWLEDGE = [
  {
    id: 'hangul-creation',
    keywords: ['한글', '훈민정음', '글자', '문자', '창제', '반포', '백성'],
    facts: [
      '세종은 1443년에 새 문자 훈민정음을 만들었다.',
      '1446년에는 새 문자를 만든 목적과 원리를 설명한 책 훈민정음을 펴냈다.',
      '처음 만든 훈민정음은 자음 17자와 모음 11자, 모두 28자였다.',
      '백성이 자신의 뜻을 글로 쉽게 나타내고 편하게 쓰도록 하는 것이 중요한 목적이었다.',
    ],
    questions: [
      '훈민정음은 무슨 뜻인가요?',
      '한글은 언제 세상에 알려졌나요?',
      '처음 한글은 모두 몇 글자였나요?',
    ],
    sources: [
      {
        title: '국립한글박물관 · 훈민정음, 천년의 문자 계획',
        url: 'https://www.hangeul.go.kr/exhi/dailyExhibition.do?curr_menu_cd=0102010000',
      },
    ],
  },
  {
    id: 'hangul-principles',
    keywords: ['자음', '모음', '원리', '발음', '천지인', 'ㄱ', 'ㄴ', 'ㅁ', 'ㅅ', 'ㅇ'],
    facts: [
      '훈민정음의 기본 자음은 소리를 낼 때 쓰는 입과 혀, 목구멍의 모양을 본떠 만들었다.',
      '기본 모음은 하늘을 뜻하는 점, 땅을 뜻하는 ㅡ, 사람을 뜻하는 ㅣ에서 시작했다.',
      '기본 글자에 획을 더하거나 글자를 합쳐 여러 소리를 나타냈다.',
    ],
    questions: [
      '자음은 어떤 모양을 본떴나요?',
      '모음에 하늘과 땅이 담겨 있나요?',
      '한글 글자는 어떻게 늘어났나요?',
    ],
    sources: [
      {
        title: '국립한글박물관 · 한글 창제 원리',
        url: 'https://www.hangeul.go.kr/webzine/202010/sub1_3.html',
      },
    ],
  },
  {
    id: 'rain-gauge',
    keywords: ['측우기', '비', '빗물', '강우량', '날씨', '농사', '문종'],
    facts: [
      '측우기는 원통 모양의 그릇에 빗물을 받아 비가 온 양을 재는 기구다.',
      '세종 23년인 1441년에 세자, 훗날의 문종이 빗물의 양을 재는 기구를 고안했다는 기록이 있다.',
      '세종 24년인 1442년에는 측우기의 규격과 측정 방법을 정하고 전국에서 기록하도록 했다.',
      '비의 양을 일정한 방법으로 재고 기록한 것은 농사와 날씨를 이해하는 데 도움이 됐다.',
    ],
    questions: [
      '측우기는 어떻게 비의 양을 쟀나요?',
      '측우기를 만든 사람은 누구인가요?',
      '비의 양을 왜 기록했나요?',
    ],
    sources: [
      {
        title: '국사편찬위원회 우리역사넷 · 측우기 제작',
        url: 'https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_092_0030',
      },
    ],
  },
  {
    id: 'sundial',
    keywords: ['앙부일구', '해시계', '그림자', '시간', '절기'],
    facts: [
      '앙부일구는 오목한 가마솥처럼 생긴 해시계다.',
      '해의 움직임에 따라 생기는 그림자로 시간과 계절을 알 수 있었다.',
      '세종 16년인 1434년에 만들어져 사람들이 시간을 아는 데 도움을 주었다.',
    ],
    questions: [
      '앙부일구는 왜 오목한가요?',
      '해시계로 계절도 알 수 있었나요?',
      '밤에는 시간을 어떻게 알았나요?',
    ],
    sources: [
      {
        title: '국가유산포털 · 보물 앙부일구',
        url: 'https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1121108450000&pageNo=1_1_2_0',
      },
      {
        title: '한국천문연구원 · 앙부일구 연구 자료',
        url: 'https://harg.kasi.re.kr/pro_plus/down/201205/201205_003-014.pdf',
      },
    ],
  },
  {
    id: 'science-and-time',
    keywords: ['자격루', '물시계', '장영실', '과학', '발명', '천문', '달력'],
    facts: [
      '세종 시대에는 장영실을 비롯한 여러 기술자와 학자가 천문 기구와 시계를 만들었다.',
      '자격루는 물의 흐름을 이용해 정해진 시간이 되면 자동으로 시각을 알려 주는 물시계다.',
      '정확한 시간과 달력, 날씨 정보는 농사와 백성의 생활에 중요했다.',
    ],
    questions: [
      '자격루는 어떻게 시간을 알렸나요?',
      '장영실은 어떤 일을 했나요?',
      '세종 시대에는 왜 하늘을 관찰했나요?',
    ],
    sources: [
      {
        title: '국사편찬위원회 우리역사넷 · 측우기와 시계',
        url: 'https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_e31_0060_0030_0030',
      },
    ],
  },
  {
    id: 'king-sejong',
    keywords: ['세종', '대왕', '왕', '조선', '4대', '집현전', '업적', '생애'],
    facts: [
      '세종은 조선의 네 번째 왕으로 1418년부터 1450년까지 나라를 다스렸다.',
      '세종 시대에는 문자, 음악, 농업, 의학, 천문과 과학 기술 등 여러 분야가 발전했다.',
      '세종은 여러 학자와 기술자가 연구하고 책을 만들 수 있도록 이끌었다.',
    ],
    questions: [
      '세종대왕의 가장 큰 업적은 무엇인가요?',
      '집현전에서는 무엇을 했나요?',
      '세종 시대에는 어떤 과학이 발전했나요?',
    ],
    sources: [
      {
        title: '한국민족문화대백과사전 · 세종',
        url: 'https://encykorea.aks.ac.kr/Article/E0029857',
      },
    ],
  },
];

const DEFAULT_QUESTIONS = [
  '한글은 왜 만드셨나요?',
  '세종 시대에는 어떤 과학이 발전했나요?',
  '집현전에서는 무엇을 했나요?',
];

export function findRelevantKnowledge(message, limit = 2) {
  const normalized = message.normalize('NFKC').toLowerCase();
  return KNOWLEDGE
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce(
        (score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function buildKnowledgeContext(entries) {
  if (entries.length === 0) return '관련 검증 자료가 없습니다. 역사적 사실을 추측하지 마세요.';

  return entries
    .map((entry) => `[${entry.id}]\n${entry.facts.map((fact) => `- ${fact}`).join('\n')}`)
    .join('\n\n');
}

export function getSources(entries) {
  const unique = new Map();
  for (const entry of entries) {
    for (const source of entry.sources) unique.set(source.url, source);
  }
  return [...unique.values()].slice(0, 3);
}

export function getSuggestedQuestions(entries, currentQuestion = '') {
  const normalizedCurrent = currentQuestion.replace(/\s/g, '');
  const candidates = entries.length > 0
    ? entries.flatMap((entry) => entry.questions)
    : DEFAULT_QUESTIONS;

  const unique = [...new Set(candidates)].filter(
    (question) => question.replace(/\s/g, '') !== normalizedCurrent,
  );

  return [...unique, ...DEFAULT_QUESTIONS]
    .filter((question, index, all) => all.indexOf(question) === index)
    .slice(0, 3);
}

export { DEFAULT_QUESTIONS };
