const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const source = fs.readFileSync('public/app.js', 'utf8');
const store = {};
function boot(lang = 'en', hash = '#play', trackerMode = 'ready') {
  const analytics = [];
  const trackerEvents = {};
  const tracker = {
    track(name, data) {
      if (trackerMode === 'throws') throw new Error('Tracker unavailable');
      if (trackerMode === 'rejects')
        return Promise.reject(new Error('Offline'));
      analytics.push({ name, data });
    },
  };
  let html = '';
  const nodes = {};
  let now = Date.now();
  let nextTimer = 0;
  const timers = new Map();
  const staticIDs = new Set([
    'settings-dialog',
    'settings-open',
    'timer-enabled',
    'history-dialog',
    'history-open',
    'about-dialog',
    'about-open',
  ]);
  function node(id) {
    return (nodes[id] ??= {
      dataset: {},
      events: {},
      addEventListener(name, callback) {
        this.events[name] = callback;
      },
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
        this.events.close?.();
      },
    });
  }
  class FakeDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  }
  const app = {
    get innerHTML() {
      return html;
    },
    set innerHTML(v) {
      html = v;
      for (const k of Object.keys(nodes))
        if (!staticIDs.has(k)) delete nodes[k];
    },
  };
  const c = {
    window: {
      location: { hash },
      addEventListener() {},
      umami: ['missing', 'delayed'].includes(trackerMode) ? undefined : tracker,
    },
    document: {
      documentElement: { lang },
      currentScript: { src: 'https://example.test/app.js' },
      querySelector: () => ({
        addEventListener: (name, callback) => (trackerEvents[name] = callback),
      }),
      getElementById: (id) => (id === 'app' ? app : node(id)),
    },
    URL,
    Intl,
    Date: FakeDate,
    setInterval: (callback) => {
      timers.set(++nextTimer, callback);
      return nextTimer;
    },
    clearInterval: (id) => timers.delete(id),
    localStorage: {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => (store[k] = v),
    },
  };
  vm.createContext(c);
  vm.runInContext(fs.readFileSync('public/images.js', 'utf8'), c);
  vm.runInContext(fs.readFileSync('public/translations.js', 'utf8'), c);
  vm.runInContext(fs.readFileSync('public/analytics.js', 'utf8'), c);
  vm.runInContext(source, c);
  return {
    analytics,
    tracker,
    trackerEvents,
    c,
    nodes,
    app,
    run: (s) => vm.runInContext(s, c),
    advance(ms) {
      now += ms;
      for (const callback of [...timers.values()]) callback();
    },
    timers,
  };
}
const q = boot();
assert.equal(q.analytics.filter((e) => e.name === 'game-start').length, 1);
assert(q.run('images.length') >= 5);
assert(q.run('images.every(image => image.active !== false)'));
assert(
  q.run(
    'images.every(image => ["Cars", "Portrait"].includes(image.category.en))',
  ),
);
assert.equal(
  new Set(q.run('images.map(i=>i.id)')).size,
  q.run('images.length'),
);
let seen = new Set();
function finish(q) {
  while (q.run('state.active.index < state.active.ids.length')) {
    const id = q.run('state.active.ids[state.active.index]');
    assert(!seen.has(id), 'repeated ' + id);
    q.nodes['quiz-image'].onload();
    seen.add(id);
    q.run('answer(byId.get(state.active.ids[state.active.index]).real)');
  }
  assert(q.app.innerHTML.includes('5 / 5'));
}
finish(q);
assert.equal(q.analytics.filter((e) => e.name === 'answer').length, 5);
assert.equal(q.analytics.filter((e) => e.name === 'game-complete').length, 1);
assert.equal(q.analytics.at(-1).data.score, 5);
q.run('results(); route()');
assert.equal(q.analytics.filter((e) => e.name === 'game-complete').length, 1);
q.run('start()');
finish(q);
assert.equal(
  Object.keys(JSON.parse(store['real-or-ai-history-v1']).seen).length,
  10,
);
const fa = boot('fa');
assert(fa.app.innerHTML.includes('چندتاشو درست زدی؟'));
fa.run('start()');
for (let i = 0; i < 5; i++) {
  fa.nodes['quiz-image'].onload();
  fa.run('answer(false)');
}
const reload = boot();
assert.equal(
  reload.analytics.length,
  0,
  'Reloading results sends no game events',
);
assert.equal(reload.run('state.answers.length'), 15);
reload.run(
  'state.active=null; for(const i of images)state.seen[i.id]="seen";save();start()',
);
assert(reload.app.innerHTML.includes('every available'));
reload.run(
  'images.push({id:"new-image",real:false,src:"photos/0.jpg",category:{en:"New",fa:"تازه"}});byId.set("new-image",images.at(-1));start()',
);
assert.equal(reload.run('state.active.ids.length'), 1);
assert.equal(reload.run('state.active.ids[0]'), 'new-image');
reload.nodes['quiz-image'].onload();
reload.run('answer(false)');
assert(reload.app.innerHTML.includes('1 / 1'));
console.log(
  'PASS: unique catalog, 5-round scoring, no repeats, persistence, Persian shared history, exhaustion, new images, partial final test.',
);

