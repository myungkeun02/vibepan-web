import { AsyncLocalStorage } from 'node:async_hooks';
import type { APIContext } from 'astro';
type Scope = {
  ctx: APIContext;
  cookies: Map<string, string>;
  setCookies: Map<string, string>;
  cache: Map<string, Promise<any>>;
  presentation: any;
};
const scope = new AsyncLocalStorage<Scope>();
export const currentPresentation = () => scope.getStore()!.presentation;
export function revive(value: any): any {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && typeof value.__vibepan_search__ === 'string')
      return new URLSearchParams(value.__vibepan_search__);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, revive(v)]));
  }
  return value;
}
export async function withApi(ctx: APIContext, work: () => Promise<Response>) {
  const cookies = new Map(
    (ctx.request.headers.get('cookie') || '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const at = s.indexOf('=');
        return [s.slice(0, at), s.slice(at + 1)] as [string, string];
      }),
  );
  return scope.run(
    { ctx, cookies, setCookies: new Map(), cache: new Map(), presentation: null },
    async () => {
      const response = await work();
      const headers = new Headers(response.headers);
      for (const cookie of scope.getStore()!.setCookies.values()) headers.append('set-cookie', cookie);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    },
  );
}
export async function apiRequest(resource: string, init: RequestInit = {}) {
  const active = scope.getStore();
  if (!active) throw new Error('API request outside rendering context');
  const base = process.env.API_ORIGIN,
    secret = process.env.API_PROXY_SECRET;
  if (!base || !secret || secret.length < 32)
    throw new Error('API_ORIGIN and a 32+ character API_PROXY_SECRET are required');
  const target = new URL(base);
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password)
    throw new Error('Invalid API origin');
  const location = new URL(resource, 'http://path.local');
  if (location.origin !== 'http://path.local' || /[\\]/.test(resource)) throw new Error('Invalid API path');
  target.pathname = location.pathname;
  target.search = location.search;
  const headers = new Headers(init.headers);
  headers.set('x-vibepan-api-key', secret);
  headers.set('cookie', [...active.cookies].map(([k, v]) => k + '=' + v).join('; '));
  headers.set('x-vibepan-client-ip', active.ctx.clientAddress);
  const frontend = new URL(process.env.FRONTEND_ORIGIN || process.env.SITE_URL!);
  headers.set('x-forwarded-host', frontend.host);
  headers.set('x-forwarded-proto', frontend.protocol.slice(0, -1));
  const response = await fetch(target, {
    ...init,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  });
  for (const cookie of response.headers.getSetCookie()) {
    const pair = cookie.split(';')[0];
    const at = pair.indexOf('=');
    const name = pair.slice(0, at);
    active.cookies.set(name, pair.slice(at + 1));
    active.setCookies.set(name, cookie);
  }
  return response;
}
export async function readResource(kind: string, input: Record<string, unknown> = {}) {
  const active = scope.getStore()!;
  const query = new URLSearchParams(Object.entries(input).map(([k, v]) => [k, String(v)]));
  const resource = '/api/resources/' + kind + '?' + query;
  if (!active.cache.has(resource))
    active.cache.set(
      resource,
      (async () => {
        const response = await apiRequest(resource);
        if (!response.ok) throw new Error('Resource API failed: ' + response.status);
        return revive(await response.json());
      })(),
    );
  return active.cache.get(resource);
}
export async function presentation(path: string) {
  const response = await apiRequest('/api/presentation?path=' + encodeURIComponent(path));
  if (response.status !== 200) return response;
  const payload = revive(await response.json());
  scope.getStore()!.presentation = payload;
  return payload;
}
export async function proxyRequest(ctx: APIContext) {
  const headers = new Headers();
  for (const key of ['content-type', 'accept', 'origin', 'referer', 'x-csrf-token']) {
    const value = ctx.request.headers.get(key);
    if (value) headers.set(key, value);
  }
  const method = ctx.request.method;
  if (!['GET', 'HEAD', 'POST'].includes(method)) return new Response(null, { status: 405 });
  const limit = 6 * 1024 * 1024;
  let body: Uint8Array | undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    if (Number(ctx.request.headers.get('content-length')) > limit) return new Response(null, { status: 413 });
    const reader = ctx.request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader)
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        size += result.value.length;
        if (size > limit) {
          await reader.cancel();
          return new Response(null, { status: 413 });
        }
        chunks.push(result.value);
      }
    body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
  }
  const response = await apiRequest(ctx.url.pathname + ctx.url.search, {
    method,
    headers,
    body: body as any,
  });
  const output = new Headers(response.headers);
  output.delete('set-cookie');
  return new Response(response.body, { status: response.status, headers: output });
}
