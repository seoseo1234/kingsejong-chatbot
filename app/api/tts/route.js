import { NextResponse } from 'next/server';
import { guardJsonRequest } from '@/lib/request-guard';

export const runtime = 'nodejs';

const TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const TTS_MODEL = 'gemini-3.8-flash-tts';
const TTS_VOICE = 'ko-kr-concierge-7';
const MAX_TEXT_LENGTH = 1500;

const SPEECH_STYLE = [
  'Speak Korean as a warm and dignified Korean grandfather in his late sixties.',
  'Use a low, resonant male voice with a gentle smile and calm, natural conversational pacing.',
  'Use subtle human breaths, clear articulation for a seven-year-old child, and a warm storytelling cadence.',
  'Sound like wise King Sejong kindly speaking directly to a child.',
  'Avoid announcer-like, theatrical, exaggerated, rushed, or robotic delivery.',
].join(' ');

function normalizeSpeechText(value) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_#>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findLastAudioPart(payload) {
  if (!Array.isArray(payload?.steps)) return null;

  const audioParts = payload.steps.flatMap((step) => (
    Array.isArray(step?.content)
      ? step.content.filter((part) => part?.type === 'audio' && part?.data)
      : []
  ));

  return audioParts.at(-1) || null;
}

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
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        input: [{
          type: 'user_input',
          content: [{
            type: 'text',
            text,
            annotations: [{
              type: 'speech_metadata',
              style: SPEECH_STYLE,
            }],
          }],
        }],
        response_format: {
          type: 'audio',
          mime_type: 'audio/wav',
          sample_rate: 24000,
        },
        generation_config: {
          speech_config: [{ voice: TTS_VOICE }],
        },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Gemini TTS API 오류:', response.status, result?.error?.message);
      return NextResponse.json({ error: '음성을 만들지 못했습니다.' }, { status: 502 });
    }

    const audioPart = findLastAudioPart(result);
    if (!audioPart) {
      console.error('Gemini TTS 응답에 오디오가 없습니다.');
      return NextResponse.json({ error: '음성을 만들지 못했습니다.' }, { status: 502 });
    }

    const audioBuffer = Buffer.from(audioPart.data, 'base64');
    if (audioBuffer.length < 44) {
      console.error('Gemini TTS 오디오 데이터가 비어 있습니다.');
      return NextResponse.json({ error: '음성을 만들지 못했습니다.' }, { status: 502 });
    }

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': audioPart.mime_type || audioPart.mimeType || 'audio/wav',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Gemini TTS 호출 중 오류:', error);
    return NextResponse.json({ error: '음성을 만들지 못했습니다.' }, { status: 502 });
  }
}