// Exercise every allowed AI count without relying on statistical assertions.
for (const [random, expected] of [
  [0, 1],
  [0.5, 2],
  [0.999, 2],
]) {
  q.run(
    `state.seen = {}; state.active = null; Math.random = () => ${random}; start();`,
  );
  assert.equal(q.run('state.active.ids.length'), 5);
  assert.equal(
    q.run('state.active.ids.filter(id => !byId.get(id).real).length'),
    expected,
  );
  assert.equal(q.run('new Set(state.active.ids).size'), 5);
}
// Real photos must not start an AI-free test after the AI pool is exhausted.
q.run(
  'state.seen = {}; for (const image of images) if (!image.real) state.seen[image.id] = "seen"; state.active = null; start();',
);
assert.equal(q.run('state.active'), null);
assert(q.app.innerHTML.includes('No unseen AI images'));
// A failed AI image is replaced by another AI image, without marking it seen.
q.run(
  'state.seen = {}; state.active = null; Math.random = () => 0; start(); state.active.index = state.active.ids.findIndex(id => !byId.get(id).real); render();',
);
const failedId = q.run('state.active.ids[state.active.index]');
q.nodes['quiz-image'].onerror();
q.nodes.skip.onclick();
assert.equal(
  q.run('byId.get(state.active.ids[state.active.index]).real'),
  false,
);
assert.notEqual(q.run('state.active.ids[state.active.index]'), failedId);
assert(!q.run(`Object.hasOwn(state.seen, ${JSON.stringify(failedId)})`));
console.log(
  'PASS: randomized 1–2 AI images, shuffled unique rounds, AI exhaustion, and same-kind failed-image replacement.',
);

// If the only remaining AI cannot load, stop rather than offer a real-only test.
q.run(
  'unavailable.clear(); state.seen = {}; const keep = images.find(image => !image.real).id; for (const image of images) if (!image.real && image.id !== keep) state.seen[image.id] = "seen"; state.active = null; start(); state.active.index = state.active.ids.findIndex(id => !byId.get(id).real); render();',
);
q.nodes['quiz-image'].onerror();
q.nodes.skip.onclick();
assert.equal(q.run('state.active'), null);
assert(q.app.innerHTML.includes('No unseen AI images'));
console.log('PASS: an unavailable last AI never produces a real-only test.');

