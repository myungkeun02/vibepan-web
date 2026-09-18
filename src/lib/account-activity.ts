import type { PageData } from '../contracts/me';
import { serviceStatuses, editStatuses } from './service-schema';
import { boards } from './config';

export const activityTabs = [
  { id: 'all', label: '전체', empty: '아직 남긴 활동이 없어요.', href: '/', action: '도구 둘러보기' },
  { id: 'posts', label: '글', empty: '아직 작성한 글이 없어요.', href: '/community/new', action: '글 쓰기' },
  {
    id: 'comments',
    label: '댓글',
    empty: '아직 작성한 댓글이 없어요.',
    href: '/community',
    action: '커뮤니티 둘러보기',
  },
  {
    id: 'services',
    label: 'SaaS',
    empty: '아직 등록한 SaaS가 없어요.',
    href: '/services/new',
    action: 'SaaS 등록하기',
  },
  {
    id: 'saved',
    label: '저장',
    empty: '아직 저장한 도구나 글이 없어요.',
    href: '/',
    action: '도구 둘러보기',
  },
  {
    id: 'suggestions',
    label: '제안',
    empty: '아직 남긴 제안이 없어요.',
    href: '/suggest',
    action: '제안하기',
  },
  {
    id: 'votes',
    label: '대체 경험',
    empty: '아직 대체 경험을 표시한 도구가 없어요.',
    href: '/',
    action: '도구 둘러보기',
  },
] as const;
export type ActivityTab = (typeof activityTabs)[number]['id'];
export type Activity = {
  id: string;
  category: Exclude<ActivityTab, 'all'>;
  kind: string;
  title: string;
  description?: string;
  href?: string;
  date?: string;
  status?: string;
};
const excerpt = (value = '') =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
const timestamp = (value?: string) => {
  if (!value) return 0;
  const date = value.replace(' ', 'T');
  return Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(date) ? date : date + 'Z') || 0;
};
export function activityDate(value?: string) {
  const time = timestamp(value);
  return time
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul',
      }).format(time)
    : '';
}
export function accountActivities(
  data: PageData,
  toolName: (slug: string) => string | undefined,
): Activity[] {
  const rows: Activity[] = [
    ...data.mine.map((p) => ({
      id: 'post-' + p.id,
      category: 'posts' as const,
      kind: boards[p.board] || '글',
      title: p.title,
      description: excerpt(p.body),
      href: '/community/' + p.id,
      date: p.created_at,
    })),
    ...data.comments.map((c) => ({
      id: 'comment-' + c.id,
      category: 'comments' as const,
      kind: '댓글',
      title: excerpt(c.body),
      description: c.title,
      href: '/community/' + c.post_id + '#comment-' + c.id,
      date: c.created_at,
    })),
    ...data.services.map((s) => ({
      id: 'service-' + s.id,
      category: 'services' as const,
      kind: '등록한 SaaS',
      title: s.name,
      description: s.tagline,
      href: '/services/' + s.id,
      date: s.updated_at || s.created_at,
      status: serviceStatuses[s.status] || '검토 중',
    })),
    ...data.serviceEdits.map((e) => ({
      id: 'edit-' + e.id,
      category: 'suggestions' as const,
      kind: 'SaaS 수정 제안',
      title: e.name,
      description: excerpt(e.reason),
      href: '/services/edits/' + e.id,
      date: e.created_at,
      status: editStatuses[e.status] || '검토 중',
    })),
    ...data.suggestions.map((s) => ({
      id: 'suggestion-' + s.id,
      category: 'suggestions' as const,
      kind: '정보 제안',
      title: s.title,
      description: excerpt(s.body),
      date: s.created_at,
      status: data.labels[s.status] || '검토 중',
    })),
    ...data.voted.map((v) => ({
      id: 'vote-' + v.slug,
      category: 'votes' as const,
      kind: '대체 경험',
      title: toolName(v.slug) || '공개가 종료된 도구',
      href: toolName(v.slug) ? '/' + v.slug : undefined,
      date: v.created_at,
    })),
    // The current API does not return bookmark timestamps. Do not label the post's
    // publication date as the date the member saved it, or invent a saved date.
    ...data.saved
      .filter((a) => !!a)
      .map((a) => ({
        id: 'saved-tool-' + a.slug,
        category: 'saved' as const,
        kind: '저장한 도구',
        title: a.nameKo,
        description: a.summary,
        href: '/' + a.slug,
      })),
    ...data.savedPosts.map((p) => ({
      id: 'saved-post-' + p.id,
      category: 'saved' as const,
      kind: '저장한 글',
      title: p.title,
      description: excerpt(p.body),
      href: '/community/' + p.id,
    })),
  ];
  return rows.sort((a, b) => timestamp(b.date) - timestamp(a.date));
}
export function activityPage(rows: Activity[], params: URLSearchParams) {
  const tab = activityTabs.find((tab) => tab.id === params.get('tab')) || activityTabs[0];
  const filtered = tab.id === 'all' ? rows : rows.filter((row) => row.category === tab.id);
  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requested = Number(params.get('page'));
  const page = Number.isSafeInteger(requested) ? Math.min(pages, Math.max(1, requested)) : 1;
  return {
    tab,
    page,
    pages,
    total: filtered.length,
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    counts: Object.fromEntries(
      activityTabs.map((tab) => [
        tab.id,
        tab.id === 'all' ? rows.length : rows.filter((row) => row.category === tab.id).length,
      ]),
    ),
  };
}
export const activityHref = (tab: ActivityTab, page = 1) =>
  '/me?' + new URLSearchParams({ tab, ...(page > 1 ? { page: String(page) } : {}) }) + '#my-activity';
