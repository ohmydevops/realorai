const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const source = fs.readFileSync('public/app.js', 'utf8');
const store = {};
function boot(lang = 'en', hash = '#play') {
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
    window: { location: { hash }, addEventListener() {} },
    document: {
      documentElement: { lang },
      currentScript: { src: 'https://example.test/app.js' },
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
  vm.runInContext(source, c);
  return {
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
assert(q.run('images.length') >= 100);
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
  [0.999, 3],
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
  'PASS: randomized 1–3 AI images, shuffled unique rounds, AI exhaustion, and same-kind failed-image replacement.',
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
for (const aiCount of [1, 2, 3]) {
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
    assert.equal(new Set(round.map((i) => i.category.en)).size, 3);
}
console.log(
  'PASS: Home does not consume images; category pairs, wildcard, and AI balance.',
);

for (const key of Object.keys(store)) delete store[key];
const timed = boot();
assert.equal(timed.timers.size, 0, 'No countdown before the image loads');
timed.nodes['quiz-image'].onload();
timed.advance(7999);
assert.equal(timed.run('state.active.index'), 0);
timed.advance(1);
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
const historyReload = boot();
assert.equal(
  historyReload.run('state.history.length'),
  1,
  'Reload does not duplicate completed games',
);
historyReload.nodes['history-open'].onclick();
assert(historyReload.nodes['history-dialog'].innerHTML.includes('Skipped: 2'));
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
