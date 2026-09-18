import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/[slug]';

import EmptyState from '../components/EmptyState';

import Mascot from '../components/Mascot';

import Base from '../layouts/Base';

import { related, categoryName, priceLabel } from '../lib/apps';
import { formatPrice } from '../lib/pricing';

import { verdicts, absolute, boards } from '../lib/config';

import ToolIcon from '../components/ToolIcon';
export default async function Viewslugastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { service, a, v, voted, bookmarked, count, builds, jsonld } = ctx.locals.presentation
    .data as PageData;
  const description = service?.description?.trim();
  const repeatsGuide = description === `${a?.scope}\n\n${a?.verdictReason}`.trim();
  return (
    <>
      <Base
        pageKind={'tool'}
        mobileTitle={a?.nameKo}
        mobileBack={'/'}
        title={a ? `${a.nameKo}, 직접 만들어 대체할 수 있을까?` : '도구를 찾을 수 없어요'}
        description={a ? a.scope + ' — ' + a.verdictReason : undefined}
        og={a ? '/og/' + a.slug + '.png' : undefined}
        jsonld={jsonld}
        noindex={!a || service?.status !== 'published'}
      >
        {a && v ? (
          <>
            <>
              <nav className={'crumbs'} aria-label={'현재 위치'}>
                <>
                  <a href={'/'}>{'도구 탐색'}</a> <span>{'/'}</span>
                  <a href={'/category/' + a.category}>{categoryName(a.category)}</a> <span>{'/'}</span>
                  <span>{a.nameKo}</span>
                </>
              </nav>
              <header className={'detail-head'}>
                <>
                  <ToolIcon app={a} imageUrl={service?.image_id ? '/media/' + service.image_id : undefined} />
                  <div>
                    <>
                      <h1>{a.nameKo}</h1>
                      <a className={'small accent'} href={'/services/' + service!.id + '/edit'}>
                        {'\n                    정보 수정\n                  '}
                      </a>
                      <p className={'muted'}>
                        {a.nameKo !== a.name ? a.name + ' · ' : ''} {a.summary}
                        <a
                          href={a.officialUrl}
                          target={'_blank'}
                          rel={'noopener noreferrer'}
                          aria-label={`${a.nameKo} 공식 사이트`}
                        >
                          {'\n                      ↗\n                    '}
                        </a>
                      </p>
                    </>
                  </div>
                </>
              </header>
              {description && !repeatsGuide && (
                <p className={'service-description muted'} data-service-description={''}>
                  {description}
                </p>
              )}
              <div className={'mobile-only mobile-tool-glance'}>
                <>
                  <span>{categoryName(a.category)}</span> <strong>{priceLabel(a)}</strong>
                </>
              </div>
              <nav className={'mobile-only mobile-detail-tabs'} aria-label={'도구 상세 메뉴'}>
                <a href={'#tool-overview'} data-detail-view={'overview'}>
                  {'\n              제작 가이드\n            '}
                </a>
                <a href={'#tool-prompt'} data-detail-view={'prompt'}>
                  {'\n              프롬프트\n            '}
                </a>
                <a href={'#tool-reference'} data-detail-view={'reference'}>
                  {'\n              참고 정보\n            '}
                </a>
              </nav>
              <div className={'detail-grid'}>
                <>
                  <div>
                    <>
                      <section
                        id={'tool-overview'}
                        data-mobile-panel={'overview'}
                        className={cn(['verdict-panel', a.verdict])}
                      >
                        <>
                          <span className={cn(['verdict', 'big', a.verdict])}>
                            {v.symbol} {v.label}
                          </span>
                          <p>{a.verdictReason}</p>
                          <div className={'scope'}>
                            <>
                              <small className={'muted'}>{'제작 범위'}</small> <br />
                            </>
                            {a.scope}
                          </div>
                        </>
                      </section>
                      <section className={'section'} id={'tool-prompt'} data-mobile-panel={'prompt'}>
                        <>
                          <div className={'flex between wrap-flex'}>
                            <>
                              <h2>{'프롬프트'}</h2>
                              <span className={'badge'}>
                                {'v'}
                                {a.promptVersion}
                                {' · 초안'}
                              </span>
                            </>
                          </div>
                          <p className={'muted small'}>
                            {a.verdict === 'no'
                              ? '핵심 기능 중 일부만 구현하는 프롬프트예요.'
                              : '사용할 AI 코딩 도구에 맞춰 복사하고 붙여 넣으세요.'}
                            {' 이 프롬프트로 만든 앱의 동작은 아직 확인하지 않았어요.'}
                          </p>
                          <div className={'prompt-block'}>
                            <>
                              <div className={'prompt-toolbar'}>
                                <>
                                  <span className={'mono'}>
                                    {a.nameKo}
                                    {' 프롬프트'}
                                  </span>
                                  <div className={'prompt-buttons'}>
                                    {[
                                      ['claude', 'Claude Code'],
                                      ['codex', 'Codex'],
                                      ['cursor', 'Cursor'],
                                    ].map(([agent, label], rowIndex1) => (
                                      <button
                                        key={rowIndex1}
                                        data-copy={'build-prompt'}
                                        data-agent={agent}
                                        data-slug={a.slug}
                                      >
                                        {label}
                                        {'용 복사\n                                  '}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              </div>
                              <div className={'prompt-code'}>
                                <pre id={'build-prompt'} tabIndex={0}>
                                  {a.prompt}
                                </pre>
                              </div>
                            </>
                          </div>
                          <div className={'small muted'} style={styleObject('margin-top:12px')}>
                            {'\n                        변경 이력: '}
                            {a.history.map((h) => `${h.date} · ${h.note}`).join(' / ')}
                          </div>
                        </>
                      </section>
                      <section className={'section'} id={'tool-features'} data-mobile-panel={'overview'}>
                        <>
                          <h2>{'만들 수 있는 기능'}</h2>
                          <ul className={'fact-list'}>
                            {a.features.map((f, rowIndex2) => (
                              <li key={rowIndex2}>{f}</li>
                            ))}
                          </ul>
                        </>
                      </section>
                      <section
                        className={'section divider'}
                        id={'tool-limits'}
                        data-mobile-panel={'overview'}
                      >
                        <>
                          <h2>{'만들기 어려운 기능'}</h2>
                          <ul className={'fact-list'}>
                            {a.whatYouLose.map((f, rowIndex3) => (
                              <li key={rowIndex3}>{f}</li>
                            ))}
                          </ul>
                          <p className={'muted small'} style={styleObject('margin-top:20px')}>
                            {
                              '\n                        이 기능을 자주 쓴다면, 기존 도구를 계속 사용하는 편이 나을 수 있어요.\n                      '
                            }
                          </p>
                        </>
                      </section>
                      <section
                        className={'section divider'}
                        id={'tool-reference'}
                        data-mobile-panel={'reference'}
                      >
                        <h2>{'함께 살펴볼 도구'}</h2>
                        {a.priorArt.length ? (
                          <ul>
                            {a.priorArt.map((p, rowIndex4) => (
                              <li key={rowIndex4}>
                                <a href={p.url} target={'_blank'} rel={'noopener noreferrer'}>
                                  {p.name}
                                  {' ↗\n                            '}
                                </a>
                                <br />
                                <span className={'muted small'}>
                                  {p.license} {p.verified ? '· 원문 확인' : ''}
                                </span>
                                {p.licenseUrl && (
                                  <a
                                    className={'small muted'}
                                    href={p.licenseUrl}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                  >
                                    {
                                      '\n                                · 라이선스 원문\n                              '
                                    }
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={'muted'}>
                            {'\n                        아직 등록된 대안이 없어요. '}
                            <a href={'/services/' + service!.id + '/edit'}>{'대안을 제안해 주세요 ↗'}</a>
                          </p>
                        )}
                      </section>
                      <section className={'section faq'} id={'tool-faq'} data-mobile-panel={'reference'}>
                        <h2>{'자주 묻는 질문'}</h2>
                        {a.faq.map((f, rowIndex5) => (
                          <details key={rowIndex5}>
                            <summary>{f.q}</summary> <p>{f.a}</p>
                          </details>
                        ))}
                      </section>
                      <section className={'section'} id={'tool-builds'} data-mobile-panel={'reference'}>
                        <div className={'flex between wrap-flex'}>
                          <>
                            <h2>
                              {a.nameKo}
                              {' 제작 후기'}
                            </h2>
                            <a className={'small'} href={'/community/new?board=builds&tool=' + a.slug}>
                              {'\n                          후기 쓰기\n                        '}
                            </a>
                          </>
                        </div>
                        {builds.length ? (
                          builds.map((p, rowIndex6) => (
                            <a key={rowIndex6} className={'post-preview'} href={'/community/' + p.id}>
                              <span className={'badge'}>{boards[p.board]}</span> <h3>{p.title}</h3>
                              <span className={'muted small'}>
                                {p.nickname}
                                {' · 댓글 '}
                                {p.comments}
                              </span>
                            </a>
                          ))
                        ) : (
                          <EmptyState compact={true}>
                            <p>{'아직 이 도구를 만든 후기가 없어요.'}</p>
                          </EmptyState>
                        )}
                      </section>
                    </>
                  </div>
                  <aside>
                    <>
                      <div className={'meta-box'} id={'tool-record'} data-mobile-panel={'overview'}>
                        <>
                          <h3 style={styleObject('margin-top:14px')}>{'직접 만들어 쓰고 있나요?'}</h3>
                          <p>{'이 서비스 대신 직접 만든 도구를 쓰고 있다면 알려주세요.'}</p>
                          <button
                            className={'primary'}
                            style={styleObject('width:100%')}
                            data-vote={''}
                            data-slug={a.slug}
                            aria-pressed={voted}
                          >
                            {voted ? '대체 경험 취소' : '직접 대체했어요'}
                          </button>
                          <button
                            className={'button secondary'}
                            data-bookmark={''}
                            data-slug={a.slug}
                            aria-pressed={bookmarked}
                          >
                            {bookmarked ? '저장했어요 ✓' : '도구 저장 ☆'}
                          </button>
                          <p className={'small'} style={styleObject('margin:12px 0 0')}>
                            {'직접 대체했다고 남긴 응답은 '}
                            <span data-experience-count={''}>{count}</span>
                            {'건이에요. 실제 제작 여부와 절약한 비용은 확인하지 않았어요.'}
                          </p>
                        </>
                      </div>
                      <div className={'meta-box'} id={'tool-pricing'} data-mobile-panel={'reference'}>
                        <dl>
                          <>
                            <dt>{'이용 비용'}</dt> <dd>{priceLabel(a)}</dd> <dt>{'기준 요금제'}</dt>
                            <dd>{a.pricing.plan}</dd> <dt>{'결제 통화'}</dt>
                            <dd>
                              {a.pricing.currency === 'USD'
                                ? '미국 달러 (USD)'
                                : a.pricing.currency === 'KRW'
                                  ? '한국 원 (KRW)'
                                  : a.pricing.currency === 'EUR'
                                    ? '유로 (EUR)'
                                    : a.pricing.currency}
                            </dd>
                            {a.pricing.monthlyNative !== null && a.pricing.billing !== 'free' && (
                              <>
                                <dt>월간 결제</dt>
                                <dd>
                                  {formatPrice(a.pricing.monthlyNative, a.pricing.currency)} / 월
                                  {a.pricing.perSeat ? ' · 1인당' : ''}
                                </dd>
                              </>
                            )}
                            {a.pricing.annualMonthlyNative !== null && (
                              <>
                                <dt>
                                  {a.pricing.billing === 'annual-monthly'
                                    ? '연 약정 · 매월 청구'
                                    : '연 결제 · 월 환산'}
                                </dt>
                                <dd>
                                  {formatPrice(a.pricing.annualMonthlyNative, a.pricing.currency)} / 월
                                  {a.pricing.perSeat ? ' · 1인당' : ''}
                                </dd>
                              </>
                            )}
                            <dt>{'이용 인원 기준'}</dt>
                            <dd>
                              {a.pricing.perSeat
                                ? `1명당 · 최소 ${a.pricing.minimumSeats}명`
                                : '해당 요금제 기준'}
                            </dd>
                            <dt>{'확인 날짜'}</dt> <dd>{a.pricing.source.checkedOn}</dd>
                            <dt>{'가격 출처'}</dt>
                            <dd>
                              <a href={a.pricing.source.url} target={'_blank'} rel={'noopener noreferrer'}>
                                {'\n                            공식 안내 ↗\n                          '}
                              </a>
                            </dd>
                            <dt>{'가격 확인'}</dt>
                            <dd>{a.pricing.source.status === 'verified' ? '확인 완료' : '가격 확인 필요'}</dd>
                            <dt>{'제작 난이도'}</dt> <dd>{a.difficulty}</dd>
                          </>
                        </dl>
                        {a.pricing.exchange && (
                          <p style={styleObject('margin:16px 0 0')}>
                            {'참고 환율: 1 '}
                            {a.pricing.currency}
                            {' = '}
                            {a.pricing.exchange.rate.toLocaleString()}
                            {'원 ·'} {a.pricing.exchange.date}
                            <a href={a.pricing.exchange.source}>{'출처 ↗'}</a>
                          </p>
                        )}
                        <p className={'small'} style={styleObject('margin:16px 0 0')}>
                          {a.pricing.source.note}
                        </p>
                      </div>
                      <div className={'meta-box'} id={'tool-operations'} data-mobile-panel={'reference'}>
                        <>
                          <h3>{'직접 운영할 때'}</h3>
                          <ul>
                            {a.operations.map((o, rowIndex7) => (
                              <li key={rowIndex7}>{o}</li>
                            ))}
                          </ul>
                          <p>
                            {'\n                        외부 서비스 연결:'}
                            {a.dependencies.join(', ') ||
                              '기본 기능은 내 컴퓨터에서 별도 연결 없이 시작할 수 있어요.'}
                          </p>
                        </>
                      </div>
                      <div className={'meta-box'} id={'tool-sharing'} data-mobile-panel={'reference'}>
                        <>
                          <h3>{'관련 도구'}</h3>
                          <div className={'stack'}>
                            <>
                              <a
                                className={'button secondary'}
                                href={
                                  'https://x.com/intent/post?' +
                                  new URLSearchParams({
                                    text: `${a.nameKo}, 직접 만들 수 있을까? ${v.label}`,
                                    url: absolute('/' + a.slug),
                                  })
                                }
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                              >
                                {'\n                            X에 공유 ↗\n                          '}
                              </a>
                              <button className={'button secondary'} data-copy-url={''}>
                                {'\n                            링크 복사 ↗\n                          '}
                              </button>
                              {process.env.KAKAO_JAVASCRIPT_KEY && (
                                <button
                                  className={'button secondary'}
                                  data-kakao-key={process.env.KAKAO_JAVASCRIPT_KEY}
                                >
                                  {
                                    '\n                              카카오톡 공유 ↗\n                            '
                                  }
                                </button>
                              )}
                              <button className={'button secondary'} data-native-share={''}>
                                {
                                  '\n                            다른 앱으로 공유 ↗\n                          '
                                }
                              </button>
                              <a href={'/services/' + service!.id + '/edit'} className={'small muted'}>
                                {'\n                            정보 수정 ↗\n                          '}
                              </a>
                            </>
                          </div>
                        </>
                      </div>
                    </>
                  </aside>
                </>
              </div>
              <section className={'section'} data-mobile-panel={'reference'}>
                <>
                  <h2>{'이 도구도 살펴보세요.'}</h2>
                  <div className={'related-grid'}>
                    {related(a).map((r, rowIndex8) => (
                      <a key={rowIndex8} className={'related-card'} href={'/' + r.slug}>
                        <ToolIcon app={r} /> <strong>{r.nameKo}</strong>
                        <span className={cn(['verdict', r.verdict])} style={styleObject('font-size:11px')}>
                          {verdicts[r.verdict].symbol} {verdicts[r.verdict].label}
                        </span>
                      </a>
                    ))}
                  </div>
                </>
              </section>
              <div data-mobile-panel={'reference'} />
              <div className={'mobile-only mobile-detail-action'}>
                <>
                  <a className={'button'} href={'#tool-prompt'} data-detail-view={'prompt'}>
                    {'\n                프롬프트 보기 '}
                    <span aria-hidden={'true'}>{'↗'}</span>
                  </a>
                  <button className={'button secondary'} data-native-share={''} aria-label={'이 도구 공유'}>
                    {'\n                공유\n              '}
                  </button>
                </>
              </div>
            </>
          </>
        ) : (
          <section className={'page-head empty'}>
            <>
              <Mascot size={'large'} /> <div className={'eyebrow'}>{'404 · 페이지 없음'}</div>
              <h1>{'아직 이 도구를 찾지 못했어요.'}</h1>
              <p>{'이름을 다시 검색하거나 도구를 제안해 주세요.'}</p>
              <a className={'button'} href={'/'}>
                {'\n            도구 탐색으로 돌아가기\n          '}
              </a>
            </>
          </section>
        )}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { service, a, v, voted, bookmarked, count, builds, jsonld } = ctx.locals.presentation
    .data as PageData;
  return createMetadata(
    {
      title: a ? `${a.nameKo}, 직접 만들어 대체할 수 있을까?` : '도구를 찾을 수 없어요',
      description: a ? a.scope + ' — ' + a.verdictReason : undefined,
      og: a ? '/og/' + a.slug + '.png' : undefined,
      noindex: !a || service?.status !== 'published',
    },
    ctx.url.pathname,
  );
}
