interface Props {
  service?: Service | null;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import { categories } from '../lib/apps';

import { servicePricing } from '../lib/service-schema';

import type { Service } from '../lib/services';
export default async function ViewServiceEditorastro(props: Props & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const { service: s } = props;

  const proposing = s?.status === 'published';

  const g = s?.guide;
  return (
    <>
      <form
        className={'service-editor'}
        data-api={''}
        action={s ? '/api/services/update' : '/api/services/create'}
        method={'post'}
      >
        <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
        {s && (
          <>
            <>
              <input type={'hidden'} name={'id'} defaultValue={s.id} />
              <input type={'hidden'} name={'revision'} defaultValue={s.revision} />
            </>
          </>
        )}
        <label className={'form-field'}>
          <span>{'서비스 이름'}</span>
          <input
            name={'name'}
            required={true}
            minLength={1}
            maxLength={80}
            defaultValue={s?.name || ''}
            placeholder={'서비스 이름을 알려주세요'}
          />
        </label>
        <label className={'form-field'}>
          <span>{'서비스 주소'}</span>
          <input
            name={'website'}
            type={'url'}
            inputMode={'url'}
            required={true}
            maxLength={1000}
            defaultValue={s?.website_url || ''}
            placeholder={'https://…'}
            aria-describedby={'service-url-help'}
          />
        </label>
        <p id={'service-url-help'} className={'field-help'}>
          {'누구나 방문할 수 있는 공식 주소를 적어주세요.'}
        </p>
        <div className={'service-field-pair'}>
          <label className={'form-field'}>
            <span>{'분야'}</span>
            <Select name={'category'} aria-label={'분야'} required={true}>
              <option value={''}>{'분야 선택'}</option>
              {categories.map((c, rowIndex1) => (
                <option key={rowIndex1} value={c.slug} selected={s?.category === c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </label>
          <label className={'form-field'}>
            <span>{'요금 방식'}</span>
            <Select name={'pricing'} aria-label={'요금 방식'}>
              {Object.entries(servicePricing).map(([key, label], rowIndex2) => (
                <option key={rowIndex2} value={key} selected={(s?.pricing || 'unknown') === key}>
                  {label}
                </option>
              ))}
            </Select>
          </label>
        </div>
        {proposing ? (
          <input type={'hidden'} name={'relationship'} defaultValue={s!.relationship} />
        ) : (
          <fieldset className={'service-relationship'}>
            <legend>{'어떤 서비스인가요?'}</legend>
            <label>
              <input
                type={'radio'}
                name={'relationship'}
                defaultValue={'user'}
                defaultChecked={!s || s.relationship === 'user'}
              />
              {'\n          추천하고 싶은 서비스\n        '}
            </label>
            <label>
              <input
                type={'radio'}
                name={'relationship'}
                defaultValue={'maker'}
                defaultChecked={s?.relationship === 'maker'}
              />
              {' 제가\n          만든 서비스\n        '}
            </label>
          </fieldset>
        )}
        <label className={'form-field'}>
          <span>{'한 줄 소개'}</span>
          <input
            name={'tagline'}
            required={true}
            minLength={10}
            maxLength={160}
            defaultValue={s?.tagline || ''}
            placeholder={'누구에게 어떤 도움이 되는 서비스인가요?'}
          />
        </label>
        <label className={'form-field'}>
          <span>{'상세 소개'}</span>
          <textarea
            name={'description'}
            aria-label={'상세 소개'}
            required={true}
            minLength={30}
            maxLength={5000}
            rows={7}
            placeholder={'주요 기능, 추천하는 이유, 사용해 본 경험을 30자 이상 적어주세요.'}
            defaultValue={s?.description || ''}
          />
        </label>
        <div className={'service-image-field'}>
          <p>
            {'서비스 화면 또는 로고 '}
            <span className={'muted small'}>{'선택'}</span>
          </p>
          <input type={'hidden'} name={'image'} defaultValue={s?.image_id ? '/media/' + s.image_id : ''} />
          <img
            className={'service-image-preview'}
            data-service-image-preview={''}
            src={s?.image_id ? '/media/' + s.image_id : undefined}
            alt={'첨부한 서비스 이미지'}
            hidden={!s?.image_id}
          />
          <div data-service-upload-controls={''} hidden={true}>
            <label className={'button secondary'}>
              {'이미지 첨부'}
              <input
                className={'service-file-input'}
                type={'file'}
                accept={'image/png,image/jpeg,image/webp'}
                aria-label={'서비스 이미지 첨부'}
                data-service-upload={''}
              />
            </label>
            <button
              type={'button'}
              className={'text-button'}
              data-service-image-remove={''}
              hidden={!s?.image_id}
            >
              {'이미지 제거'}
            </button>
            <p className={'field-help'}>{'PNG·JPEG·WebP, 최대 5MB'}</p>
          </div>
          <noscript>
            <p className={'field-help'}>{'이미지 없이도 서비스를 등록할 수 있어요.'}</p>
          </noscript>
        </div>
        <details className={'service-guide-editor'} open={Boolean(g)}>
          <summary>
            {'제작 가이드 '}
            {g ? '수정' : '추가 (선택)'}
          </summary>
          <p className={'field-help'}>
            {
              '\n      직접 만들 수 있는 범위와 프롬프트를 적어주세요. 가이드 없이 서비스 정보만 등록할 수도 있습니다.\n    '
            }
          </p>
          {s?.catalog_slug ? (
            <input type={'hidden'} name={'guide_mode'} defaultValue={'present'} />
          ) : (
            <label className={'form-field'}>
              <>
                <span>{'가이드 등록'}</span>
                <Select name={'guide_mode'} data-guide-mode={''}>
                  <>
                    <option value={'none'} selected={!g}>
                      {'\n                  가이드 없음\n                '}
                    </option>
                    <option value={'present'} selected={Boolean(g)}>
                      {'\n                  가이드 작성\n                '}
                    </option>
                  </>
                </Select>
              </>
            </label>
          )}
          <fieldset data-guide-fields={''}>
            <label className={'form-field'}>
              <span>{'대체 가능성'}</span>
              <Select name={'guide_verdict'}>
                <option value={'yes'} selected={g?.verdict === 'yes'}>
                  {'대체 가능'}
                </option>
                <option value={'kinda'} selected={!g || g.verdict === 'kinda'}>
                  {'일부 대체 가능'}
                </option>
                <option value={'no'} selected={g?.verdict === 'no'}>
                  {'대체 어려움'}
                </option>
              </Select>
            </label>
            <label className={'form-field'}>
              <span>{'제작 난이도'}</span>
              <Select name={'guide_difficulty'}>
                <option value={'입문'} selected={g?.difficulty === '입문'}>
                  {'입문'}
                </option>
                <option value={'중급'} selected={!g || g.difficulty === '중급'}>
                  {'중급'}
                </option>
                <option value={'고급'} selected={g?.difficulty === '고급'}>
                  {'고급'}
                </option>
              </Select>
            </label>
            <label className={'form-field'}>
              <span>{'제작 범위'}</span>
              <textarea
                name={'guide_scope'}
                aria-label={'제작 범위'}
                maxLength={2000}
                rows={3}
                defaultValue={g?.scope || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'판단 이유'}</span>
              <textarea
                name={'guide_reason'}
                aria-label={'판단 이유'}
                maxLength={3000}
                rows={4}
                defaultValue={g?.verdictReason || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'만들 기능 · 한 줄에 하나씩'}</span>
              <textarea
                name={'guide_features'}
                aria-label={'만들 기능'}
                maxLength={15000}
                rows={4}
                defaultValue={g?.features.join('\n') || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'만들기 어렵거나 제외할 기능 · 한 줄에 하나씩'}</span>
              <textarea
                name={'guide_limits'}
                aria-label={'제외할 기능'}
                maxLength={15000}
                rows={4}
                defaultValue={g?.whatYouLose.join('\n') || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'운영 시 필요한 것 · 한 줄에 하나씩'}</span>
              <textarea
                name={'guide_operations'}
                aria-label={'운영 시 필요한 것'}
                maxLength={15000}
                rows={3}
                defaultValue={g?.operations.join('\n') || ''}
              />
            </label>
            <label className={'form-field'}>
              <span>{'제작 프롬프트'}</span>
              <textarea
                name={'guide_prompt'}
                aria-label={'제작 프롬프트'}
                maxLength={20000}
                rows={10}
                defaultValue={g?.prompt || ''}
              />
            </label>
            <p className={'field-help'}>
              {'프롬프트는 500자 이상 입력해 주세요. API 키나 비밀번호는 넣지 마세요.'}
            </p>
          </fieldset>
        </details>
        {proposing && (
          <label className={'form-field'}>
            <>
              <span>{'수정 이유·출처'}</span>
              <textarea
                name={'change_reason'}
                aria-label={'수정 이유·출처'}
                required={true}
                minLength={5}
                maxLength={1000}
                rows={3}
                placeholder={'바꾼 이유와 확인한 자료의 주소를 적어주세요.'}
                defaultValue={''}
              />
            </>
          </label>
        )}
        <p className={'muted small'}>
          {proposing
            ? '수정 제안은 검토 후 반영됩니다. 검토 중에는 기존 내용이 그대로 공개됩니다.'
            : '운영자 확인 후 목록에 공개됩니다. 검토 상태는 내 활동에서 확인할 수 있습니다.'}
        </p>
        <p className={'form-status'} role={'status'} />
        <div className={'service-submit'}>
          <button className={'primary'} type={'submit'}>
            {proposing ? '수정 제안 보내기' : s ? '수정하고 검토 요청' : '등록 요청하기'}
          </button>
          <a className={'muted'} href={s ? '/services/' + s.id : '/services'}>
            {'취소'}
          </a>
        </div>
      </form>
    </>
  );
}
