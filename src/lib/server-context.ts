import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { createScope, presentation } from './api-client';
import type { RequestContext } from './request-context';
export const requestScope = cache(async () => {
  const h = await headers();
  const origin = process.env.FRONTEND_ORIGIN || process.env.SITE_URL || 'http://localhost:4310';
  const path = h.get('x-vibepan-path') || '/';
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Invalid page path');
  const url = new URL(path, origin);
  const ctx: RequestContext = {
    request: new Request(url, { headers: h }),
    url,
    params: {},
    locals: {},
    clientAddress: h.get('x-vibepan-client-address') || 'unknown',
  };
  return createScope(ctx);
});
export const getPageContext = cache(async () => {
  const scope = await requestScope();
  const payload = await presentation(scope.ctx.url.pathname + scope.ctx.url.search);
  if (payload instanceof Response) {
    if (payload.status >= 300 && payload.status < 400) redirect(payload.headers.get('location') || '/');
    if (payload.status === 404) notFound();
    throw new Error('Page API unavailable');
  }
  scope.ctx.locals = { ...payload.locals, presentation: payload };
  return { ...scope.ctx, status: payload.status || 200 };
});
