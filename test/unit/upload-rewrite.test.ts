import { afterEach, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { uploadRewrite } from '../../src/lib/upload-rewrite';
afterEach(() => vi.unstubAllEnvs());
test('streams uploads only to the configured API and replaces untrusted transport headers', () => {
  const secret = 'test-only-transport-key-'.repeat(3);
  vi.stubEnv('API_ORIGIN', 'https://api.example.test');
  vi.stubEnv('API_PROXY_SECRET', secret);
  const request = new NextRequest('https://example.test/api/upload?target=https://evil.test', {
    method: 'POST',
    headers: {
      cookie: 'session=present',
      origin: 'https://example.test',
      'x-csrf-token': 'csrf',
      'content-type': 'multipart/form-data; boundary=test',
      'x-vibepan-api-key': 'spoof',
      'x-vibepan-client-ip': 'spoof',
      'x-vibepan-admin-proxy': 'spoof',
      'x-forwarded-for': 'spoof',
    },
    body: 'file-content',
  });
  const response = uploadRewrite(request, '192.0.2.10');
  expect(new URL(response.headers.get('x-middleware-rewrite')!).origin).toBe('https://api.example.test');
  const upstream = (name: string) => response.headers.get('x-middleware-request-' + name);
  expect(upstream('x-vibepan-api-key')).toBe(secret);
  expect(upstream('x-vibepan-client-ip')).toBe('192.0.2.10');
  expect(upstream('cookie')).toBe('session=present');
  expect(upstream('x-csrf-token')).toBe('csrf');
  expect(upstream('origin')).toBe('https://example.test');
  expect(upstream('x-vibepan-admin-proxy')).toBeNull();
  expect(upstream('x-forwarded-for')).toBeNull();
  expect(request.bodyUsed).toBe(false);
});
test('fails closed with missing secrets or an unsafe API destination', () => {
  const request = new NextRequest('https://example.test/api/upload');
  vi.stubEnv('API_ORIGIN', 'https://api.example.test');
  vi.stubEnv('API_PROXY_SECRET', '');
  expect(() => uploadRewrite(request, 'unknown')).toThrow();
  vi.stubEnv('API_PROXY_SECRET', 'test-only-secret'.repeat(3));
  for (const origin of ['file:///tmp/upload', 'https://user:password@example.test']) {
    vi.stubEnv('API_ORIGIN', origin);
    expect(() => uploadRewrite(request, 'unknown')).toThrow();
  }
});
