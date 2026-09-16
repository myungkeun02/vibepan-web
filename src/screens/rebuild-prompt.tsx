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
          <div className={'eyebrow'}>{'이 사이트의 시작'}</div>
          <h1 style={styleObject('margin-top:15px')}>{'\n      이 사이트도, 여기서 시작했어요.\n    '}</h1>
          <p>
            {
              '\n      원본 서비스의 첫 제작 프롬프트를 출발점으로, 한국어 도구 목록과 회원가입·커뮤니티 기능을 더했어요.\n    '
            }
          </p>
        </header>
        <p className={'muted'}>
          {
            '\n    아래는 이 사이트를 만들 때 실제로 사용한 요청문 전체예요. 기존 설계서를 함께 참고했고, 구현 과정에서\n    검증과 수정을 반복했습니다. 한 번 실행하면 같은 결과를 보장하는 프롬프트는 아닙니다.\n  '
          }
        </p>
        <div className={'flex wrap-flex'}>
          <a className={'button secondary'} href={'/prompts/korean-rebuild.txt'} download={true}>
            {'제작 요청문 내려받기'}
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
            {'제작 요청문 복사'}
          </button>
        </div>
        <details className={'section'}>
          <summary>{'한국어 서비스 제작 요청문 전체'}</summary>
          <div className={'prompt-block'} style={styleObject('margin-top:20px')}>
            <div className={'prompt-code'}>
              <pre id={'rebuild-prompt'}>{prompt}</pre>
            </div>
          </div>
        </details>
        <section className={'section'}>
          <h2>{'출발점이 된 원본 프롬프트'}</h2>
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
