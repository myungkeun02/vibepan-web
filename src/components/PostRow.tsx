import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import { boards } from '../lib/config';

import { getApp } from '../lib/apps';

import { visibleService } from '../lib/services';
export default async function ViewPostRowastro(props: Record<string, any> & { children?: ReactNode }) {
  const { post: p } = props;

  const service = p.service_id ? await visibleService(p.service_id) : null;

  const excerpt = p.body.slice(0, 180).replace(/[#*`]/g, '');
  return (
    <>
      <a className={'post-row'} href={'/community/' + p.id}>
        <div className={'post-meta'}>
          <span className={'badge'}>
            {p.pinned ? '고정 · ' : ''}
            {boards[p.board]}
          </span>
          {(p.tool_slug || service) && (
            <span>{service?.name || getApp(p.tool_slug)?.nameKo || '관련 도구'}</span>
          )}
        </div>
        <h2>{p.title}</h2> <p className={'post-excerpt'}>{excerpt}</p>
        <div className={'post-meta'} style={styleObject('margin-top:13px')}>
          <span>{p.nickname || '탈퇴한 사용자'}</span> <time>{p.created_at.slice(0, 10)}</time>
          <span>
            {'좋아요 '}
            {p.likes || 0}
          </span>
          <span>
            {'댓글 '}
            {p.comments || 0}
          </span>
        </div>
      </a>
    </>
  );
}
