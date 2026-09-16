import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/me';

import EmptyState from '../components/EmptyState';

import BrandIntro from '../components/BrandIntro';

import ServiceCard from '../components/ServiceCard';

import Base from '../layouts/Base';

import PostRow from '../components/PostRow';

import { editStatuses } from '../lib/service-schema';

import { getApp } from '../lib/apps';
export default async function Viewmeastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { user, mine, comments, saved, voted, savedPosts, suggestions, services, serviceEdits, labels } = ctx
    .locals.presentation.data as PageData;
  return (
    <>
      <Base pageKind={'account'} title={'내 활동'} noindex={true}>
        <header className={'page-head'}>
          <BrandIntro>
            <h1>{'내 활동'}</h1>
            <p>
              {user.nickname}
              {'님의 저장 목록과 작성한 글, 등록한 SaaS입니다.'}
            </p>
          </BrandIntro>
        </header>
        <nav className={'mobile-only mobile-account-links'} aria-label={'내 활동 바로가기'}>
          <a href={'#saved-tools'}>
            {'저장한 도구 '}
            <strong>{saved.length}</strong>
          </a>
          <a href={'#my-posts'}>
            {'내가 쓴 글 '}
            <strong>{mine.length}</strong>
          </a>
          <a href={'#my-services'}>
            {'등록한 SaaS '}
            <strong>{services.length}</strong>
          </a>
          <a href={'#profile-settings'}>{'프로필 설정 ↗'}</a>
          {user.role === 'admin' && <a href={'/admin'}>{'관리자 화면 ↗'}</a>}
        </nav>
        <div className={'profile-grid'}>
          <aside>
            <div className={'meta-box'} id={'profile-settings'}>
              <p className={'small'}>{user.email}</p>
              <p className={'small'}>
                {user.email_verified_at ? '이메일 확인 완료 ✓' : '아직 이메일 주소를 확인하지 않았어요.'}
              </p>
              {!user.email_verified_at && (
                <form data-api={''} action={'/api/auth/send-verification'} method={'post'}>
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <button type={'submit'} className={'button secondary small'}>
                    {'\n                확인 메일 받기\n              '}
                  </button>
                  <p className={'form-status'} role={'status'} />
                </form>
              )}
              <h2>{'프로필'}</h2>
              <form data-api={''} action={'/api/profile/update'} method={'post'}>
                <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                <label className={'form-field'}>
                  <span>{'닉네임'}</span>
                  <input
                    name={'nickname'}
                    defaultValue={user.nickname}
                    required={true}
                    minLength={2}
                    maxLength={24}
                  />
                </label>
                <label className={'form-field'}>
                  <span>{'소개'}</span>
                  <textarea aria-label={'소개'} name={'bio'} maxLength={500} defaultValue={user.bio} />
                </label>
                <button type={'submit'} className={'primary'}>
                  {'프로필 저장'}
                </button>
                <p className={'form-status'} role={'status'} />
              </form>
              <form
                data-api={''}
                action={'/api/auth/logout'}
                method={'post'}
                style={styleObject('margin-top:24px')}
              >
                <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                <button className={'text-button'} type={'submit'}>
                  {'로그아웃'}
                </button>
              </form>
            </div>
            <details className={'meta-box'}>
              <summary>{'계정 탈퇴'}</summary>
              <p style={styleObject('margin-top:15px')}>
                {
                  '\n          작성한 글과 댓글의 내용, 등록한 SaaS, 대체 기록, 저장한 목록과 이메일 정보가 삭제돼요. 모든 기기에서\n          로그아웃됩니다.\n        '
                }
              </p>
              <form
                data-api={''}
                data-confirm={'정말 탈퇴할까요? 계정 정보를 복구할 수 없습니다.'}
                action={'/api/profile/delete'}
                method={'post'}
              >
                <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                {user.password && (
                  <label className={'form-field'}>
                    <>
                      <span>{'현재 비밀번호'}</span>
                      <input
                        type={'password'}
                        name={'password'}
                        required={true}
                        autoComplete={'current-password'}
                      />
                    </>
                  </label>
                )}
                <label className={'form-field'}>
                  <span>{'“탈퇴합니다”를 입력해 주세요'}</span>
                  <input name={'confirm'} placeholder={'탈퇴합니다'} required={true} />
                </label>
                <button className={'button secondary danger'} type={'submit'}>
                  {'계정 탈퇴'}
                </button>
                <p className={'form-status'} role={'status'}></p>
              </form>
            </details>
          </aside>
          <section>
            <h2 id={'saved-tools'}>
              {'저장한 도구 '}
              <span className={'count-label'}>{saved.length}</span>
            </h2>
            <div className={'tabs'}>
              {saved.map(
                (a) =>
                  a && (
                    <a href={'/' + a.slug}>
                      {a.nameKo}
                      {' ↗'}
                    </a>
                  ),
              )}
            </div>
            {!saved.length && (
              <EmptyState compact={true}>
                <>
                  <p>{'나중에 만들고 싶은 도구를 저장해 보세요.'}</p>
                  <a href={'/'} className={'button secondary'}>
                    {'\n                도구 둘러보기\n              '}
                  </a>
                </>
              </EmptyState>
            )}
            <div className={'section'}>
              <h2>{'대체 경험을 표시한 도구'}</h2>
              {voted.map((v, rowIndex1) => (
                <a key={rowIndex1} className={'post-preview'} href={'/' + v.slug}>
                  {getApp(v.slug)?.nameKo || '공개가 종료된 도구'}
                  <span className={'muted small'}>
                    {' · '}
                    {v.created_at.slice(0, 10)}
                  </span>
                </a>
              ))}
              {!voted.length && <p className={'muted'}>{'아직 대체 경험을 표시한 도구가 없습니다.'}</p>}
            </div>
            <div className={'section'}>
              <div className={'flex between wrap-flex'}>
                <h2 id={'my-services'}>{'등록한 SaaS'}</h2>
                <a className={'small accent'} href={'/services/new'}>
                  {'SaaS 등록하기 +'}
                </a>
              </div>
              <div className={'service-account-list'}>
                {services.map((s) => (
                  <ServiceCard service={s} showStatus={true} />
                ))}
              </div>
              {!services.length && (
                <p className={'muted'}>
                  {'추천하고 싶은 SaaS를 등록하면 검토 상태를 여기에서 확인할 수 있어요.'}
                </p>
              )}
            </div>
            <div className={'section'}>
              <h2 id={'my-service-edits'}>{'SaaS 수정 제안'}</h2>
              {serviceEdits.map((e, rowIndex2) => (
                <a key={rowIndex2} className={'post-preview'} href={'/services/edits/' + e.id}>
                  <>
                    <strong>{e.name}</strong> <span className={'badge'}>{editStatuses[e.status]}</span>
                    <p>{e.reason}</p>
                  </>
                </a>
              ))}
              {!serviceEdits.length && <p className={'muted'}>{'등록한 수정 제안이 없습니다.'}</p>}
            </div>
            <div className={'section'}>
              <h2 id={'my-posts'}>{'내가 쓴 글'}</h2>
              {mine.map((p) => (
                <PostRow post={p} />
              ))}
              {!mine.length && (
                <a href={'/community/new'} className={'button secondary'}>
                  {'\n              첫 이야기 남기기 ↗\n            '}
                </a>
              )}
            </div>
            <div className={'section'}>
              <h2>{'내 댓글'}</h2>
              {comments.map((c, rowIndex3) => (
                <a
                  key={rowIndex3}
                  className={'post-preview'}
                  href={'/community/' + c.post_id + '#comment-' + c.id}
                >
                  <>
                    <strong>{c.title}</strong> <p>{c.body}</p>
                  </>
                </a>
              ))}
              {!comments.length && <p className={'muted'}>{'아직 작성한 댓글이 없어요.'}</p>}
            </div>
            <div className={'section'}>
              <h2>{'저장한 글'}</h2>
              {savedPosts.map((p) => (
                <PostRow post={p} />
              ))}
              {!savedPosts.length && <p className={'muted'}>{'다시 읽고 싶은 글을 저장해 보세요.'}</p>}
            </div>
            <div className={'section'}>
              <h2>{'내 제안'}</h2>
              {suggestions.map((s, rowIndex4) => (
                <div key={rowIndex4} className={'post-preview'}>
                  <>
                    <strong>{s.title}</strong> <p>{labels[s.status] || s.status}</p>
                  </>
                </div>
              ))}
              {!suggestions.length && (
                <p className={'muted'}>{'도구 등록과 정보 수정 제안이 여기에 표시돼요.'}</p>
              )}
            </div>
          </section>
        </div>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { user, mine, comments, saved, voted, savedPosts, suggestions, services, serviceEdits, labels } = ctx
    .locals.presentation.data as PageData;
  return createMetadata({ title: '내 활동', noindex: true }, ctx.url.pathname);
}
