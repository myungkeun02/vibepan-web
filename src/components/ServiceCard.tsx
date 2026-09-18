interface Props {
  service: Service;
  showStatus?: boolean;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import { categoryName } from '../lib/apps';
import ToolIcon from './ToolIcon';

import { servicePricing, serviceStatuses } from '../lib/service-schema';

import { serviceHref, type Service } from '../lib/services';
export default async function ViewServiceCardastro(props: Props & { children?: ReactNode }) {
  const { service: s, showStatus = false } = props;
  return (
    <>
      <a className={'service-card'} href={serviceHref(s)}>
        <div className={'service-card-top'}>
          <ToolIcon
            app={{ slug: s.catalog_slug || s.id, name: s.name }}
            imageUrl={s.image_id ? '/media/' + s.image_id : undefined}
          />
          <div>
            <h3>{s.name}</h3>
            <span className={'small muted'}>
              {categoryName(s.category)}
              {' · '}
              {servicePricing[s.pricing]}
            </span>
          </div>
          <span className={'service-card-arrow'} aria-hidden={'true'}>
            {'↗'}
          </span>
        </div>
        <p>{s.tagline}</p>
        <div className={'service-card-meta'}>
          <span>{s.guide ? '제작 가이드 있음' : '가이드 없음'}</span>
          {showStatus && <span className={'accent'}>{serviceStatuses[s.status]}</span>}
        </div>
      </a>
    </>
  );
}
