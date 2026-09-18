import Link from 'next/link';
import { createMetadata } from '../lib/metadata';
import { getPageContext } from '../lib/server-context';
import type { PageData } from '../contracts/me';
import Base from '../layouts/Base';
import UiIcon from '../components/UiIcon';
import { getApp } from '../lib/apps';
import {
  accountActivities,
  activityDate,
  activityHref,
  activityPage,
  activityTabs,
} from '../lib/account-activity';

export default async function MyAccount() {
  const ctx = await getPageContext();
  const data = ctx.locals.presentation.data as PageData;
  const { user } = data;
  const activity = activityPage(
    accountActivities(data, (slug) => getApp(slug)?.nameKo),
    ctx.url.searchParams,
  );
  const csrf = <input type="hidden" name="csrf" defaultValue={ctx.locals.csrf} />;
  return (
    <Base pageKind="account" title="내 활동" noindex>
      <header className="page-head account-heading">
        <h1>내 활동</h1>
        <p>작성한 글, 저장한 도구, 남긴 제안을 모아봤어요.</p>
      </header>
      <div className="account-layout">
        <aside className="account-profile" aria-label="내 프로필">
          <div className="account-person">
            <span className="account-avatar" aria-hidden="true">
              {Array.from(String(user.nickname))[0]}
            </span>
            <div>
              <strong>{user.nickname}</strong>
              <p>{user.email}</p>
            </div>
          </div>
          {user.bio && <p className="account-bio">{user.bio}</p>}
          <div className="account-shortcuts">
            <a href="/community/new">
              글 쓰기 <UiIcon name="plus" />
            </a>
            <a href="/services/new">
              SaaS 등록 <UiIcon name="plus" />
            </a>
          </div>
          <details className="account-settings" id="profile-settings">
            <summary>
              프로필 설정 <span aria-hidden="true">⌄</span>
            </summary>
            <div className="account-settings-body">
              <p className="small muted">
                {user.email_verified_at ? '이메일 확인 완료' : '이메일 주소를 확인해 주세요.'}
              </p>
              {!user.email_verified_at && (
                <form data-api action="/api/auth/send-verification" method="post">
                  {csrf}
                  <button type="submit" className="button secondary small">
                    확인 메일 받기
                  </button>
                  <p className="form-status" role="status" />
                </form>
              )}
              <form data-api action="/api/profile/update" method="post">
                {csrf}
                <label className="form-field">
                  <span>닉네임</span>
                  <input name="nickname" defaultValue={user.nickname} required minLength={2} maxLength={24} />
                </label>
                <label className="form-field">
                  <span>소개</span>
                  <textarea name="bio" maxLength={500} rows={3} defaultValue={user.bio} />
                </label>
                <button type="submit" className="primary">
                  프로필 저장
                </button>
                <p className="form-status" role="status" />
              </form>
              <div className="account-session">
                {user.role === 'admin' && <a href="/admin">관리자 화면 ↗</a>}
                <form data-api action="/api/auth/logout" method="post">
                  {csrf}
                  <button className="text-button" type="submit">
                    로그아웃
                  </button>
                </form>
              </div>
              <details className="account-withdraw">
                <summary>계정 탈퇴</summary>
                <p className="small muted">
                  작성한 글과 댓글, 등록한 SaaS, 대체 기록, 저장 목록과 이메일 정보가 삭제됩니다. 모든
                  기기에서 로그아웃됩니다.
                </p>
                <form
                  data-api
                  data-confirm="정말 탈퇴할까요? 계정 정보를 복구할 수 없습니다."
                  action="/api/profile/delete"
                  method="post"
                >
                  {csrf}
                  {user.password && (
                    <label className="form-field">
                      <span>현재 비밀번호</span>
                      <input type="password" name="password" required autoComplete="current-password" />
                    </label>
                  )}
                  <label className="form-field">
                    <span>“탈퇴합니다”를 입력해 주세요</span>
                    <input name="confirm" placeholder="탈퇴합니다" required />
                  </label>
                  <button className="button secondary danger" type="submit">
                    계정 탈퇴
                  </button>
                  <p className="form-status" role="status" />
                </form>
              </details>
            </div>
          </details>
        </aside>
        <section className="account-feed" id="my-activity" aria-label="내 활동 목록">
          <nav className="activity-tabs" aria-label="활동 종류">
            {activityTabs.map((tab) => (
              <Link
                key={tab.id}
                href={activityHref(tab.id)}
                scroll={false}
                aria-current={tab.id === activity.tab.id ? 'page' : undefined}
              >
                {tab.label}
                <span>{activity.counts[tab.id]}</span>
              </Link>
            ))}
          </nav>
          <div className="activity-list-heading">
            <h2>{activity.tab.label === '전체' ? '전체 활동' : activity.tab.label}</h2>
            <span>{activity.total}개</span>
          </div>
          {activity.items.length ? (
            <ul className="activity-list">
              {activity.items.map((item) => {
                const content = (
                  <>
                    <div className="activity-meta">
                      <span>{item.kind}</span>
                      {item.status && <span className="activity-status">{item.status}</span>}
                      {item.date && <time dateTime={item.date}>{activityDate(item.date)}</time>}
                    </div>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                    {item.href && (
                      <span className="activity-arrow">
                        <UiIcon name="arrow" />
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={item.id} data-activity-kind={item.category}>
                    {item.href ? (
                      <Link className="activity-item" href={item.href}>
                        {content}
                      </Link>
                    ) : (
                      <div className="activity-item">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="activity-empty">
              <UiIcon name={activity.tab.id === 'comments' ? 'chat' : 'grid'} />
              <h3>{activity.tab.empty}</h3>
              <a className="button secondary" href={activity.tab.href}>
                {activity.tab.action}
                <UiIcon name="arrow" />
              </a>
            </div>
          )}
          {activity.pages > 1 && (
            <nav className="activity-pagination" aria-label="활동 목록 페이지">
              {activity.page > 1 ? (
                <Link href={activityHref(activity.tab.id, activity.page - 1)}>← 이전</Link>
              ) : (
                <span aria-disabled="true">← 이전</span>
              )}
              <span>
                {activity.page} / {activity.pages}
              </span>
              {activity.page < activity.pages ? (
                <Link href={activityHref(activity.tab.id, activity.page + 1)}>다음 →</Link>
              ) : (
                <span aria-disabled="true">다음 →</span>
              )}
            </nav>
          )}
        </section>
      </div>
    </Base>
  );
}
export async function pageMetadata() {
  return createMetadata({ title: '내 활동', noindex: true }, '/me');
}
