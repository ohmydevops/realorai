'use strict';
const language = document.documentElement.lang === 'fa' ? 'fa' : 'en';
const baseURL = new URL('.', document.currentScript.src);
const images = window.QUIZ_IMAGES;
const byId = new Map(images.map((i) => [i.id, i]));
const app = document.getElementById('app');
const STORAGE_KEY = 'real-or-ai-history-v1';
const copy = window.QUIZ_TRANSLATIONS[language];
const number = (n) =>
  new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(n);
const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const src = (image) => new URL(image.src, baseURL).href;
let state = { version: 1, seen: {}, answers: [], active: null };
let storageOK = true;
let loaded = false;
let renderToken = 0;
const unavailable = new Set();
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (
      parsed.version === 1 &&
      parsed.seen &&
      typeof parsed.seen === 'object' &&
      !Array.isArray(parsed.seen) &&
      Array.isArray(parsed.answers)
    ) {
      state = parsed;
      if (
        state.active &&
        (!Array.isArray(state.active.ids) ||
          !Number.isInteger(state.active.index) ||
          !Array.isArray(state.active.answers) ||
          state.active.index < 0 ||
          state.active.index > state.active.ids.length)
      )
        state.active = null;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
} catch {
  storageOK = false;
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    storageOK = false;
    storageError();
    return false;
  }
}
function storageError() {
  app.innerHTML = `<p role="alert">${copy.storage}</p>`;
}
function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function unseen() {
  return images.filter(
    (i) => !Object.hasOwn(state.seen, i.id) && !unavailable.has(i.id),
  );
}
// Prefer two mixed real/AI category pairs and a third-category wildcard.
// Keep the 1–3 AI balance and unseen-only rule when categories run short.
function selectRound(ai, real, aiCount, roundSize) {
  const selected = [];
  let aiLeft = aiCount;
  let realLeft = roundSize - aiCount;
  const paired = new Set();
  const category = (image) => image.category.en;
  const pairCategories = shuffle([...new Set(ai.map(category))]).filter((key) =>
    real.some((image) => category(image) === key),
  );
  for (const key of pairCategories) {
    if (paired.size === 2 || !aiLeft || !realLeft) break;
    selected.push(
      ai.find((image) => category(image) === key),
      real.find((image) => category(image) === key),
    );
    paired.add(key);
    aiLeft--;
    realLeft--;
  }
  const fill = (pool, count) => {
    for (let n = 0; n < count; n++) {
      const available = pool.filter((image) => !selected.includes(image));
      const usedCategories = new Set(selected.map(category));
      const next =
        available.find((image) => !usedCategories.has(category(image))) ||
        available[0];
      if (next) selected.push(next);
    }
  };
  fill(ai, aiLeft);
  fill(real, realLeft);
  return selected;
}
function home() {
  renderToken++;
  loaded = false;
  app.innerHTML = `<section class="home"><p>${copy.homeIntro}</p><a class="start-game" href="#play">${copy.start}</a></section>`;
}
function route() {
  if (window.location.hash !== '#play') return home();
  if (!storageOK) return storageError();
  if (state.active) render();
  else start();
}
function start() {
  if (!storageOK) return storageError();
  const pool = unseen();
  if (!pool.length) {
    state.active = null;
    save();
    return exhausted();
  }
  const ai = shuffle(pool.filter((image) => !image.real));
  const real = shuffle(pool.filter((image) => image.real));
  if (!ai.length) {
    state.active = null;
    if (save()) exhausted();
    return;
  }
  const roundSize = Math.min(5, real.length + Math.min(3, ai.length));
  const minimumAI = Math.max(1, roundSize - real.length);
  const maximumAI = Math.min(3, ai.length, roundSize);
  const aiCount =
    minimumAI + Math.floor(Math.random() * (maximumAI - minimumAI + 1));
  const selected = selectRound(ai, real, aiCount, roundSize);
  state.active = {
    ids: shuffle(selected).map((i) => i.id),
    index: 0,
    answers: [],
    startedAt: new Date().toISOString(),
  };
  if (save()) render();
}
function canStartTest() {
  return unseen().some((image) => !image.real);
}
function exhausted() {
  app.innerHTML = `<section><h2>${unseen().length ? copy.noAI : copy.done}</h2><p>${copy.later}</p></section>`;
}
function render() {
  if (!storageOK) return storageError();
  const test = state.active;
  if (!test) return start();
  if (test.index >= test.ids.length) return results();
  const image = byId.get(test.ids[test.index]);
  if (!image) {
    test.ids.splice(test.index, 1);
    if (save()) render();
    return;
  }
  loaded = false;
  const token = ++renderToken;
  app.innerHTML = `<section class="quiz" aria-label="${copy.round}">
    <div class="meta">${copy.round} ${number(test.index + 1)} ${copy.of} ${number(test.ids.length)}</div>
    <div class="image"><img id="quiz-image" alt="${language === 'fa' ? 'تصویر آزمون' : 'Quiz image'} ${number(test.index + 1)}" width="1000" height="750"><p id="image-status" role="status">${copy.loading}</p><div id="load-actions"></div></div>

    <div class="buttons"><button id="real" disabled>${copy.real}</button><button id="ai" disabled>${copy.ai}</button></div>
  </section>`;
  const img = document.getElementById('quiz-image');
  img.onload = () => {
    if (token !== renderToken) return;
    state.seen[image.id] ??= new Date().toISOString();
    if (!save()) return;
    loaded = true;
    document.getElementById('image-status').hidden = true;
    document.getElementById('real').disabled = false;
    document.getElementById('ai').disabled = false;
  };
  img.onerror = () => {
    if (token !== renderToken) return;
    document.getElementById('image-status').textContent = copy.failed;
    document.getElementById('load-actions').innerHTML =
      `<button id="retry">${copy.retry}</button><button id="skip">${copy.skip}</button>`;
    document.getElementById('retry').onclick = render;
    document.getElementById('skip').onclick = () => {
      unavailable.add(image.id);
      const used = new Set(test.ids);
      const replacements = shuffle(
        unseen().filter((i) => !used.has(i.id) && i.real === image.real),
      );
      const replacement =
        replacements.find((i) => i.category.en === image.category.en) ||
        replacements[0];
      if (replacement) test.ids[test.index] = replacement.id;
      else if (
        !image.real &&
        !test.ids.some((id) => id !== image.id && !byId.get(id)?.real)
      ) {
        state.active = null;
        if (save()) exhausted();
        return;
      } else test.ids.splice(test.index, 1);
      if (save()) render();
    };
  };
  document.getElementById('real').onclick = () => answer(true);
  document.getElementById('ai').onclick = () => answer(false);
  img.src = src(image);
}
function answer(value) {
  if (!loaded || !storageOK) return;
  loaded = false;
  const test = state.active;
  const image = byId.get(test.ids[test.index]);
  const record = {
    id: image.id,
    choice: value,
    correct: value === image.real,
    answeredAt: new Date().toISOString(),
  };
  test.answers.push(record);
  state.answers.push(record);
  test.index++;
  if (save()) render();
}
function results() {
  const test = state.active;
  const answers = test.answers.filter((a) => byId.has(a.id));
  const correct = answers.filter((a) => a.correct).length;
  app.innerHTML = `<section class="review">
    <h2>${copy.results}</h2>
    <p class="score"><bdi>${number(correct)} / ${number(answers.length)}</bdi></p>
    ${answers.length ? '' : `<p>${copy.skiptest}</p>`}
    <ol class="results">${answers
      .map((answer, index) => {
        const image = byId.get(answer.id);
        const credit = image.source
          ? `<a class="result-photo" href="${escapeHTML(image.source)}" target="_blank" rel="noopener noreferrer" aria-label="${copy.credit}: ${escapeHTML(image.credit)}" title="${escapeHTML(image.credit)}"><img src="${src(image)}" width="48" height="40" alt="${copy.round} ${number(index + 1)}"></a>`
          : `<img src="${src(image)}" width="48" height="40" alt="${copy.round} ${number(index + 1)}" title="${copy.generated}">`;
        return `<li>${credit}<span class="result-number">${number(index + 1)}</span><strong>${answer.correct ? '✓' : '×'} ${answer.correct ? copy.correct : copy.wrong}</strong><span class="result-answer">${image.real ? copy.answerReal : copy.answerAI}</span></li>`;
      })
      .join('')}</ol>
    ${canStartTest() ? `<button id="next">${copy.next}</button>` : `<p class="finished">${unseen().length ? copy.noAI : copy.done}</p>`}
  </section>`;
  const next = document.getElementById('next');
  if (next) next.onclick = start;
}
// Stable IDs preserve history when this catalog grows. Never automatically clear seen IDs.
window.addEventListener('hashchange', route);
route();
