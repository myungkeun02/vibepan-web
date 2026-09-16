interface Props {
  guide: ServiceGuide | null;
  editUrl: string;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import type { ServiceGuide } from '../lib/service-schema';

import { verdicts } from '../lib/config';
export default async function ViewServiceGuideastro(props: Props & { children?: ReactNode }) {
  const { guide: g, editUrl } = props;
  return (
    <>
      <section className={'section service-guide'} id={'service-guide'}>
        <div className={'flex between wrap-flex'}>
          <h2>{'제작 가이드'}</h2>
          <a href={editUrl} className={'small accent'}>
            {g ? '가이드 수정' : '가이드 추가'}
          </a>
        </div>
        {g ? (
          <>
            <p>
              <span className={cn(['verdict', g.verdict])}>{verdicts[g.verdict].label}</span>
              {' · '}
              {g.difficulty}
            </p>
            <>
              <h3>{'제작 범위'}</h3> <p className={'service-description'}>{g.scope}</p>
              <p className={'service-description muted'}>{g.verdictReason}</p>
            </>
            <>
              <h3>{'만들 기능'}</h3>
              <ul>
                {g.features.map((f, rowIndex1) => (
                  <li key={rowIndex1}>{f}</li>
                ))}
              </ul>
            </>
            <>
              <h3>{'제외할 기능'}</h3>
              <ul>
                {g.whatYouLose.map((f, rowIndex2) => (
                  <li key={rowIndex2}>{f}</li>
                ))}
              </ul>
            </>
            {g.operations.length > 0 && (
              <>
                <h3>{'운영 시 필요한 것'}</h3>
                <ul>
                  {g.operations.map((f, rowIndex3) => (
                    <li key={rowIndex3}>{f}</li>
                  ))}
                </ul>
              </>
            )}
            <div className={'flex between wrap-flex'}>
              <>
                <h3>{'제작 프롬프트'}</h3>
                <button className={'button secondary'} data-copy={'#service-build-prompt'}>
                  {'\n              프롬프트 복사\n            '}
                </button>
              </>
            </div>
            <pre id={'service-build-prompt'} className={'service-guide-prompt'}>
              {g.prompt}
            </pre>
          </>
        ) : (
          <div className={'content-empty'}>
            <>
              <p>{'아직 제작 가이드가 없습니다.'}</p>
              <a href={editUrl}>{'제작 범위와 프롬프트 추가하기'}</a>
            </>
          </div>
        )}
      </section>
    </>
  );
}
