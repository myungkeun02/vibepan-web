import { defineMiddleware } from 'astro:middleware';
import { withApi, presentation, proxyRequest } from './lib/api-client';
const admin = false;
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (
    /^\/(?:_astro\/|brand\/|icons\/|og\/|prompts\/|favicon|apple-touch-icon|theme\.js)/.test(ctx.url.pathname)
  )
    return next();
  return withApi(ctx, async () => {
    try {
      if (/^\/api\/(?:presentation|resources)(?:\/|$)/.test(ctx.url.pathname))
        return new Response(null, { status: 404 });
      const api = admin
        ? ctx.url.pathname.startsWith('/api/admin/') || ctx.url.pathname === '/api/health'
        : /^\/(?:api|auth|media)(?:\/|$)/.test(ctx.url.pathname) ||
          ['/sitemap.xml', '/robots.txt'].includes(ctx.url.pathname);
      if (api) {
        if (!admin && ctx.url.pathname.startsWith('/api/admin/')) return new Response(null, { status: 404 });
        return proxyRequest(ctx);
      }
      if (admin && ctx.url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n');
      if (admin && ctx.url.pathname.startsWith('/api/')) return new Response(null, { status: 404 });
      if (!admin && ctx.url.pathname === '/admin')
        return process.env.ADMIN_SITE_URL
          ? ctx.redirect(process.env.ADMIN_SITE_URL + '/')
          : new Response(null, { status: 404 });
      const payload = await presentation(ctx.url.pathname + ctx.url.search);
      if (payload instanceof Response) return payload;
      Object.assign(ctx.locals, payload.locals, { presentation: payload });
      const response = await next();
      const headers = new Headers(response.headers);
      headers.set('cache-control', 'private, no-store');
      headers.set('x-content-type-options', 'nosniff');
      headers.set('x-frame-options', 'DENY');
      headers.set('referrer-policy', 'strict-origin-when-cross-origin');
      headers.set(
        'content-security-policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://t1.kakaocdn.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.kakaocdn.net; connect-src 'self' https://*.kakao.com; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      );
      if (admin) headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
      return new Response(response.body, { status: payload.status || response.status, headers });
    } catch (error) {
      console.error('frontend_api_failed', error instanceof Error ? error.name : 'Error');
      return new Response('연결을 확인하고 있습니다. 잠시 후 다시 시도해 주세요.', {
        status: 503,
        headers: { 'cache-control': 'no-store' },
      });
    }
  });
});
