'use strict';
(() => {
  const pending = [];
  let failed = false;
  const language = document.documentElement.lang === 'fa' ? 'fa' : 'en';
  function flush() {
    if (typeof window.umami?.track !== 'function') return;
    while (pending.length) {
      const [name, data] = pending.shift();
      try {
        Promise.resolve(window.umami.track(name, data)).catch(() => {});
      } catch {
        // Analytics must never interrupt a game or retry an event twice.
      }
    }
  }
  window.QUIZ_ANALYTICS = {
    track(name, data = {}) {
      if (failed) return;
      if (pending.length < 100) pending.push([name, { ...data, language }]);
      flush();
    },
  };
  const tracker = document.querySelector(
    'script[src="https://cloud.umami.is/script.js"]',
  );
  tracker?.addEventListener('load', flush);
  tracker?.addEventListener('error', () => {
    failed = true;
    pending.length = 0;
  });
  window.addEventListener('load', flush, { once: true });
})();
