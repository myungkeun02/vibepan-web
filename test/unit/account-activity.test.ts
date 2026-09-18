import { expect, test } from 'vitest';
import { accountActivities, activityHref, activityPage } from '../../src/lib/account-activity';
import type { PageData } from '../../src/contracts/me';
const sample = (extra: Partial<PageData> = {}): PageData => ({
  user: {},
  mine: [],
  comments: [],
  saved: [],
  voted: [],
  savedPosts: [],
  suggestions: [],
  services: [],
  serviceEdits: [],
  labels: { pending: '검토 대기' },
  ...extra,
});
test('all combines each activity kind without losing identical IDs, comments link to their post', () => {
  const rows = accountActivities(
    sample({
      mine: [{ id: 'same', title: '글', body: '', created_at: '2026-09-01' }],
      comments: [{ id: 'same', post_id: 'same', title: '글', body: '댓글', created_at: '2026-09-02' }],
      services: [{ id: 'same', name: '서비스', status: 'pending' }],
      serviceEdits: [{ id: 'same', name: '수정 제안', status: 'pending' }],
      suggestions: [{ id: 'same', title: '제안', status: 'pending' }],
      voted: [{ slug: 'tool', created_at: '2026-09-03' }],
      saved: [{ slug: 'tool', nameKo: '도구' } as any],
      savedPosts: [{ id: 'same', title: '저장한 글', created_at: '2026-09-04' }],
    }),
    () => '도구',
  );
  expect(rows).toHaveLength(8);
  expect(new Set(rows.map((row) => row.id)).size).toBe(8);
  expect(rows.find((row) => row.category === 'comments')?.href).toBe('/community/same#comment-same');
  expect(rows.filter((row) => row.category === 'saved').map((row) => row.date)).toEqual([
    undefined,
    undefined,
  ]);
});
test('tabs include all types of saves and proposals and do not mix comments with posts', () => {
  const rows = accountActivities(
    sample({
      mine: [{ id: 'p', title: '글' }],
      comments: [{ id: 'c', body: '댓글' }],
      saved: [{ slug: 'tool', nameKo: '도구' } as any],
      savedPosts: [{ id: 'p', title: '저장한 글' }],
      suggestions: [{ id: 's', title: '제안' }],
      serviceEdits: [{ id: 'e', name: '수정' }],
    }),
    () => undefined,
  );
  expect(activityPage(rows, new URLSearchParams('tab=comments')).items.map((row) => row.category)).toEqual([
    'comments',
  ]);
  expect(activityPage(rows, new URLSearchParams('tab=saved')).total).toBe(2);
  expect(activityPage(rows, new URLSearchParams('tab=suggestions')).total).toBe(2);
  expect(activityPage(rows, new URLSearchParams()).counts).toMatchObject({
    all: 6,
    posts: 1,
    comments: 1,
    services: 0,
  });
});
test('pagination is bounded, invalid parameters are safe, changing category resets the page', () => {
  const rows = accountActivities(
    sample({ mine: Array.from({ length: 15 }, (_, i) => ({ id: String(i), title: '글 ' + i })) }),
    () => undefined,
  );
  expect(activityPage(rows, new URLSearchParams('tab=posts&page=2')).items).toHaveLength(3);
  expect(activityPage(rows, new URLSearchParams('tab=posts&page=999')).page).toBe(2);
  for (const page of ['NaN', '-9', '1.5', 'Infinity'])
    expect(activityPage(rows, new URLSearchParams('page=' + page)).page).toBe(1);
  expect(activityPage(rows, new URLSearchParams('tab=unknown')).tab.id).toBe('all');
  expect(activityPage(rows, new URLSearchParams('tab=comments&page=2'))).toMatchObject({
    page: 1,
    pages: 1,
    total: 0,
  });
  expect(activityHref('comments')).toBe('/me?tab=comments#my-activity');
});
