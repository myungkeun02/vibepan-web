import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/notifications';

import EmptyState from '../components/EmptyState';

import Base from '../layouts/Base';
export default async function Viewnotificationsastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { items } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={'내 알림'} noindex={true}>
        <section className={'narrow'} style={styleObject('margin:auto')}>
          <header className={'page-head'}>
            <div className={'flex between'}>
              <h1>{'알림'}</h1>
              <form data-api={''} method={'post'} action={'/api/notifications/read'}>
                <input name={'csrf'} type={'hidden'} defaultValue={ctx.locals.csrf} />
                <button className={'button secondary small'} type={'submit'}>
                  {'모두 읽음으로 표시'}
                </button>
              </form>
            </div>
          </header>
          {items.map((n, rowIndex1) => (
            <article key={rowIndex1} className={'post-preview'}>
              <a href={'/community/' + n.post_id + (n.comment_id ? '#comment-' + n.comment_id : '')}>
                <>
                  <span className={'small accent'}>{n.is_read ? '읽음' : '● 새 알림'}</span>
                  <h3>{n.label}</h3> <p>{n.title}</p>
                </>
              </a>
              {!n.is_read && (
                <form data-api={''} method={'post'} action={'/api/notifications/read'}>
                  <input name={'csrf'} type={'hidden'} defaultValue={ctx.locals.csrf} />
                  <input name={'id'} type={'hidden'} defaultValue={n.id} />
                  <button className={'text-button'} type={'submit'}>
                    {'\n                읽음 표시\n              '}
                  </button>
                </form>
              )}
            </article>
          ))}
          {!items.length && (
            <EmptyState>
              <>
                <h3>{'새로운 알림이 없어요.'}</h3> <p>{'댓글과 답글이 달리면 여기에서 알려드릴게요.'}</p>
                <a href={'/community'} className={'button secondary'}>
                  {'\n              커뮤니티 둘러보기\n            '}
                </a>
              </>
            </EmptyState>
          )}
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { items } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '내 알림', noindex: true }, ctx.url.pathname);
}