// Visiting Home never starts or consumes a round, including returning players.
const landing = boot('en', '');
assert(
  landing.app.innerHTML.includes('Start game') ||
    landing.app.innerHTML.includes('Continue game'),
);
assert(landing.app.innerHTML.includes('href="#play"'));
assert(!landing.app.innerHTML.includes('id="quiz-image"'));
for (const aiCount of [1, 2]) {
  q.run('state.seen = {}; unavailable.clear()');
  const round = q.run(
    `selectRound(images.filter(i => !i.real), images.filter(i => i.real), ${aiCount}, 5)`,
  );
  assert.equal(round.length, 5);
  assert.equal(new Set(round.map((i) => i.id)).size, 5);
  assert.equal(round.filter((i) => !i.real).length, aiCount);
  const pairs = new Set(
    round
      .filter(
        (i) =>
          !i.real &&
          round.some((j) => j.real && j.category.en === i.category.en),
      )
      .map((i) => i.category.en),
  );
  assert(pairs.size >= Math.min(2, aiCount, 5 - aiCount));
  if (aiCount === 2)
    assert.equal(new Set(round.map((i) => i.category.en)).size, 2);
}
console.log(
  'PASS: Home does not consume images; category pairs, wildcard, and AI balance.',
);

for (const key of Object.keys(store)) delete store[key];
const timed = boot();
assert.equal(timed.timers.size, 0, 'No countdown before the image loads');
assert.equal(
  Object.keys(timed.run('state.seen')).length,
  0,
  'Loading does not mark an image as seen',
);
assert.match(timed.app.innerHTML, /data-state="loading" aria-busy="true"/);
timed.nodes['quiz-image'].onload();
assert.equal(timed.nodes['image-frame'].dataset.state, 'ready');
assert.equal(timed.nodes['image-frame'].ariaBusy, 'false');
timed.advance(7999);
assert.equal(timed.run('state.active.index'), 0);
timed.advance(1);
assert.equal(timed.analytics.at(-1).name, 'answer');
assert.equal(timed.analytics.at(-1).data.choice, 'skipped');
assert.equal(timed.analytics.at(-1).data.timedOut, true);
assert.equal(timed.run('state.active.index'), 1);
assert.equal(timed.run('state.answers[0].timedOut'), true);
assert.equal(timed.run('state.answers[0].choice'), null);
assert.equal(
  timed.timers.size,
  0,
  'Next image must load before its timer starts',
);
timed.nodes['quiz-image'].onload();
timed.advance(2000);
timed.nodes['settings-open'].onclick();
timed.advance(12000);
assert.equal(timed.run('state.active.index'), 1, 'Settings pauses the clock');
timed.nodes['settings-dialog'].close();
timed.advance(5999);
assert.equal(timed.run('state.active.index'), 1);
timed.advance(1);
assert.equal(timed.run('state.active.index'), 2);
timed.nodes['quiz-image'].onload();
timed.nodes['timer-enabled'].onchange({ target: { checked: false } });
timed.advance(20000);
assert.equal(timed.run('state.active.index'), 2, 'Disabled timer cannot skip');
const untimed = boot('fa');
assert.equal(
  untimed.run('timerEnabled'),
  false,
  'Preference survives language changes',
);
untimed.nodes['quiz-image'].onload();
untimed.advance(20000);
assert.equal(untimed.run('state.active.index'), 2);
untimed.run('answer(true)');
assert.equal(untimed.timers.size, 0, 'Answer cancels its timer');
while (untimed.run('state.active.index < state.active.ids.length')) {
  untimed.nodes['quiz-image'].onload();
  untimed.run('answer(true)');
}
assert.equal(untimed.run('state.history.length'), 1);
assert.equal(untimed.run('state.history[0].total'), 5);
assert.equal(untimed.run('state.history[0].skipped'), 2);
assert.equal(untimed.run('state.history[0].answers.length'), 5);
assert.equal(untimed.run('historyAnswers(state.history[0]).length'), 5);
assert.equal(
  untimed.run('historyAnswers({ id: state.history[0].id }).length'),
  5,
  'Recover older game details from saved image IDs and answer records',
);
const historyReload = boot();
assert.equal(
  historyReload.run('state.history.length'),
  1,
  'Reload does not duplicate completed games',
);
historyReload.nodes['history-open'].onclick();
historyReload.nodes['history-open'].onclick();
assert.equal(
  historyReload.analytics.filter((e) => e.name === 'history-open').length,
  1,
);
assert(historyReload.nodes['history-dialog'].innerHTML.includes('Skipped: 2'));
assert(
  historyReload.nodes['history-dialog'].innerHTML.includes(
    'Review images and answers',
  ),
);
assert(
  historyReload.nodes['history-dialog'].innerHTML.includes('target="_blank"'),
);
assert(!historyReload.nodes['history-dialog'].innerHTML.includes('<details'));
const reviewPage = boot(
  'en',
  '#review=' + encodeURIComponent(historyReload.run('state.history[0].id')),
);
assert(reviewPage.run('app.innerHTML').includes('Your answer: Skipped'));
assert(reviewPage.run('app.innerHTML').includes('Correct answer:'));
assert.equal(reviewPage.timers.size, 0);
reviewPage.run('route()');
assert.equal(
  reviewPage.analytics.filter((e) => e.name === 'review-open').length,
  1,
);
historyReload.run(
  `state.history = Array.from({ length: 7 }, (_, index) => ({ ...state.history[0], id: 'page-test-' + index })); renderHistory()`,
);
assert.equal(
  (
    historyReload.nodes['history-dialog'].innerHTML.match(
      /class="history-row"/g,
    ) || []
  ).length,
  5,
);
assert(historyReload.nodes['history-dialog'].innerHTML.includes('page-test-6'));
historyReload.run('historyPage = 1; renderHistory()');
assert.equal(
  (
    historyReload.nodes['history-dialog'].innerHTML.match(
      /class="history-row"/g,
    ) || []
  ).length,
  2,
);
assert(
  !historyReload.nodes['history-dialog'].innerHTML.includes('page-test-6'),
);
assert(
  historyReload.nodes['history-dialog'].innerHTML.includes(
    'id="history-next" disabled',
  ),
);
historyReload.run('state = JSON.parse(localStorage.getItem(STORAGE_KEY))');
historyReload.nodes['history-dialog'].close();
historyReload.run('start()');
historyReload.nodes['quiz-image'].onload();
historyReload.nodes['timer-enabled'].onchange({ target: { checked: true } });
historyReload.run('beginTimer(); home()');
historyReload.advance(10000);
assert.equal(
  historyReload.run('state.active.index'),
  0,
  'Home cancels countdown',
);
assert.equal(historyReload.timers.size, 0);
console.log(
  'PASS: eight-second deadlines, loading, skips, dialog pause/resume, saved settings, history persistence, and timer cleanup.',
);
const aboutLink = boot('fa', '#about');
assert.equal(aboutLink.nodes['about-dialog'].open, true);
assert(aboutLink.app.innerHTML.includes('class="home"'));
assert.equal(aboutLink.timers.size, 0);
const historyLink = boot('en', '#history');
assert.equal(historyLink.nodes['history-dialog'].open, true);
assert.equal(historyLink.timers.size, 0);
console.log(
  'PASS: footer links from Sources open About and History without starting a game.',
);

