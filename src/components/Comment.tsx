import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

export default async function ViewCommentastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const { comment: c } = props;

  const user = ctx.locals.user;

  const active = c.status === 'active';
  return (
    <>
      <article className={cn(['comment', { reply: c.parent_id }])} id={'comment-' + c.id}>
        <div className={'post-meta'}>
          <a href={c.user_id ? '/profile/' + c.user_id : undefined}>{c.nickname || '탈퇴한 사용자'}</a>
          <time>{c.created_at.slice(0, 10)}</time>
        </div>
        <p>
          {active
            ? c.body
            : c.status === 'hidden'
              ? '운영 정책에 따라 숨겨진 댓글입니다.'
              : '삭제된 댓글입니다.'}
        </p>
        {active && user && (
          <div className={'flex wrap-flex'}>
            {!c.parent_id && (
              <details>
                <summary>{'답글 쓰기'}</summary>
                <form data-api={''} action={'/api/comments/create'} method={'post'}>
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <input type={'hidden'} name={'post'} defaultValue={c.post_id} />
                  <input type={'hidden'} name={'parent'} defaultValue={c.id} />
                  <label className={'form-field'}>
                    <span>{'답글'}</span>
                    <textarea name={'body'} required={true} maxLength={3000} defaultValue={''} />
                  </label>
                  <button type={'submit'} className={'button secondary small'}>
                    {'\n                답글 등록\n              '}
                  </button>
                  <p className={'form-status'} role={'status'} />
                </form>
              </details>
            )}
            {c.user_id === user.id ? (
              <>
                <details>
                  <summary>{'댓글 수정'}</summary>
                  <form data-api={''} action={'/api/comments/update'} method={'post'}>
                    <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                    <input type={'hidden'} name={'id'} defaultValue={c.id} />
                    <label className={'form-field'}>
                      <span>{'수정할 댓글'}</span>
                      <textarea
                        name={'body'}
                        required={true}
                        maxLength={3000}
                        defaultValue={'\n                    ' + c.body + '\n                  '}
                      />
                    </label>
                    <button className={'button secondary small'} type={'submit'}>
                      {'\n                  수정 저장\n                '}
                    </button>
                    <p className={'form-status'} role={'status'} />
                  </form>
                </details>
                <form
                  data-api={''}
                  data-confirm={'이 댓글을 삭제할까요?'}
                  action={'/api/comments/delete'}
                  method={'post'}
                >
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <input type={'hidden'} name={'id'} defaultValue={c.id} />
                  <button className={'text-button'} type={'submit'}>
                    {'\n                댓글 삭제\n              '}
                  </button>
                </form>
              </>
            ) : (
              <details>
                <summary>{'댓글 신고'}</summary>
                <form data-api={''} action={'/api/report'} method={'post'}>
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <input type={'hidden'} name={'type'} defaultValue={'comment'} />
                  <input type={'hidden'} name={'target'} defaultValue={c.id} />
                  <label className={'form-field'}>
                    <span>{'신고 사유'}</span>
                    <textarea
                      name={'reason'}
                      required={true}
                      minLength={5}
                      maxLength={1000}
                      defaultValue={''}
                    />
                  </label>
                  <button className={'button secondary small'} type={'submit'}>
                    {'\n                신고 접수\n              '}
                  </button>
                  <p className={'form-status'} role={'status'} />
                </form>
              </details>
            )}
          </div>
        )}
      </article>
    </>
  );
}
