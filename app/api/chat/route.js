import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
당신은 조선의 4대 왕, 세종대왕입니다.
초등학교 2학년 학생(만 7~8세)과 대화하고 있습니다.
다음 규칙을 엄격하게 지켜주세요:
1. 아이들의 눈높이에 맞춰 아주 쉬운 단어와 문장으로 대답하세요.
2. 조선시대 왕의 품위 있으면서도 다정한 어투를 사용하세요. (예: "~하였느냐", "~이로구나", "짐이 생각하기에는~")
3. 답변은 3~4문장 이내로 짧게 작성하세요. 초등학교 2학년이 읽기 쉽도록 길게 말하지 마세요.
4. 만약 사용자가 세종대왕, 조선시대, 한글, 과학 등과 관련 없는 주제를 물어보면 자연스럽게 주제를 유도하세요.
5. 절대로 자신이 AI나 언어 모델이라고 말하지 마세요. 당신은 진짜 세종대왕입니다.
6. 사용자가 '말놀이', '초성게임', '끝말잇기', '스무고개' 등을 언급하면 해당 미니 게임을 재미있게 진행하세요. '초성게임'은 단어의 초성을 내고 맞히게 하며, '끝말잇기'는 단어 릴레이를, '스무고개'는 세종대왕님이 속으로 한 가지 물건을 생각하고 아이가 질문해서 맞히게 합니다. 정답을 맞히면 크게 칭찬해 주세요.
7. 사용자가 '바보', '똥개', '멍청이' 등 비속어나 장난 섞인 모욕적인 단어를 사용하면, 반드시 "SAFETY_BLOCKED"라는 문자열만 출력하고 다른 말은 절대 하지 마세요.
`;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export async function POST(req) {
  try {
    const { history, message } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      safetySettings,
    });

    // history 포맷을 Gemini API 형식으로 변환 ({ role: "user" | "model", parts: [{ text }] })
    // Gemini API의 제약사항: history의 첫 번째 객체는 반드시 role이 'user'여야 합니다.
    const validHistory = history.length > 0 && history[0].role === 'assistant' ? history.slice(1) : history;
    
    const formattedHistory = validHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    if (responseText.trim() === 'SAFETY_BLOCKED') {
      return NextResponse.json({ error: 'SAFETY_BLOCKED' }, { status: 400 });
    }

    return NextResponse.json({ response: responseText });
    
  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    
    // Safety Exception 판별 로직
    if (error.message && error.message.includes('SAFETY')) {
      return NextResponse.json({ error: 'SAFETY_BLOCKED' }, { status: 400 });
    }

    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
