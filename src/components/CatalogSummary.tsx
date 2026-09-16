interface Props {
  counts?: PublicTotals;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import { totals, type PublicTotals } from '../lib/db';
export default async function ViewCatalogSummaryastro(props: Props & { children?: ReactNode }) {
  const t = props.counts || (await totals());

  const items = [
    { key: 'services', label: '등록 SaaS', value: t.services, unit: '개', href: '/#directory' },
    { key: 'guides', label: '제작 가이드', value: t.guides, unit: '개', href: '/?guide=available#directory' },
    { key: 'builds', label: '제작 후기', value: t.builds, unit: '건', href: '/community?board=builds' },
  ];
  return (
    <>
      <nav className={'catalog-summary'} aria-label={'공개 콘텐츠 현황'}>
        {items.map((item, rowIndex1) => (
          <a key={rowIndex1} href={item.href} data-public-count={item.key}>
            <>
              <span>{item.label}</span>
              <strong>
                {item.value.toLocaleString('ko-KR')}
                <small>{item.unit}</small>
              </strong>
            </>
          </a>
        ))}
      </nav>
    </>
  );
}