for (const mode of ['missing', 'throws', 'rejects']) {
  for (const key of Object.keys(store)) delete store[key];
  const offline = boot('fa', '#play', mode);
  while (offline.run('state.active.index < state.active.ids.length')) {
    offline.nodes['quiz-image'].onload();
    offline.run('answer(true)');
  }
  assert.equal(offline.run('state.history.length'), 1);
  assert.equal(offline.run('state.history[0].total'), 5);
  offline.nodes['history-open'].onclick();
  assert.equal(offline.nodes['history-dialog'].open, true);
}
for (const key of Object.keys(store)) delete store[key];
const delayed = boot('fa', '#play', 'delayed');
assert.equal(delayed.analytics.length, 0);
delayed.c.window.umami = delayed.tracker;
delayed.trackerEvents.load();
delayed.trackerEvents.load();
assert.equal(delayed.analytics.length, 1, 'Deferred tracker flushes once');
assert.equal(delayed.analytics[0].name, 'game-start');
assert.equal(delayed.analytics[0].data.language, 'fa');
assert.equal(delayed.analytics[0].data.total, 5);
assert.equal(delayed.analytics[0].data.timer, true);
console.log(
  'PASS: analytics failure isolation, delayed loading, and event deduplication.',
);

const sourceNodes = {
  'source-warning': { hidden: false },
  'source-list': { hidden: true, focus() {} },
  'photo-credits': {
    childElementCount: 0,
    rows: [],
    append(row) {
      this.rows.push(row);
      this.childElementCount++;
    },
  },
  'show-sources': { addEventListener: (_, callback) => (reveal = callback) },
};
let reveal;
const sourceEvents = [];
const sourceContext = {
  URL,
  window: {
    QUIZ_IMAGES: [
      {
        real: true,
        src: 'photos/current.jpg',
        source: 'https://example.test/current',
        credit: 'Current photographer',
      },
      {
        real: true,
        active: false,
        src: 'photos/retired.jpg',
        source: 'https://example.test/retired',
        credit: 'Retired photographer',
      },
      { real: false, src: 'ai images/current.jpg', credit: 'OpenAI ImageGen' },
    ],
    QUIZ_ANALYTICS: { track: (name) => sourceEvents.push(name) },
  },
  document: {
    currentScript: { src: 'https://example.test/sources.js' },
    getElementById: (id) => sourceNodes[id],
    createElement: () => ({
      append(...children) {
        this.children = children;
      },
    }),
  },
};
vm.runInNewContext(fs.readFileSync('public/sources.js', 'utf8'), sourceContext);
assert.equal(sourceEvents.length, 0, 'No reveal event before consent');
reveal();
reveal();
assert.deepEqual(sourceEvents, ['sources-reveal']);
assert.equal(sourceNodes['source-list'].hidden, false);
assert.equal(
  sourceNodes['photo-credits'].rows.length,
  1,
  'Only current real photographs enter Sources',
);

