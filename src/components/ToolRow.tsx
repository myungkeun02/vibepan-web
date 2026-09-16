interface Props {
  entry: CatalogEntry;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import { categoryName } from '../lib/apps';

import ToolIcon from './ToolIcon';

import { verdicts } from '../lib/config';

import type { CatalogEntry } from '../lib/catalog';
export default async function ViewToolRowastro(props: Props & { children?: ReactNode }) {
  const { entry: a } = props;

  const v = a.verdict ? verdicts[a.verdict] : null;
  return (
    <>
      <a className={'tool-row'} href={a.href} data-catalog-id={a.id}>
        <span className={'tool-info'}>
          <ToolIcon app={a} imageUrl={a.image_id ? '/media/' + a.image_id : undefined} />
          <span>
            <strong>{a.name}</strong>
            <small>
              {a.originalName && a.originalName !== a.name ? a.originalName + ' · ' : ''}
              {categoryName(a.category)}
            </small>
          </span>
        </span>
        <span className={'mobile-only tool-summary'}>{a.tagline}</span>
        <span className={'price'}>{a.pricingLabel}</span>
        <span className={cn(['verdict', a.verdict || 'unknown'])}>
          <span>{v ? v.symbol + ' ' + v.label : '가이드 없음'}</span>
        </span>
        <span className={'review-count'} aria-label={`제작 후기 ${a.reviewCount}건`}>
          {'후기 '}
          {a.reviewCount}
        </span>
      </a>
    </>
  );
}
