export function enhance(navigate: (url: string, push?: boolean) => void) {
  const cleanups: Array<() => void> = [];
  function listen(target: EventTarget, type: string, callback: any, options?: any) {
    target.addEventListener(type, callback, options);
    cleanups.push(() => target.removeEventListener(type, callback, options));
  }

  document.documentElement.dataset.enhanced = 'true';
  document.querySelectorAll<HTMLDialogElement>('.mobile-sheet[open]').forEach((sheet) => sheet.close());
  function iconFallback(img: HTMLImageElement) {
    if (!img.hasAttribute('data-tool-icon-image')) return;
    img.hidden = true;
    img.parentElement?.classList.remove('has-image');
    img.parentElement?.querySelector('[data-tool-icon-fallback]')?.removeAttribute('hidden');
  }
  listen(
    document,
    'error',
    (event: any) => {
      if (event.target instanceof HTMLImageElement) iconFallback(event.target);
    },
    true,
  );
  document.querySelectorAll<HTMLImageElement>('[data-tool-icon-image]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) iconFallback(img);
  });
  const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
  let toastTimer: ReturnType<typeof setTimeout>;
  function toast(message: string) {
    const el = $('#toast')!;
    el.textContent = message;
    el.removeAttribute('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.setAttribute('hidden', ''), 3500);
  }
  const csrf = () => $('meta[name="csrf-token"]')?.getAttribute('content') || '';
  async function api(path: string, body: any) {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf() },
      body: JSON.stringify(body),
    });
    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error('응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
    if (!response.ok) {
      if (response.status === 401) {
        location.href = '/login?returnTo=' + encodeURIComponent(location.pathname + location.search);
      }
      throw new Error(result.error || '요청을 처리하지 못했어요.');
    }
    return result;
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement('textarea');
      field.value = text;
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.append(field);
      field.select();
      const ok = document.execCommand('copy');
      field.remove();
      if (!ok) throw new Error('자동 복사가 지원되지 않아요. 프롬프트를 선택해 직접 복사해 주세요.');
    }
  }
  async function updateDirectory(url: URL, push = true) {
    if (!document.querySelector('#directory')) return;
    navigate(url.pathname + url.search + url.hash, push);
  }
  listen(document, 'change', (e: any) => {
    const select = e.target as HTMLSelectElement;
    if (!select.closest('#filters')) return;
    const url = new URL(location.href);
    select.value ? url.searchParams.set(select.name, select.value) : url.searchParams.delete(select.name);
    url.searchParams.delete('page');
    updateDirectory(url);
  });

  listen(document, 'keydown', (e: any) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
      const input = $<HTMLInputElement>('#search');
      if (input) {
        e.preventDefault();
        input.focus();
      }
    }
  });
  listen(document, 'submit', async (e: any) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('[data-mobile-filters], [data-directory-search]')) {
      e.preventDefault();
      const url = new URL(location.href);
      const mobileFilters = form.hasAttribute('data-mobile-filters');
      for (const [key, value] of new FormData(form)) {
        value ? url.searchParams.set(key, String(value)) : url.searchParams.delete(key);
      }
      url.searchParams.delete('page');
      url.hash = '';
      form.closest('dialog')?.close();
      form.querySelector<HTMLInputElement>('input:not([type=hidden])')?.blur();
      await updateDirectory(url);
      if (mobileFilters) $('#mobile-filter-trigger')?.focus({ preventScroll: true });
      return;
    }
    if (!form.matches('form[data-api]')) return;
    e.preventDefault();
    if (form.dataset.uploading === 'true') {
      toast('이미지 첨부가 끝나면 등록할 수 있어요.');
      return;
    }
    if (form.dataset.confirm && !window.confirm(form.dataset.confirm)) return;
    const status = form.querySelector<HTMLElement>('.form-status');
    const button = form.querySelector<HTMLButtonElement>('button[type=submit],button:not([type])');
    if (button) button.disabled = true;
    if (status) {
      status.textContent = '처리 중이에요…';
      status.classList.remove('error');
    }
    try {
      const body = Object.fromEntries(new FormData(form));
      const data = await api(form.getAttribute('action')!, body);
      if (data.redirect) {
        const destination = new URL(data.redirect, location.href);
        const samePage =
          destination.origin === location.origin &&
          destination.pathname === location.pathname &&
          destination.search === location.search;
        location.href = data.redirect;
        if (samePage) location.reload();
        return;
      }
      if (status) {
        status.textContent = data.message || '저장했어요.';
        if (data.withdrawUrl) {
          const link = document.createElement('a');
          link.href = data.withdrawUrl;
          link.textContent = ' 수신 거부 링크';
          link.style.textDecoration = 'underline';
          status.append(link);
        }
      } else toast(data.message || '저장했어요.');
    } catch (err) {
      const text = (err as Error).message;
      if (status) {
        status.textContent = text;
        status.classList.add('error');
      } else toast(text);
    } finally {
      if (button) button.disabled = false;
    }
  });
  listen(document, 'click', async (e: any) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[data-filter-link]');
    if (link && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      link.closest('dialog')?.close();
      await updateDirectory(new URL(link.href));
      if (link.hasAttribute('data-page-link')) {
        $('#mobile-results-title')?.focus({ preventScroll: true });
        $('#directory')?.scrollIntoView({ block: 'start' });
      }
      return;
    }
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b) return;
    try {
      if (b.hasAttribute('data-theme-toggle')) {
        const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = theme;
        try {
          localStorage.setItem('theme', theme);
        } catch {}
        return;
      }
      if (b.dataset.copy) {
        const target = document.getElementById(b.dataset.copy);
        const prefix = b.dataset.agent
          ? (
              {
                claude:
                  'Claude Code에서 프로젝트 폴더를 열고 아래 요구사항을 전달하세요. 변경 사항을 검토하고 실행·검증까지 진행하세요.\n\n',
                codex:
                  'Codex에서 작업할 프로젝트를 선택한 뒤 아래 요구사항을 전달하세요. 구현 후 실제 서버와 테스트로 동작을 검증하세요.\n\n',
                cursor:
                  'Cursor의 프로젝트에서 Agent 대화를 열고 아래 요구사항을 전달하세요. 파일 변경을 검토하고 터미널에서 실행 결과를 확인하세요.\n\n',
              } as Record<string, string>
            )[b.dataset.agent]
          : '';
        await copy((prefix || '') + (target?.textContent || ''));
        const before = b.textContent;
        b.textContent = '복사했어요 ✓';
        setTimeout(() => (b.textContent = before), 1800);
        api('/api/analytics', { event: 'copy', slug: b.dataset.slug }).catch(() => {});
        return;
      }
      if (b.hasAttribute('data-copy-url')) {
        await copy($('link[rel=canonical]')?.getAttribute('href') || location.href);
        toast('링크를 복사했어요.');
        return;
      }
      if (b.hasAttribute('data-native-share')) {
        const url = $('link[rel=canonical]')?.getAttribute('href') || location.href;
        if (navigator.share) await navigator.share({ title: document.title, url });
        else {
          await copy(url);
          toast('공유 링크를 복사했어요.');
        }
        return;
      }
      if (b.dataset.kakaoKey) {
        b.disabled = true;
        const w = window as any;
        if (!w.Kakao)
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => resolve();
            script.onerror = () => {
              script.remove();
              reject(new Error('카카오톡 공유를 불러오지 못했어요. 링크 복사를 이용해 주세요.'));
            };
            document.head.append(script);
          });
        if (!w.Kakao.isInitialized()) w.Kakao.init(b.dataset.kakaoKey);
        const url = $('link[rel=canonical]')!.getAttribute('href')!;
        w.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: document.title,
            description: $('meta[name=description]')?.getAttribute('content') || '',
            imageUrl: $('meta[property="og:image"]')?.getAttribute('content'),
            link: { webUrl: url, mobileWebUrl: url },
          },
          buttons: [{ title: '대체 가능성 살펴보기', link: { webUrl: url, mobileWebUrl: url } }],
        });
        return;
      }
      if (b.hasAttribute('data-vote')) {
        b.disabled = true;
        const remove = b.getAttribute('aria-pressed') === 'true';
        const data = await api('/api/vote', { slug: b.dataset.slug, remove });
        b.setAttribute('aria-pressed', String(data.voted));
        b.textContent = data.voted ? '대체 경험 취소' : '직접 대체했어요';
        document
          .querySelectorAll('[data-experience-count]')
          .forEach((el) => (el.textContent = String(data.count)));
        toast(data.voted ? '대체 경험을 남겼어요.' : '대체 경험을 취소했어요.');
        return;
      }
      if (b.hasAttribute('data-bookmark')) {
        b.disabled = true;
        const data = await api('/api/tool/bookmark', { slug: b.dataset.slug });
        b.setAttribute('aria-pressed', String(data.active));
        b.textContent = data.active ? '저장했어요 ✓' : '도구 저장 ☆';
        return;
      }
      if (b.hasAttribute('data-react')) {
        b.disabled = true;
        const data = await api('/api/posts/react', { post: b.dataset.post, kind: b.dataset.react });
        b.setAttribute('aria-pressed', String(data.active));
        b.textContent =
          b.dataset.react === 'like'
            ? '좋아요 ' + data.count + (data.active ? ' ✓' : '')
            : data.active
              ? '저장했어요 ✓'
              : '글 저장 ☆';
        return;
      }
      if (b.hasAttribute('data-preview')) {
        const area = $<HTMLTextAreaElement>('textarea[name=body]');
        const preview = $('#markdown-preview');
        if (area && preview) {
          preview.textContent = area.value;
          preview.hidden = !preview.hidden;
        }
        return;
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') toast((err as Error).message);
    } finally {
      b.disabled = false;
    }
  });
  document
    .querySelectorAll<HTMLElement>('[data-service-upload-controls]')
    .forEach((el) => (el.hidden = false));
  listen(document, 'click', (event: any) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-service-image-remove]');
    const form = button?.closest<HTMLFormElement>('form');
    if (!form || form.dataset.uploading === 'true') return;
    form.querySelector<HTMLInputElement>('input[name=image]')!.value = '';
    const preview = form.querySelector<HTMLImageElement>('[data-service-image-preview]')!;
    preview.hidden = true;
    preview.removeAttribute('src');
    button!.hidden = true;
  });
  listen(document, 'change', async (event: any) => {
    const input = event.target as HTMLInputElement;
    const serviceUpload = input.hasAttribute('data-service-upload');
    if ((!input.hasAttribute('data-upload') && !serviceUpload) || !input.files?.[0]) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast('5MB 이하 이미지를 선택해 주세요.');
      input.value = '';
      return;
    }
    const editor = serviceUpload ? input.closest<HTMLFormElement>('form') : null;
    const submit = editor?.querySelector<HTMLButtonElement>('button[type=submit]');
    const status = editor?.querySelector<HTMLElement>('.form-status');
    if (editor) editor.dataset.uploading = 'true';
    if (submit) submit.disabled = true;
    if (status) status.textContent = '이미지를 첨부하고 있어요…';
    input.disabled = true;
    try {
      const form = new FormData();
      form.set('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-csrf-token': csrf() },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (editor) {
        editor.querySelector<HTMLInputElement>('input[name=image]')!.value = data.url;
        const preview = editor.querySelector<HTMLImageElement>('[data-service-image-preview]')!;
        preview.src = data.url;
        preview.hidden = false;
        editor.querySelector<HTMLElement>('[data-service-image-remove]')!.hidden = false;
        if (status) status.textContent = '이미지를 첨부했어요.';
      } else {
        const body = $<HTMLTextAreaElement>('textarea[name=body]');
        if (body) body.value += '\n\n![제작 화면](' + data.url + ')\n';
        toast('이미지를 첨부했어요. 글을 게시하면 함께 공개됩니다.');
      }
    } catch (e) {
      if (status) status.textContent = (e as Error).message;
      toast((e as Error).message);
    } finally {
      input.value = '';
      input.disabled = false;
      if (editor) delete editor.dataset.uploading;
      if (submit) submit.disabled = false;
    }
  });

  // Mobile surfaces share the same URLs and server data as the desktop workspace.
  const mobileViewport = window.matchMedia('(max-width: 760px)');
  function syncMobileDetail() {
    const panels = document.querySelectorAll<HTMLElement>('[data-mobile-panel]');
    if (!panels.length) return;
    const view =
      location.hash === '#tool-prompt'
        ? 'prompt'
        : location.hash === '#tool-reference'
          ? 'reference'
          : 'overview';
    document.body.dataset.mobileView = view;
    for (const panel of panels) panel.hidden = mobileViewport.matches && panel.dataset.mobilePanel !== view;
    document.querySelectorAll<HTMLAnchorElement>('.mobile-detail-tabs [data-detail-view]').forEach((link) => {
      if (link.dataset.detailView === view) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  function closeMobileSheets() {
    document.querySelectorAll<HTMLDialogElement>('.mobile-sheet[open]').forEach((sheet) => sheet.close());
  }
  listen(mobileViewport, 'change', () => {
    syncMobileDetail();
    if (!mobileViewport.matches) closeMobileSheets();
  });
  listen(window, 'hashchange', syncMobileDetail);
  listen(window, 'popstate', () => {
    closeMobileSheets();
    syncMobileDetail();
  });
  syncMobileDetail();
  listen(document, 'click', (event: any) => {
    const target: Element | null = event.target instanceof Element ? event.target : null;
    const opener = target?.closest<HTMLButtonElement>('[data-open-sheet]');
    if (opener) {
      const sheet = document.getElementById(opener.dataset.openSheet!) as HTMLDialogElement | null;
      if (!sheet) return;
      const form = sheet.querySelector('form');
      form?.reset();
      sheet.showModal();
      document.documentElement.classList.add('sheet-open');
      listen(sheet, 'close', () => document.documentElement.classList.remove('sheet-open'), {
        once: true,
      });
    }
    if (target?.closest('[data-close-sheet]')) target.closest('dialog')?.close();
    if (target instanceof HTMLDialogElement && target.classList.contains('mobile-sheet')) {
      const rect = target.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        target.close();
    }
    const detailLink = target?.closest<HTMLAnchorElement>('[data-detail-view]');
    if (
      detailLink &&
      mobileViewport.matches &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      event.button === 0
    ) {
      event.preventDefault();
      history.pushState(null, '', detailLink.hash);
      syncMobileDetail();
      $('.mobile-detail-tabs')?.scrollIntoView({ block: 'start' });
    }
  });

  // The form remains usable without JavaScript; with it, unused guide inputs stay out of the way.
  document.querySelectorAll<HTMLSelectElement>('[data-guide-mode]').forEach((select) => {
    const fields = select.closest('details')?.querySelector<HTMLFieldSetElement>('[data-guide-fields]');
    const update = () => {
      if (fields) {
        fields.hidden = select.value !== 'present';
        fields.disabled = select.value !== 'present';
      }
    };
    listen(select, 'change', update);
    update();
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    clearTimeout(toastTimer);
  };
}
