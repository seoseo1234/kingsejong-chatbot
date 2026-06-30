import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { history } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    if (!history || history.length === 0) {
      return NextResponse.json({ summary: '대화 내용이 없습니다.' });
    }

    // 대화 내역을 하나의 문자열로 결합
    const conversationText = history
      .map(msg => `${msg.role === 'user' ? '학생' : '세종대왕'}: ${msg.content}`)
      .join('\n');

    const prompt = `
다음은 초등학교 2학년 학생과 세종대왕 AI 챗봇이 나눈 대화 기록입니다:

${conversationText}

위 대화 내용을 바탕으로 학생이 '세종대왕님께 배운 점'을 요약해 주세요.
조건:
1. 초등학교 2학년이 읽기 쉽고 이해하기 쉬운 단어만 사용하세요.
2. 3줄 이내로 간결하게 요약하세요.
3. 존댓말(해요체)을 사용하세요. (예: "~를 배웠어요.")
4. 글머리 기호(- 또는 •)를 사용하지 말고 자연스러운 문장으로 작성하세요.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('요약 API 호출 중 오류 발생:', error);
    return NextResponse.json({ error: '요약 생성 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
