// 추천 질문 칩에는 정해진 답과 미리 만들어 둔 음성을 쓴다.
// 답을 고친 뒤에는 `npm run voices` 로 음성 파일을 다시 만들어야 한다.
// 사실 관계는 lib/sejong-knowledge.js 의 검증 자료 안에서만 쓴다.

export const WELCOME_MESSAGE = '반갑다, 2학년 학생들아! 짐은 조선의 4대 왕 세종이로다. 나에게 궁금한 것이 있느냐?';

const VOICE_DIR = '/audio/voices';

export const PRESET_ANSWERS = [
  {
    id: 'hangul-why',
    knowledgeId: 'hangul-creation',
    questions: ['한글은 왜 만드셨나요?'],
    answer: '옛날에는 한자가 너무 어려워서 많은 백성이 글을 읽고 쓰지 못했단다. 하고 싶은 말이 있어도 글로 남기지 못하니 짐의 마음이 무척 아팠느니라. 그래서 누구나 쉽게 배워 날마다 편하게 쓸 수 있도록 새 글자를 만들었단다.',
  },
  {
    id: 'hunminjeongeum-meaning',
    knowledgeId: 'hangul-creation',
    questions: ['훈민정음은 무슨 뜻인가요?'],
    answer: '훈민정음은 백성을 가르치는 바른 소리라는 뜻이란다. 짐이 만든 새 글자의 이름이고, 오늘날 너희가 쓰는 한글의 옛 이름이지. 백성 모두가 바르게 읽고 쓰기를 바라는 마음을 이름에 담았느니라.',
  },
  {
    id: 'hangul-when',
    knowledgeId: 'hangul-creation',
    questions: ['한글은 언제 세상에 알려졌나요?'],
    answer: '짐은 1443년에 새 글자 훈민정음을 다 만들었단다. 그리고 3년 뒤인 1446년에 글자를 만든 까닭과 원리를 설명한 책 훈민정음을 펴내어 세상에 널리 알렸느니라. 너희가 기념하는 한글날도 바로 이 일을 기리는 날이란다.',
  },
  {
    id: 'hangul-count',
    knowledgeId: 'hangul-creation',
    questions: ['처음 한글은 모두 몇 글자였나요?'],
    answer: '처음 만든 훈민정음은 모두 스물여덟 자였단다. 자음이 열일곱 자, 모음이 열한 자였지. 그중 네 글자는 지금은 쓰지 않아서 오늘날에는 스물네 자를 쓰고 있느니라.',
  },
  {
    id: 'consonant-shapes',
    knowledgeId: 'hangul-principles',
    questions: ['자음은 어떤 모양을 본떴나요?'],
    answer: '자음은 소리를 낼 때 움직이는 입과 혀, 목구멍의 모양을 본떠 만들었단다. ㄴ은 혀끝이 윗잇몸에 닿는 모양이고, ㅁ은 입 모양, ㅇ은 목구멍 모양이지. 거울을 보며 소리를 내어 보면 정말 닮았는지 알 수 있을 것이니라.',
  },
  {
    id: 'vowel-heaven-earth',
    knowledgeId: 'hangul-principles',
    questions: ['모음에 하늘과 땅이 담겨 있나요?'],
    answer: '그렇단다, 아주 잘 알고 있구나! 동그란 점은 둥근 하늘, 가로로 긴 ㅡ는 평평한 땅, 세로로 선 ㅣ는 서 있는 사람을 본떴느니라. 이 세 가지를 합쳐서 ㅏ, ㅗ 같은 여러 모음을 만들었단다.',
  },
  {
    id: 'hangul-growth',
    knowledgeId: 'hangul-principles',
    questions: ['한글 글자는 어떻게 늘어났나요?'],
    answer: '기본 글자에 획을 하나씩 더해서 새 글자를 만들었단다. ㄱ에 획을 더하면 ㅋ이 되고, ㄴ에 획을 더하면 ㄷ, 또 더하면 ㅌ이 되지. 소리가 세질수록 획이 늘어나니 참 똑똑한 방법이 아니겠느냐?',
  },
  {
    id: 'rain-gauge-how',
    knowledgeId: 'rain-gauge',
    questions: ['측우기로 비를 어떻게 쟀나요?', '측우기는 어떻게 비의 양을 쟀나요?'],
    answer: '측우기는 원통 모양의 그릇이란다. 비가 오면 그릇에 빗물이 고이고, 고인 빗물의 깊이를 자로 재어 비가 얼마나 왔는지 알았느니라. 온 나라에서 같은 방법으로 재고 꼼꼼히 기록하게 했단다.',
  },
  {
    id: 'rain-gauge-maker',
    knowledgeId: 'rain-gauge',
    questions: ['측우기를 만든 사람은 누구인가요?'],
    answer: '1441년에 짐의 아들인 세자가 빗물의 양을 재는 기구를 생각해 냈다는 기록이 있단다. 이 세자가 훗날 조선의 다섯 번째 왕이 된 문종이니라. 이듬해에는 측우기의 크기와 재는 방법을 정해서 온 나라에서 쓰게 했지.',
  },
  {
    id: 'rain-record-why',
    knowledgeId: 'rain-gauge',
    questions: ['비의 양을 왜 기록했나요?'],
    answer: '백성들이 농사를 잘 지으려면 비가 언제 얼마나 오는지 아는 것이 아주 중요했단다. 비의 양을 해마다 꼼꼼히 기록해 두면 날씨를 더 잘 이해하고 농사를 준비할 수 있었느니라. 그래서 짐은 온 나라에서 같은 방법으로 재어 기록하게 했단다.',
  },
  {
    id: 'sundial-how',
    knowledgeId: 'sundial',
    questions: ['앙부일구는 어떻게 시간을 알려주나요?'],
    answer: '앙부일구는 해의 그림자로 시간을 알려 주는 해시계란다. 해가 하늘을 지나가면 뾰족한 바늘의 그림자도 함께 움직이지. 그림자 끝이 어느 줄에 닿았는지 보면 지금이 몇 시인지 알 수 있었느니라.',
  },
  {
    id: 'sundial-concave',
    knowledgeId: 'sundial',
    questions: ['앙부일구는 왜 오목한가요?'],
    answer: '앙부일구는 하늘을 우러러보는 가마솥이라는 뜻이란다. 솥처럼 오목한 안쪽에 시간과 계절을 나타내는 줄을 그어 두어서, 해가 어디에 있든 그림자가 줄 위에 또렷하게 떨어졌지. 둥근 하늘을 그릇 안에 담은 것과 같으니라.',
  },
  {
    id: 'sundial-season',
    knowledgeId: 'sundial',
    questions: ['해시계로 계절도 알 수 있었나요?'],
    answer: '그렇단다! 여름에는 해가 높이 떠서 그림자가 짧고, 겨울에는 해가 낮게 떠서 그림자가 길어지지. 앙부일구에는 계절을 알려 주는 줄도 그어져 있어서, 그림자 끝이 닿는 줄을 보면 계절도 알 수 있었느니라.',
  },
  {
    id: 'night-time',
    knowledgeId: 'science-and-time',
    questions: ['밤에는 시간을 어떻게 알았나요?'],
    answer: '좋은 질문이로구나! 해시계는 해가 없는 밤에는 쓸 수 없었단다. 그래서 물이 흐르는 힘으로 움직이는 물시계, 자격루를 만들었지. 자격루는 정해진 시간이 되면 스스로 소리를 내어 밤에도 시각을 알려 주었느니라.',
  },
  {
    id: 'jagyeongnu-how',
    knowledgeId: 'science-and-time',
    questions: ['자격루는 어떻게 시간을 알렸나요?'],
    answer: '자격루는 물이 일정하게 흐르는 힘을 이용한 물시계란다. 물이 차오르면 장치가 움직이고, 정해진 시간이 되면 인형이 종과 북을 쳐서 스스로 시각을 알려 주었지. 사람이 지켜보지 않아도 알려 주니 참 신기하지 않느냐?',
  },
  {
    id: 'jang-yeongsil',
    knowledgeId: 'science-and-time',
    questions: ['장영실은 어떤 일을 했나요?'],
    answer: '장영실은 손재주가 뛰어나고 생각이 아주 깊은 기술자였단다. 짐은 장영실과 여러 학자, 기술자들에게 하늘을 살피는 기구와 시계를 만들게 했느니라. 장영실은 자격루 같은 시계를 만드는 데 큰 힘을 보탰단다.',
  },
  {
    id: 'sky-observation',
    knowledgeId: 'science-and-time',
    questions: ['세종 시대에는 왜 하늘을 관찰했나요?'],
    answer: '하늘의 해와 달, 별을 잘 살펴야 정확한 시간과 달력을 만들 수 있단다. 언제 씨를 뿌리고 언제 거둘지 알아야 백성들이 농사를 잘 지을 수 있었지. 그래서 짐은 하늘을 꼼꼼히 관찰하는 일을 무척 소중히 여겼느니라.',
  },
  {
    id: 'greatest-achievement',
    knowledgeId: 'king-sejong',
    questions: ['세종대왕의 가장 큰 업적은 무엇인가요?'],
    answer: '많은 사람이 백성을 위해 만든 글자, 훈민정음을 가장 먼저 떠올린단다. 그 밖에도 짐이 나라를 다스리던 때에는 음악과 농업, 의학, 과학 같은 여러 분야가 함께 발전했느니라. 모두 백성이 더 편하게 살기를 바라는 마음에서 시작된 일이란다.',
  },
  {
    id: 'jiphyeonjeon',
    knowledgeId: 'king-sejong',
    questions: ['집현전에서는 무엇을 했나요?'],
    answer: '집현전은 똑똑한 학자들이 모여 책을 읽고 연구하던 곳이란다. 학자들은 옛 책을 살피며 공부하고, 나라에 필요한 새 책을 만들었지. 짐은 학자들이 마음껏 공부할 수 있도록 늘 아끼고 도와주었느니라.',
  },
  {
    id: 'science-growth',
    knowledgeId: 'king-sejong',
    questions: ['세종 시대에는 어떤 과학이 발전했나요?'],
    answer: '짐이 다스리던 때에는 과학 기술이 크게 발전했단다. 비의 양을 재는 측우기, 그림자로 시간을 알려 주는 앙부일구, 스스로 시각을 알려 주는 물시계 자격루가 만들어졌지. 하늘을 살피는 천문 기구도 만들어 백성의 농사를 도왔느니라.',
  },
];

function normalizeQuestion(text) {
  return text.normalize('NFKC').replace(/[\s?？!.]/g, '');
}

const presetByQuestion = new Map(
  PRESET_ANSWERS.flatMap((preset) => preset.questions.map((q) => [normalizeQuestion(q), preset])),
);

const voiceUrlByText = new Map([
  [WELCOME_MESSAGE, `${VOICE_DIR}/welcome.mp3`],
  ...PRESET_ANSWERS.map((preset) => [preset.answer, `${VOICE_DIR}/${preset.id}.mp3`]),
]);

export function findPresetAnswer(question) {
  if (typeof question !== 'string') return null;
  return presetByQuestion.get(normalizeQuestion(question)) || null;
}

/** 미리 만들어 둔 음성이 있는 문장이면 그 파일 주소를, 없으면 null 을 돌려준다. */
export function getPresetVoiceUrl(text) {
  return voiceUrlByText.get(text) || null;
}

/** 음성 생성 스크립트용: [{ id, text }] */
export function listPresetVoices() {
  return [
    { id: 'welcome', text: WELCOME_MESSAGE },
    ...PRESET_ANSWERS.map((preset) => ({ id: preset.id, text: preset.answer })),
  ];
}
