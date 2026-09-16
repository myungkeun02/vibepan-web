import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import Base from '../../layouts/Base';

import BrandIntro from '../../components/BrandIntro';

import ServiceEditor from '../../components/ServiceEditor';
export default async function Viewnewastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base
        title={'SaaS 등록'}
        pageKind={'service-editor'}
        mobileTitle={'SaaS 등록'}
        mobileBack={'/'}
        noindex={true}
      >
        <section className={'service-form-wrap'}>
          <header className={'page-head'}>
            <BrandIntro>
              <h1>{'SaaS 등록'}</h1>
              <p>
                {
                  '\n          목록에 없는 서비스를 등록해 주세요. 제작 가이드는 나중에 추가할 수 있습니다.\n        '
                }
              </p>
            </BrandIntro>
          </header>
          <ServiceEditor />
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: 'SaaS 등록', noindex: true }, ctx.url.pathname);
}
