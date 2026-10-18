const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const key = 'real-or-ai-images-v2';
const translations = fs.readFileSync('public/translations.js', 'utf8');
const appSource = fs.readFileSync('public/app.js', 'utf8');
const fixture = [
  { id: 'car-real', real: true, src: 'car.jpg', category: { en: 'Cars' } },
  { id: 'car-ai', real: false, src: 'car-ai.jpg', category: { en: 'Cars' } },
  {
    id: 'portrait-real',
    real: true,
    src: 'portrait.jpg',
    category: { en: 'Portrait' },
  },
  {
    id: 'portrait-ai',
    real: false,
    src: 'portrait-ai.jpg',
    category: { en: 'Portrait' },
  },
];
function boot({
  language = 'en',
  hash = '#play',
  pathname = '/en/play/',
  store = {},
  catalog = fixture,
  storageFails = false,
  availableBottom = 800,
} = {}) {
  let html = '';
  const nodes = {};
  const events = {};
  const analytics = [];
  const node = (id) =>
    (nodes[id] ??= {
      dataset: {},
      disabled: true,
      set innerHTML(value) {
        if (id === 'answer-panel') {
          const marker = '<div id="answer-panel" class="answer-panel">';
          html =
            html.slice(0, html.indexOf(marker) + marker.length) +
            value +
            '</div></section>';
        }
      },
      focus() {
        this.focused = true;
      },
    });
  const app = {
    classList: { add() {} },
    scrollTop: 0,
    getBoundingClientRect: () => ({ bottom: availableBottom }),
    querySelectorAll: () => [],
    querySelector: () => ({
      getBoundingClientRect: () => ({ top: 60 }),
      children: [{ getBoundingClientRect: () => ({ height: 104 }) }],
    }),
    get innerHTML() {
      return html;
    },
    set innerHTML(value) {
      html = value;
      for (const id of Object.keys(nodes)) delete nodes[id];
    },
  };
  const context = {
    window: {
      QUIZ_IMAGES: catalog,
      location: { hash, pathname },
      addEventListener(name, fn) {
        events[name] = fn;
      },
      QUIZ_ANALYTICS: {
        track(name, data) {
          analytics.push({ name, data });
        },
      },
    },
    document: {
      documentElement: { lang: language },
      currentScript: { src: 'https://example.test/realorai/app.js' },
      getElementById: (id) => (id === 'app' ? app : node(id)),
    },
    URL,
    Intl,
    Date,
    localStorage: {
      getItem(k) {
        if (storageFails) throw Error('Unavailable');
        return store[k] ?? null;
      },
      setItem(k, v) {
        if (storageFails) throw Error('Unavailable');
        store[k] = v;
      },
    },
  };
  vm.createContext(context);
  vm.runInContext(translations, context);
  vm.runInContext(appSource, context);
  return {
    app,
    nodes,
    store,
    events,
    analytics,
    run: (code) => vm.runInContext(code, context),
    load() {
      nodes['quiz-image'].onload();
    },
    answer(value) {
      this.load();
      this.run('answer(' + value + ')');
    },
  };
}
const store = {
  'real-or-ai-history-v1': JSON.stringify({
    version: 1,
    answers: [{ id: 'old' }],
  }),
};
const q = boot({ store });
assert.equal(q.run('state.history.length'), 0, 'No migration of old rounds');
assert.equal(q.run('byId.get(state.current).category.en'), 'Cars');
q.run('answer(true)');
assert.equal(q.run('state.history.length'), 0, 'No answer before image loads');
const first = q.run('state.current');
q.load();
const originalImage = q.nodes['quiz-image'];
const originalRenderToken = q.run('renderToken');
q.run('answer(byId.get(state.current).real)');
assert.equal(
  q.nodes['quiz-image'],
  originalImage,
  'Answer must preserve the loaded image node',
);
assert.equal(
  q.run('renderToken'),
  originalRenderToken,
  'Answer must not rerender the page',
);
assert.equal(JSON.parse(store[key]).history.length, 1, 'Save immediately');
assert(q.app.innerHTML.includes('✓ Correct'));
assert(q.app.innerHTML.includes('Your answer:'));
assert(q.nodes['answer-feedback'].focused);
q.run('answer(false)');
assert.equal(q.run('state.history.length'), 1, 'Ignore duplicate clicks');
const reload = boot({ store });
assert.equal(reload.run('state.current'), first);
assert(reload.app.innerHTML.includes('✓ Correct'), 'Reload keeps feedback');
for (const lang of ['fa', 'ar', 'tr', 'fr', 'ru']) {
  const localized = boot({ store, language: lang });
  assert.equal(localized.run('state.current'), first);
  assert(!localized.app.innerHTML.includes('undefined'));
  assert.equal(
    localized.run('JSON.stringify(Object.keys(copy).sort())'),
    q.run('JSON.stringify(Object.keys(copy).sort())'),
  );
}
const categories = ['Cars'];
const seen = new Set([first]);
for (let i = 0; i < 3; i++) {
  q.run('start()');
  const id = q.run('state.current');
  assert(!seen.has(id));
  seen.add(id);
  categories.push(q.run('byId.get(state.current).category.en'));
  q.load();
  q.run('answer(!byId.get(state.current).real)');
  assert(q.app.innerHTML.includes('× Incorrect'));
}
assert.deepEqual(categories, ['Cars', 'Portrait', 'Cars', 'Portrait']);
assert.equal(q.run('state.history.length'), 4);
q.run('start()');
assert.equal(q.run('state.current'), null);
assert(q.app.innerHTML.includes('every available image'));
const history = boot({ store, pathname: '/en/history/', hash: '' });
assert(history.app.innerHTML.includes('Your answer'));
assert(history.app.innerHTML.includes('Correct answer'));
assert.equal((history.app.innerHTML.match(/<time /g) || []).length, 4);
const home = boot({ hash: '', pathname: '/en/' });
assert.equal(home.run('state.current'), null);
assert.equal(home.run('state.history.length'), 0);
const singleCategory = boot({ catalog: fixture.filter((image) => image.real) });
singleCategory.answer(true);
singleCategory.run('start()');
assert.equal(
  singleCategory.run('byId.get(state.current).category.en'),
  'Portrait',
  'Real photos remain playable without AI',
);
const fallback = boot({
  catalog: fixture.filter((image) => image.category.en === 'Cars'),
});
fallback.answer(true);
fallback.run('start()');
assert.equal(
  fallback.run('byId.get(state.current).category.en'),
  'Cars',
  'Fallback when other category exhausted',
);
const failed = boot();
const stale = failed.nodes['quiz-image'].onload;
failed.nodes['quiz-image'].onerror();
assert(failed.app.innerHTML.includes('id="real" disabled'));
assert(failed.nodes.retry.onclick);
failed.nodes.skip.onclick();
assert.equal(
  failed.run('state.history.length'),
  0,
  'Failed loads are not answers',
);
assert.equal(failed.run('byId.get(state.current).category.en'), 'Portrait');
stale();
assert.equal(
  failed.run('loaded'),
  false,
  'Stale callbacks cannot enable answers',
);
const blocked = boot({ storageFails: true });
assert(blocked.app.innerHTML.includes('role="alert"'));
const many = Array.from({ length: 13 }, (_, i) => ({
  id: 'image-' + i,
  choice: true,
  real: i % 2 === 0,
  answeredAt: new Date().toISOString(),
}));
const paged = boot({
  pathname: '/history/',
  store: {
    [key]: JSON.stringify({ version: 2, history: many, current: null }),
  },
});
assert.equal((paged.app.innerHTML.match(/<time /g) || []).length, 12);
paged.nodes['history-next'].onclick();
assert.equal((paged.app.innerHTML.match(/<time /g) || []).length, 1);
const compact = boot({
  pathname: '/history/',
  availableBottom: 384,
  catalog: many.map((record) => ({ ...fixture[0], id: record.id })),
  store: {
    [key]: JSON.stringify({ version: 2, history: many, current: null }),
  },
});
assert.equal(
  (compact.app.innerHTML.match(/<time /g) || []).length,
  4,
  'Short screens show fewer rows per page',
);
assert(compact.app.innerHTML.includes('history-thumbnail'));
assert(
  !compact.app.innerHTML.includes('target="_blank"'),
  'Thumbnails open a modal rather than a new tab',
);
const retired = { ...fixture[0], active: false };
const review = boot({
  catalog: [retired],
  store: {
    [key]: JSON.stringify({
      version: 2,
      history: [
        {
          id: retired.id,
          choice: true,
          real: true,
          answeredAt: new Date().toISOString(),
        },
      ],
      current: retired.id,
    }),
  },
});
assert(
  review.app.innerHTML.includes('✓ Correct'),
  'Retired images remain reviewable',
);
assert.equal(q.analytics.filter((event) => event.name === 'answer').length, 4);
assert(!q.analytics.some((event) => event.name === 'game-complete'));
console.log(
  'PASS: continuous per-image feedback and history, duplicate protection, persistence across languages, alternating categories, exhaustion, loading errors, and storage failures.',
);
// Analytics failures must not interrupt gameplay.
for (const mode of ['throws', 'rejects', 'missing']) {
  const callbacks = {};
  const context = {
    window: {
      location: { hostname: 'ohmydevops.github.io' },
      addEventListener() {},
      umami:
        mode === 'missing'
          ? undefined
          : {
              track() {
                if (mode === 'throws') throw Error('Offline');
                return Promise.reject(Error('Offline'));
              },
            },
    },
    document: {
      documentElement: { lang: 'en' },
      querySelector() {
        return {
          addEventListener(name, fn) {
            callbacks[name] = fn;
          },
        };
      },
    },
    Promise,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('public/analytics.js', 'utf8'), context);
  context.window.QUIZ_ANALYTICS.track('answer');
  callbacks.error();
  context.window.QUIZ_ANALYTICS.track('answer');
}
console.log('PASS: analytics failure isolation.');
