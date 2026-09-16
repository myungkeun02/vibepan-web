import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import { catalog } from '../lib/catalog';

import { boards } from '../lib/config';
export default async function ViewPostEditorastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const entries = (await catalog()).all;

  const { post: p } = props;

  const build = p ? JSON.parse(p.build) : {};

  const board = p?.board || ctx.url.searchParams.get('board') || 'builds';
  return (
    <>
      <form data-api={''} action={p ? '/api/posts/update' : '/api/posts/create'} method={'post'}>
        <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
        {p && <input type={'hidden'} name={'id'} defaultValue={p.id} />}
        <div className={'editor-grid'}>
          <div>
            <label className={'form-field'}>
              <span>{'제목'}</span>
              <input
                name={'title'}
                placeholder={'제목을 입력해 주세요'}
                required={true}
                minLength={3}
                maxLength={140}
                defaultValue={p?.title || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'본문 · 마크다운 지원'}</span>
              <textarea
                aria-label={'본문 · 마크다운 지원'}
                className={'editor-body'}
                name={'body'}
                required={true}
                minLength={10}
                maxLength={30000}
                placeholder={
                  '만든 과정, 궁금한 점, 배운 것을 편하게 적어주세요. 제목은 ##, 코드는 ```로 작성할 수 있어요.'
                }
                defaultValue={p?.body || ''}
              />
            </label>
            <div className={'flex wrap-flex'}>
              <button type={'button'} className={'button secondary small'} data-preview={''}>
                {'본문 펼쳐보기'}
              </button>
              <label className={'button secondary small'}>
                {'이미지 첨부'}
                <input
                  type={'file'}
                  accept={'image/png,image/jpeg,image/webp'}
                  data-upload={''}
                  hidden={true}
                />
              </label>
              <span className={'muted small'}>{'PNG·JPEG·WebP, 최대 5MB'}</span>
            </div>
            <pre id={'markdown-preview'} className={'meta-box'} hidden={true} />
            <details className={'section'}>
              <summary>{'제작 정보 (선택)'}</summary>
              <div className={'stack'} style={styleObject('margin-top:20px')}>
                <label className={'form-field'}>
                  <span>{'사용한 AI 코딩 도구'}</span>
                  <input
                    name={'agent'}
                    defaultValue={build.agent || ''}
                    placeholder={'Codex, Claude Code, Cursor…'}
                    maxLength={80}
                  />
                </label>
                <label className={'form-field'}>
                  <span>{'실제로 만든 기능'}</span>
                  <textarea name={'features'} maxLength={2000} defaultValue={build.features || ''} />
                </label>
                <label className={'form-field'}>
                  <span>{'어려웠던 점'}</span>
                  <textarea name={'difficulties'} maxLength={2000} defaultValue={build.difficulties || ''} />
                </label>
                <label className={'form-field'}>
                  <span>{'기존 도구 대신 쓰는 기능'}</span>
                  <textarea name={'scope'} maxLength={2000} defaultValue={build.scope || ''} />
                </label>
                <label className={'form-field'}>
                  <span>{'사용한 프롬프트'}</span>
                  <textarea name={'prompt'} maxLength={5000} defaultValue={build.prompt || ''} />
                </label>
                <label className={'form-field'}>
                  <span>{'완성한 도구 주소'}</span>
                  <input name={'url'} type={'url'} defaultValue={build.url || ''} placeholder={'https://…'} />
                </label>
                <label className={'form-field'}>
                  <span>{'소스 코드 주소'}</span>
                  <input
                    name={'repo'}
                    type={'url'}
                    defaultValue={build.repo || ''}
                    placeholder={'https://github.com/…'}
                  />
                </label>
              </div>
            </details>
            <p className={'form-status'} role={'status'} />
            <div className={'flex editor-submit'}>
              <button className={'primary'} type={'submit'}>
                {p ? '수정 내용 저장' : '게시하기'}
                {' ↗'}
              </button>
              <a className={'muted small'} href={p ? '/community/' + p.id : '/community'}>
                {'취소'}
              </a>
            </div>
          </div>
          <aside>
            <section className={'meta-box'}>
              <label className={'form-field'}>
                <span>{'게시판'}</span>
                <Select name={'board'} aria-label={'게시판'}>
                  {Object.entries(boards)
                    .filter(([k]) => k !== 'notice')
                    .map(([k, v], rowIndex1) => (
                      <option key={rowIndex1} value={k} selected={board === k}>
                        {v}
                      </option>
                    ))}
                </Select>
              </label>
              <label className={'form-field'}>
                <span>{'관련 도구 (선택)'}</span>
                <Select name={'tool'} aria-label={'관련 도구 (선택)'}>
                  <option value={''}>{'도구 선택 안 함'}</option>
                  {entries.map((a, rowIndex2) => (
                    <option
                      key={rowIndex2}
                      value={a.catalog_slug || 'service:' + a.id}
                      selected={
                        (p?.tool_slug ||
                          (p?.service_id ? 'service:' + p.service_id : '') ||
                          ctx.url.searchParams.get('tool')) === (a.catalog_slug || 'service:' + a.id)
                      }
                    >
                      {a.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className={'form-field'}>
                <span>{'태그 (선택)'}</span>
                <input
                  name={'tags'}
                  defaultValue={p?.tags || ''}
                  maxLength={150}
                  placeholder={'쉼표로 구분해 주세요'}
                />
              </label>
              <p>{'이 글은 누구나 읽을 수 있어요. 비밀번호나 개인 연락처는 포함하지 마세요.'}</p>
            </section>
          </aside>
        </div>
      </form>
    </>
  );
}