// Retiring a catalog entry must preserve completed reviews and an in-progress game.
for (const key of Object.keys(store)) delete store[key];
const migration = boot();
migration.run(`
  const retired = window.QUIZ_IMAGES.find(image => image.active === false);
  const record = {id:retired.id,choice:retired.real,correct:true,timedOut:false,answeredAt:'2026-10-16T10:00:00.000Z'};
  state.seen[retired.id] = record.answeredAt;
  state.answers = [record];
  state.history = [{id:'saved-retired-game',correct:1,total:1,skipped:0,completedAt:record.answeredAt,answers:[record]}];
  state.active = {ids:[retired.id,images[0].id],index:1,answers:[record],startedAt:record.answeredAt};
  save();
`);
const migrated = boot('fa');
assert.equal(migrated.run('state.active.index'), 1);
assert.equal(migrated.run('state.active.answers.length'), 1);
assert.equal(migrated.run('historyAnswers(state.history[0]).length'), 1);
assert(migrated.run('byId.has(state.history[0].answers[0].id)'));
assert(
  migrated.run('Object.hasOwn(state.seen,state.history[0].answers[0].id)'),
);
migrated.run('state.active = null; start();');
assert(
  migrated.run('state.active.ids.every(id => byId.get(id).active !== false)'),
);
migrated.run(
  'state.seen = Object.fromEntries(images.filter(image => image.real).map(image => [image.id,"seen"])); state.active = null; start();',
);
assert.equal(migrated.run('state.active.ids.length'), 2);
assert(migrated.run('state.active.ids.every(id => !byId.get(id).real)'));
console.log(
  'PASS: retired-image reviews and in-progress answers survive; new and partial rounds never exceed two AI images.',
);
