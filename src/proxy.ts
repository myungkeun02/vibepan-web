import { NextRequest, NextResponse } from 'next/server';
import { withApi, apiRequest, cookieHeader } from './lib/api-client';
import type { RequestContext } from './lib/request-context';
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const forwarded = new Headers(request.headers);
  forwarded.set('x-vibepan-path', path + request.nextUrl.search);
  // The Node entry point replaces this header from the socket. On Vercel use its protected platform header.
  const address =
    process.env.VIBEPAN_CUSTOM_SERVER === '1'
      ? request.headers.get('x-vibepan-remote-address') || 'unknown'
      : process.env.VERCEL === '1'
        ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        : 'unknown';
  forwarded.set('x-vibepan-client-address', address);
  const isApi = /^\/(?:api|auth|media)(?:\/|$)/.test(path) || ['/robots.txt', '/sitemap.xml'].includes(path);
  if (isApi) return NextResponse.next({ request: { headers: forwarded } });
  if (path === '/admin')
    return process.env.ADMIN_SITE_URL
      ? NextResponse.redirect(process.env.ADMIN_SITE_URL + '/')
      : new Response(null, { status: 404 });

  const ctx: RequestContext = {
    request,
    url: request.nextUrl,
    params: {},
    locals: {},
    clientAddress: address,
  };
  try {
    return await withApi(ctx, async () => {
      const session = await apiRequest('/api/session');
      if (!session.ok) throw new Error('Session API failed');
      forwarded.set('cookie', cookieHeader());
      const response = NextResponse.next({ request: { headers: forwarded } });
      response.headers.set('cache-control', 'private, no-store');
      response.headers.set('x-content-type-options', 'nosniff');
      response.headers.set('x-frame-options', 'DENY');
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
      response.headers.set(
        'content-security-policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://t1.kakaocdn.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.kakaocdn.net; connect-src 'self' https://*.kakao.com; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      );

      return response;
    });
  } catch {
    return new Response('연결을 확인하고 있습니다. 잠시 후 다시 시도해 주세요.', {
      status: 503,
      headers: { 'cache-control': 'no-store' },
    });
  }
}
export const config = {
  matcher: ['/((?!_next/|brand/|icons/|og/|prompts/|favicon|apple-touch-icon|theme\\.js).*)'],
};
