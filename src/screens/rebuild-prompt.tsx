import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/rebuild-prompt';

import Base from '../layouts/Base';
export default async function Viewrebuildpromptastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { prompt, original } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={'이 사이트를 만든 프롬프트'}>
        <header className={'page-head'}>
          <h1 style={styleObject('margin-top:15px')}>{'\n      이 사이트를 만든 프롬프트\n    '}</h1>
          <p>
            {
              '\n      원본 서비스의 프롬프트를 참고해 한국어 도구 목록, 회원가입, 커뮤니티를 만들었어요.\n    '
            }
          </p>
        </header>
        <p className={'muted'}>
          {
            '\n    실제로 사용한 프롬프트를 공개합니다. 기존 설계서를 함께 참고했고, 구현하면서 여러 차례 테스트하고 수정했어요.\n    같은 프롬프트를 사용해도 결과는 달라질 수 있어요.\n  '
          }
        </p>
        <div className={'flex wrap-flex'}>
          <a className={'button secondary'} href={'/prompts/korean-rebuild.txt'} download={true}>
            {'프롬프트 다운로드'}
          </a>
          <a
            className={'button secondary'}
            href={'https://github.com/canivibecodeit/canivibecodeit'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            {'원본 소스 · MIT ↗'}
          </a>
          <button className={'button secondary'} data-copy={'rebuild-prompt'}>
            {'프롬프트 복사'}
          </button>
        </div>
        <details className={'section'}>
          <summary>{'전체 프롬프트 보기'}</summary>
          <div className={'prompt-block'} style={styleObject('margin-top:20px')}>
            <div className={'prompt-code'}>
              <pre id={'rebuild-prompt'}>{prompt}</pre>
            </div>
          </div>
        </details>
        <section className={'section'}>
          <h2>{'참고한 원본 프롬프트'}</h2>
          <div className={'prompt-block'}>
            <div className={'prompt-code'}>
              <pre>{original}</pre>
            </div>
          </div>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { prompt, original } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '이 사이트를 만든 프롬프트' }, ctx.url.pathname);
}
