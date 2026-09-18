interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  og?: string;
  jsonld?: any[];
  noindex?: boolean;
  pageKind?: string;
  mobileTitle?: string;
  mobileBack?: string;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import MobileShell from '../components/MobileShell';

import BrandMark from '../components/BrandMark';

import { brand, absolute } from '../lib/config';
export default async function ViewBaseastro(props: Props & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const {
    title = brand.name,
    description = brand.description,
    canonical = ctx.url.pathname,
    og = '/og/default.png',
    jsonld = [],
    noindex = false,
    pageKind,
    mobileTitle,
    mobileBack,
  } = props;

  const user = ctx.locals.user;

  const unread = ctx.locals.presentation.unread;

  const structured = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.name,
      url: absolute('/'),
      logo: absolute('/brand/vibepan-robot-256.png'),
    },
    ...jsonld,
  ];
  return (
    <>
      {structured.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ))}

      <div data-page={pageKind}>
        <a href={'#main'} className={'skip'}>
          {'본문으로 건너뛰기'}
        </a>
        <header className={'site-header'}>
          <div className={'wrap'}>
            <a className={'brand'} href={'/'}>
              <BrandMark />
              {brand.name}
            </a>
            <nav className={'nav'} aria-label={'주 메뉴'}>
              <a href={'/'} aria-current={ctx.url.pathname === '/' ? 'page' : undefined}>
                {'SaaS 탐색'}
              </a>
              <a
                href={'/community'}
                aria-current={ctx.url.pathname.startsWith('/community') ? 'page' : undefined}
              >
                {'커뮤니티'}
              </a>
              <a href={'/stats'}>{'등록 현황'}</a>
            </nav>
            <div className={'header-actions'}>
              <button className={'icon-button'} data-theme-toggle={''} aria-label={'화면 테마 전환'}>
                {'◐'}
              </button>
              {user ? (
                <>
                  <a href={'/notifications'} aria-label={`알림 ${unread}개`}>
                    {'\n                  알림'}
                    {unread > 0 && <span className={'accent'}> {unread}</span>}
                  </a>
                  <a href={'/me'}>{'내 활동'}</a>
                  {user.role === 'admin' && <a href={'/admin'}>{'관리'}</a>}
                </>
              ) : (
                <a className={'button secondary small'} href={'/login'}>
                  {'\n                로그인\n              '}
                </a>
              )}
            </div>
          </div>
        </header>
        <MobileShell unread={unread} title={mobileTitle} back={mobileBack} />
        <main id={'main'} className={'wrap'}>
          {props.children}
        </main>
        <footer className={'site-footer'}>
          <div className={'wrap'}>
            <div className={'flex between wrap-flex'}>
              <a href={'/'} className={'brand'}>
                <BrandMark />
                {brand.name}
              </a>
              <div className={'flex wrap-flex'}>
                <a href={'/rebuild-prompt'}>{'이 사이트를 만든 프롬프트'}</a>
                <a href={'/services/new'}>{'SaaS 등록'}</a>
                <a href={'/suggest'}>{'정보 수정 제안'}</a>
                <a href={'/privacy'}>{'개인정보 처리 안내'}</a>
                <a href={'/terms'}>{'이용약관'}</a>
              </div>
            </div>
            <p className={'footer-note'}>
              {
                '\n          대체 가능성은 소개한 기능을 기준으로 판단했어요. 이용 횟수는 외부 추적 도구 없이 집계해요. · 소스 코드: MIT\n        '
              }
            </p>
          </div>
        </footer>
        <div id={'toast'} className={'toast'} role={'status'} hidden={true} />
      </div>
    </>
  );
}
