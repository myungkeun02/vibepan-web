import { getPageContext } from '../lib/server-context';
export default async function Newsletter() {
  const {
    locals: { csrf },
  } = await getPageContext();
  return (
    <section className="newsletter home-panel" aria-labelledby="newsletter-title">
      <header className="home-panel-heading">
        <h2 id="newsletter-title">업데이트 소식 받기</h2>
      </header>
      <p className="home-panel-description">새로 추가한 도구와 제작 가이드를 이메일로 보내드려요.</p>
      <form data-api action="/api/waitlist" method="post">
        <input type="hidden" name="csrf" defaultValue={csrf} />
        <label className="honeypot" aria-hidden="true">
          홈페이지
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="newsletter-email-label" htmlFor="newsletter-email">
          이메일
        </label>
        <div className="newsletter-input-row">
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <button className="primary" type="submit">
            소식 받기
          </button>
        </div>
        <label className="check-label">
          <input type="checkbox" name="consent" required />
          <span>이메일 수신에 동의해요. 언제든 해지할 수 있어요.</span>
        </label>
        <p className="form-status" role="status" />
      </form>
    </section>
  );
}
