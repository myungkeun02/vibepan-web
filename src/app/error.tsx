'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="wrap error-page">
      <h1>잠시 연결이 끊겼어요.</h1>
      <p>다시 시도해 주세요.</p>
      <button className="button primary" onClick={reset}>
        다시 시도
      </button>
    </main>
  );
}
