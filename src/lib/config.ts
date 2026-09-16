export const siteUrl = (process.env.SITE_URL || 'http://localhost:4310').replace(/\/$/, '');
export const brand = {
  name: '바이브코딩가능?',
  en: 'Can I Vibecode It? KR',
  description:
    '도구별로 직접 만들 수 있는 기능과 제작 프롬프트를 확인하고, SaaS 소개와 제작 후기를 찾아보세요.',
};
export const absolute = (path: string) => new URL(path, siteUrl).href;
export const boards: Record<string, string> = {
  builds: '제작 후기·작품',
  questions: '질문·도움',
  prompts: '프롬프트 연구',
  general: '자유 토론',
  notice: '공지',
};
export const verdicts = {
  yes: { label: '대체 가능', en: 'YES', symbol: '↗' },
  kinda: { label: '일부 대체 가능', en: 'KINDA', symbol: '≈' },
  no: { label: '대체 어려움', en: 'NOT REALLY', symbol: '×' },
};
export const money = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');
