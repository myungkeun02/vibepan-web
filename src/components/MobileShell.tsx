import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import UiIcon from './UiIcon';

import BrandMark from './BrandMark';
export default async function ViewMobileShellastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const { unread = 0, title, back = '/' } = props;

  const path = ctx.url.pathname;

  const user = ctx.locals.user;

  const inCommunity = path.startsWith('/community');

  const inAccount =
    ['/me', '/login', '/signup', '/notifications', '/onboarding', '/forgot', '/reset', '/admin'].includes(
      path,
    ) || path.startsWith('/profile');

  const items = [
    { href: '/', label: 'SaaS 탐색', icon: 'grid', active: !inCommunity && !inAccount && path !== '/stats' },
    { href: '/community', label: '커뮤니티', icon: 'chat', active: inCommunity },
    { href: '/stats', label: '등록 현황', icon: 'chart', active: path === '/stats' },
    { href: '/me', label: '내 활동', icon: 'user', active: inAccount },
  ];
  return (
    <>
      <header className={'mobile-header mobile-only'}>
        {title ? (
          <>
            <>
              <a className={'mobile-icon-button'} href={back} aria-label={'목록으로 돌아가기'}>
                <UiIcon name={'back'} />
              </a>
              <span className={'mobile-page-title'}>{title}</span>
            </>
          </>
        ) : (
          <a className={'brand'} href={'/'}>
            <BrandMark />
            {'\n        바이브코딩가능?\n      '}
          </a>
        )}
        <div className={'mobile-header-actions'}>
          <button className={'mobile-icon-button'} data-theme-toggle={''} aria-label={'화면 테마 전환'}>
            {'◐'}
          </button>
          {user ? (
            <a className={'mobile-icon-button'} href={'/notifications'} aria-label={`알림 ${unread}개`}>
              <UiIcon name={'bell'} /> {unread > 0 && <span className={'notification-dot'} />}
            </a>
          ) : (
            <a
              className={'mobile-login'}
              href={'/login?returnTo=' + encodeURIComponent(path + ctx.url.search)}
            >
              {'\n          로그인\n        '}
            </a>
          )}
        </div>
      </header>
      <nav className={'mobile-tabbar mobile-only'} aria-label={'모바일 주요 메뉴'}>
        {items.map((item, rowIndex1) => (
          <a key={rowIndex1} href={item.href} aria-current={item.active ? 'page' : undefined}>
            <>
              <UiIcon name={item.icon} /> <span>{item.label}</span>
            </>
          </a>
        ))}
      </nav>
    </>
  );
}
