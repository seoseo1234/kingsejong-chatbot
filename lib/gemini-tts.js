// Gemini TTS 호출을 API 라우트와 미리 만든 음성 생성 스크립트가 함께 쓴다.
const TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const TTS_MODEL = 'gemini-3.8-flash-tts';
const TTS_VOICE = 'ko-kr-concierge-7';
export const MAX_TEXT_LENGTH = 1500;

const SPEECH_STYLE = [
  'Speak Korean as a warm and dignified Korean grandfather in his late sixties.',
  'Use a low, resonant male voice with a gentle smile and calm, natural conversational pacing.',
  'Use subtle human breaths, clear articulation for a seven-year-old child, and a warm storytelling cadence.',
  'Sound like wise King Sejong kindly speaking directly to a child.',
  'Avoid announcer-like, theatrical, exaggerated, rushed, or robotic delivery.',
].join(' ');

export function normalizeSpeechText(value) {
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

/**
 * 문장을 세종대왕 목소리로 합성한다. 실패하면 Error를 던진다.
 * @returns {Promise<{ buffer: Buffer, mimeType: string }>}
 */
export async function synthesizeSpeech(text, apiKey) {
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
    throw new Error(`Gemini TTS API 오류 ${response.status}: ${result?.error?.message || ''}`);
  }

  const audioPart = findLastAudioPart(result);
  if (!audioPart) throw new Error('Gemini TTS 응답에 오디오가 없습니다.');

  const buffer = Buffer.from(audioPart.data, 'base64');
  if (buffer.length < 44) throw new Error('Gemini TTS 오디오 데이터가 비어 있습니다.');

  return { buffer, mimeType: audioPart.mime_type || audioPart.mimeType || 'audio/wav' };
}
