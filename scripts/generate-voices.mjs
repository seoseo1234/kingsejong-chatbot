// 추천 질문 답변과 환영 인사의 음성을 미리 만들어 public/audio/voices 에 저장한다.
// 사용법: npm run voices            (바뀐 문장만 새로 만든다)
//        npm run voices -- --force (모두 다시 만든다)
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mp3Encoder } from '@breezystack/lamejs';
import { synthesizeSpeech } from '../lib/gemini-tts.js';
import { listPresetVoices } from '../lib/preset-speech.js';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(rootDir, 'public', 'audio', 'voices');
const manifestPath = path.join(outDir, 'manifest.json');
const force = process.argv.includes('--force');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY 가 없습니다. .env.local 을 확인하세요.');
  process.exit(1);
}

// Gemini 가 주는 16비트 모노 PCM WAV 를 용량이 작은 MP3 로 바꾼다.
function wavToMp3(wav, kbps = 48) {
  if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('WAV 형식이 아닙니다.');
  }

  let offset = 12;
  let format = null;
  let samples = null;
  while (offset + 8 <= wav.length) {
    const chunkId = wav.toString('ascii', offset, offset + 4);
    const chunkSize = wav.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (chunkId === 'fmt ') {
      format = {
        channels: wav.readUInt16LE(body + 2),
        sampleRate: wav.readUInt32LE(body + 4),
        bitsPerSample: wav.readUInt16LE(body + 14),
      };
    } else if (chunkId === 'data') {
      const end = Math.min(body + chunkSize, wav.length);
      samples = new Int16Array(wav.buffer.slice(wav.byteOffset + body, wav.byteOffset + end - ((end - body) % 2)));
    }
    offset = body + chunkSize + (chunkSize % 2);
  }

  if (!format || !samples || format.channels !== 1 || format.bitsPerSample !== 16) {
    throw new Error('16비트 모노 WAV 만 변환할 수 있습니다.');
  }

  const encoder = new Mp3Encoder(1, format.sampleRate, kbps);
  const chunks = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const encoded = encoder.encodeBuffer(samples.subarray(i, i + 1152));
    if (encoded.length > 0) chunks.push(Buffer.from(encoded));
  }
  chunks.push(Buffer.from(encoder.flush()));
  return Buffer.concat(chunks);
}

const hashText = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);

async function synthesizeWithRetry(text, attempts = 3) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await synthesizeSpeech(text, apiKey);
    } catch (error) {
      if (attempt >= attempts) throw error;
      console.warn(`  재시도 ${attempt}/${attempts - 1}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    }
  }
}

await mkdir(outDir, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};
const voices = listPresetVoices();
let failed = 0;

for (const { id, text } of voices) {
  const file = path.join(outDir, `${id}.mp3`);
  const hash = hashText(text);
  if (!force && manifest[id] === hash && existsSync(file)) {
    console.log(`건너뜀  ${id}`);
    continue;
  }

  try {
    const { buffer, mimeType } = await synthesizeWithRetry(text);
    if (!mimeType.includes('wav')) throw new Error(`예상하지 못한 형식: ${mimeType}`);
    const mp3 = wavToMp3(buffer);
    await writeFile(file, mp3);
    manifest[id] = hash;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`생성    ${id} (${Math.round(mp3.length / 1024)}KB)`);
  } catch (error) {
    failed += 1;
    console.error(`실패    ${id}: ${error.message}`);
  }
}

// 더 이상 쓰지 않는 음성 파일은 정리한다.
const activeIds = new Set(voices.map((voice) => voice.id));
for (const name of await readdir(outDir)) {
  const id = name.replace(/\.(mp3|wav)$/, '');
  if (/\.(mp3|wav)$/.test(name) && (name.endsWith('.wav') || !activeIds.has(id))) {
    await rm(path.join(outDir, name));
    if (!activeIds.has(id)) delete manifest[id];
    console.log(`삭제    ${name}`);
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (failed > 0) {
  console.error(`${failed}개를 만들지 못했습니다. 다시 실행하면 실패한 것만 새로 만듭니다.`);
  process.exit(1);
}
