import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { guardJsonRequest } from '@/lib/request-guard';

function matchesPin(input, expected) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  return inputBuffer.length === expectedBuffer.length
    && timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function POST(request) {
  const blocked = guardJsonRequest(request, {
    scope: 'admin-unlock',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (blocked) return blocked;

  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    return NextResponse.json(
      { error: '관리자 PIN이 설정되지 않았습니다.' },
      { status: 503 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const pin = typeof payload?.pin === 'string' ? payload.pin.trim() : '';
  if (!pin || pin.length > 20 || !matchesPin(pin, adminPin)) {
    return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 });
  }

  return NextResponse.json({ unlocked: true });
}
