interface Props {
  edit: ServiceEdit;
  administrative?: boolean;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import { contentChanges, type ServiceEdit } from '../lib/services';
export default async function ViewServiceChangesastro(props: Props & { children?: ReactNode }) {
  const { edit: e, administrative = false } = props;

  const media = (path: string) => (administrative ? path.replace('/media/', '/api/admin/v1/media/') : path);

  const changes = contentChanges(e.before_data, e.after_data);
  return (
    <>
      <div className={'service-changes'}>
        {changes.map((c, rowIndex1) => (
          <section key={rowIndex1}>
            <>
              <h4>{c.label}</h4>
              <div className={'service-change-pair'}>
                <>
                  <div>
                    <>
                      <span className={'muted small'}>{'수정 전'}</span>
                      {c.key === 'image' && c.before !== '없음' ? (
                        <img className={'service-image-preview'} src={media(c.before)} alt={'기존 이미지'} />
                      ) : (
                        <p>{c.before}</p>
                      )}
                    </>
                  </div>
                  <div>
                    <>
                      <span className={'accent small'}>{'수정 제안'}</span>
                      {c.key === 'image' && c.after !== '없음' ? (
                        <img
                          className={'service-image-preview'}
                          src={media(c.after)}
                          alt={'수정 제안 이미지'}
                        />
                      ) : (
                        <p>{c.after}</p>
                      )}
                    </>
                  </div>
                </>
              </div>
            </>
          </section>
        ))}
      </div>
    </>
  );
}
