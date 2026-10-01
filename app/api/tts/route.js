import { NextResponse } from 'next/server';
import { guardJsonRequest } from '@/lib/request-guard';
import { MAX_TEXT_LENGTH, normalizeSpeechText, synthesizeSpeech } from '@/lib/gemini-tts';

export const runtime = 'nodejs';

export async function POST(request) {
  const blocked = guardJsonRequest(request, {
    scope: 'tts',
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (blocked) return blocked;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const text = normalizeSpeechText(payload?.text);
  if (!text || text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `읽을 내용은 ${MAX_TEXT_LENGTH}자 이하여야 합니다.` },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  try {
    const { buffer, mimeType } = await synthesizeSpeech(text, apiKey);

    return new Response(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Gemini TTS 호출 중 오류:', error);
    return NextResponse.json({ error: '음성을 만들지 못했습니다.' }, { status: 502 });
  }
}
