import { NextRequest, NextResponse } from 'next/server';

// Keep file bodies on the platform's external rewrite path, out of the BFF function.
// Authentication, CSRF, file validation and storage remain in the API.
export function uploadRewrite(request: NextRequest, clientAddress: string) {
  const base = process.env.API_ORIGIN;
  const secret = process.env.API_PROXY_SECRET;
  if (!base || !secret || secret.length < 32) throw new Error('Missing upload API configuration');
  const target = new URL(base);
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password)
    throw new Error('Invalid upload API origin');
  target.pathname = request.nextUrl.pathname;
  target.search = request.nextUrl.search;
  const headers = new Headers();
  for (const name of [
    'content-type',
    'content-length',
    'accept',
    'cookie',
    'origin',
    'referer',
    'x-csrf-token',
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('x-vibepan-api-key', secret);
  headers.set('x-vibepan-client-ip', clientAddress);
  return NextResponse.rewrite(target, { request: { headers } });
}
