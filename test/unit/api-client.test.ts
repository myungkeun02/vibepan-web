import { test, expect, vi, afterEach } from 'vitest';
import { withApi, apiRequest, readResource } from '../../src/lib/api-client';
const key = 'test-only-transport-key-'.repeat(3);
process.env.API_ORIGIN = 'http://127.0.0.1:5999';
process.env.API_PROXY_SECRET = key;
process.env.FRONTEND_ORIGIN = 'https://example.test';
const ctx = (cookie = '') =>
  ({
    request: new Request('https://example.test/', { headers: { cookie } }),
    url: new URL('https://example.test/'),
    clientAddress: '127.0.0.9',
  }) as any;
afterEach(() => vi.unstubAllGlobals());
test('rejects attempts to send the server key to another origin', async () => {
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  for (const url of ['//evil.example/path', 'https://evil.example/', '/\\evil.example/'])
    await expect(withApi(ctx(), async () => apiRequest(url))).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
});
test('forwards rotated cookies to following calls and the browser without exposing the key', async () => {
  const seen: Headers[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, init) => {
      seen.push(new Headers(init.headers));
      return new Response('{}', {
        headers: { 'set-cookie': 'session=replaced; Path=/; HttpOnly; Secure; SameSite=Lax' },
      });
    }),
  );
  const response = await withApi(ctx('session=old'), async () => {
    await apiRequest('/api/presentation');
    await apiRequest('/api/resources/totals');
    return new Response('page');
  });
  expect(seen[0].get('cookie')).toBe('session=old');
  expect(seen[1].get('cookie')).toBe('session=replaced');
  expect(seen[0].get('x-vibepan-api-key')).toBe(key);
  expect(response.headers.get('x-vibepan-api-key')).toBeNull();
  expect(response.headers.getSetCookie()).toHaveLength(1);
});
test('request caches are isolated between different signed-in visitors', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, init) => Response.json({ cookie: new Headers(init.headers).get('cookie') })),
  );
  const output = await Promise.all(
    ['session=a', 'session=b'].map((cookie) =>
      withApi(ctx(cookie), async () => {
        const one = await readResource('totals');
        const two = await readResource('totals');
        expect(one).toEqual(two);
        return Response.json(one);
      }),
    ),
  );
  expect((await output[0].json()).cookie).toBe('session=a');
  expect((await output[1].json()).cookie).toBe('session=b');
  expect(fetch).toHaveBeenCalledTimes(2);
});
