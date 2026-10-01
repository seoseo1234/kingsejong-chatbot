import { NextResponse } from 'next/server';

const rateLimitStore = globalThis.__sejongRateLimitStore || new Map();
globalThis.__sejongRateLimitStore = rateLimitStore;

const UNSAFE_PATTERNS = [
  /씨\s*발|시\s*발|병\s*신|개\s*새끼|좆|지랄|꺼져/i,
  /죽여|죽어|때려\s*죽|폭탄|칼로\s*(찌르|죽)/i,
  /야동|섹스|성관계|강간|나체/i,
  /한남|한녀|틀딱|맘충|장애인\s*(같|새끼)/i,
  /fuck|shit|bitch|kill\s+(you|him|her|them)|rape|porn/i,
];

export function guardJsonRequest(request, { scope, limit, windowMs }) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { error: 'JSON 형식의 요청만 사용할 수 있습니다.' },
      { status: 415 },
    );
  }

  const requestOrigin = request.headers.get('origin');
  const expectedHost = request.headers.get('x-forwarded-host')
    || request.headers.get('host')
    || new URL(request.url).host;
  const fetchSite = request.headers.get('sec-fetch-site');
  if (!requestOrigin) {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  }
  let originHost = null;
  try {
    originHost = requestOrigin ? new URL(requestOrigin).host : null;
  } catch {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  }
  if (
    fetchSite === 'cross-site' ||
    (originHost && originHost !== expectedHost)
  ) {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
  const key = `${scope}:${clientIp}`;
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  current.count += 1;
  return null;
}

export function normalizeChatPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!message || message.length > 500 || !Array.isArray(payload.history)) return null;
  if (payload.history.length > 20) return null;

  const history = [];
  let totalLength = message.length;

  for (const item of payload.history) {
    if (!item || !['user', 'assistant'].includes(item.role)) return null;
    if (typeof item.content !== 'string') return null;

    const content = item.content.trim();
    if (!content || content.length > 1000) return null;
    totalLength += content.length;
    if (totalLength > 8000) return null;

    history.push({ role: item.role, content });
  }

  return { history, message };
}

export function normalizeSummaryHistory(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.history)) return null;
  if (payload.history.length === 0 || payload.history.length > 30) return null;

  const history = [];
  let totalLength = 0;

  for (const item of payload.history) {
    if (!item || !['user', 'assistant'].includes(item.role)) return null;
    if (typeof item.content !== 'string') return null;

    const content = item.content.trim();
    if (!content || content.length > 1000) return null;
    totalLength += content.length;
    if (totalLength > 12000) return null;

    history.push({ role: item.role, content });
  }

  return history;
}

export function containsUnsafeLanguage(text) {
  const normalized = text.normalize('NFKC');
  return UNSAFE_PATTERNS.some((pattern) => pattern.test(normalized));
}
