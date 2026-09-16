'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UiIcon from './UiIcon';

export default function DirectorySearch() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get('q') || '';
  const [draft, setDraft] = useState(query);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const composing = useRef(false);

  function search(value: string) {
    clearTimeout(timer.current);
    pending.current = value;
    const url = new URL(location.href);
    value ? url.searchParams.set('q', value) : url.searchParams.delete('q');
    url.searchParams.delete('page');
    router.push(url.pathname + url.search, { scroll: false });
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': csrf },
      body: JSON.stringify({ event: 'search' }),
    }).catch(() => {});
  }
  function queue(value: string) {
    setDraft(value);
    pending.current = value;
    clearTimeout(timer.current);
    if (!composing.current) timer.current = setTimeout(() => search(value), 160);
  }
  useEffect(() => {
    // An older response must not erase characters typed while navigation was pending.
    if (pending.current === null || pending.current === query) {
      pending.current = null;
      setDraft(query);
    }
  }, [query]);
  useEffect(() => {
    const restore = () => {
      clearTimeout(timer.current);
      pending.current = null;
      setDraft(new URL(location.href).searchParams.get('q') || '');
    };
    window.addEventListener('popstate', restore);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('popstate', restore);
    };
  }, []);
  return (
    <form
      action="/"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        search(draft);
        (event.currentTarget.querySelector('input') as HTMLInputElement)?.blur();
      }}
    >
      <label className="search-box">
        <span aria-hidden="true">
          <UiIcon name="search" />
        </span>
        <input
          id="search"
          name="q"
          aria-label="도구 검색"
          placeholder="노션, 엑셀… 만들고 싶은 도구 검색"
          value={draft}
          autoComplete="off"
          onChange={(event) => queue(event.target.value)}
          onCompositionStart={() => {
            composing.current = true;
            clearTimeout(timer.current);
          }}
          onCompositionEnd={(event) => {
            composing.current = false;
            queue(event.currentTarget.value);
          }}
        />
        <kbd aria-hidden="true">/</kbd>
        <button className="mobile-only search-submit" type="submit" aria-label="검색">
          <UiIcon name="search" />
        </button>
      </label>
    </form>
  );
}
