import type { NextRequest } from 'next/server';
import { withApi, proxyRequest } from './api-client';
import type { RequestContext } from './request-context';
export async function routeProxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (/^\/api\/(?:presentation|resources|session)(?:\/|$)/.test(path))
    return new Response(null, { status: 404 });
  if (path.startsWith('/api/admin/')) return new Response(null, { status: 404 });

  const ctx: RequestContext = {
    request,
    url: request.nextUrl,
    params: {},
    locals: {},
    clientAddress: request.headers.get('x-vibepan-client-address') || 'unknown',
  };
  return withApi(ctx, () => proxyRequest(ctx));
}
