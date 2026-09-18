import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import type { PageData } from '../../contracts/profile/[id]';

import Mascot from '../../components/Mascot';

import EmptyState from '../../components/EmptyState';

import Base from '../../layouts/Base';

import PostRow from '../../components/PostRow';
export default async function Viewidastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { u, items } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={u ? u.nickname + '님의 프로필' : '프로필을 찾을 수 없어요'} noindex={!u}>
        <section className={'page-head narrow'}>
          {!u && <Mascot />}
          <div className={'eyebrow'}>{'회원 프로필'}</div>
          <h1 style={styleObject('margin-top:15px')}> {u?.nickname || '프로필을 찾을 수 없어요'} </h1>
          <p>{u ? u.bio || '아직 소개를 작성하지 않았어요.' : '탈퇴했거나 공개되지 않은 프로필이에요.'}</p>
        </section>
        {u && (
          <section className={'narrow'}>
            <h2>{'작성한 글'}</h2>
            {items.map((p, rowIndex1) => (
              <PostRow key={rowIndex1} post={p} />
            ))}
            {!items.length && (
              <EmptyState compact={true}>
                <p>{'아직 작성한 글이 없어요.'}</p>
              </EmptyState>
            )}
          </section>
        )}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { u, items } = ctx.locals.presentation.data as PageData;
  return createMetadata(
    { title: u ? u.nickname + '님의 프로필' : '프로필을 찾을 수 없어요', noindex: !u },
    ctx.url.pathname,
  );
}
