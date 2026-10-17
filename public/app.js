'use strict';
const language = Object.hasOwn(
  window.QUIZ_TRANSLATIONS,
  document.documentElement.lang,
)
  ? document.documentElement.lang
  : 'en';
const languagePath = language === 'fa' ? '' : `${language}/`;
const baseURL = new URL('.', document.currentScript.src);
const images = window.QUIZ_IMAGES.filter((image) => image.active !== false);
const byId = new Map(window.QUIZ_IMAGES.map((i) => [i.id, i]));
const app = document.getElementById('app');
const STORAGE_KEY = 'real-or-ai-history-v1';
const copy = window.QUIZ_TRANSLATIONS[language];
const number = (n) => new Intl.NumberFormat(language).format(n);
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
if (!Array.isArray(state.history)) {
  state.history = [];
  const currentIDs = new Set(
    state.active?.answers.map((answer) => answer.id) || [],
  );
  const earlier = state.answers.filter((answer) => !currentIDs.has(answer.id));
  if (earlier.length)
    state.history.push({
      id: 'legacy',
      legacy: true,
      correct: earlier.filter((answer) => answer.correct).length,
      total: earlier.length,
      skipped: earlier.filter((answer) => answer.timedOut).length,
      completedAt: earlier.at(-1).answeredAt,
    });
  if (storageOK) save();
}
const historyContainer = app;
function historyAnswers(entry) {
  if (Array.isArray(entry.answers)) return entry.answers;
  if (entry.legacy) {
    const activeIDs = new Set(state.active?.ids || []);
    return state.answers.filter((answer) => !activeIDs.has(answer.id));
  }
  const ids = entry.id?.split(':').at(-1)?.split(',') || [];
  return ids
    .map((id) => state.answers.find((answer) => answer.id === id))
    .filter(Boolean);
}
function historyReview(entry) {
  const answers = historyAnswers(entry);
  if (!answers.length) return `<small>${copy.reviewUnavailable}</small>`;
  return `<ol class="history-review">${answers
    .map((answer, index) => {
      const image = byId.get(answer.id);
      if (!image)
        return `<li>${copy.round} ${number(index + 1)}: ${copy.failed}</li>`;
      const choice =
        answer.timedOut || answer.choice === null
          ? copy.timedOut
          : answer.choice === true
            ? copy.answerReal
            : answer.choice === false
              ? copy.answerAI
              : answer.correct
                ? image.real
                  ? copy.answerReal
                  : copy.answerAI
                : image.real
                  ? copy.answerAI
                  : copy.answerReal;
      return `<li><a href="${escapeHTML(src(image))}" target="_blank" rel="noopener noreferrer"><img src="${escapeHTML(src(image))}" loading="lazy" alt="${copy.round} ${number(index + 1)}"></a><div><strong>${copy.round} ${number(index + 1)}</strong><p>${copy.yourAnswer}: ${choice}</p><p>${copy.rightAnswer}: ${image.real ? copy.answerReal : copy.answerAI}</p><p>${answer.timedOut ? copy.timedOut : answer.correct ? copy.correct : copy.wrong}</p></div></li>`;
    })
    .join('')}</ol>`;
}
let historyPage = 0;
function renderHistory() {
  const pages = Math.max(1, Math.ceil(state.history.length / 5));
  historyPage = Math.max(0, Math.min(historyPage, pages - 1));
  historyContainer.innerHTML = `<h2 id="history-title">${copy.history}</h2>${
    state.history.length
      ? `<ol class="history-list">${[...state.history]
          .reverse()
          .slice(historyPage * 5, historyPage * 5 + 5)
          .map((entry) => {
            const date = new Date(entry.completedAt);
            const label = entry.legacy
              ? copy.previousAnswers
              : Number.isNaN(date.getTime())
                ? ''
                : new Intl.DateTimeFormat(language, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(date);
            return `<li><div class="history-row"><span>${escapeHTML(label)}</span><strong><bdi>${number(entry.correct)} / ${number(entry.total)}</bdi></strong><small>${copy.skipped}: ${number(entry.skipped || 0)}</small></div><a class="history-review-link" href="${new URL(languagePath || './', baseURL).href}#review=${encodeURIComponent(entry.id)}" target="_blank" rel="noopener noreferrer">${copy.reviewGame}</a></li>`;
          })
          .join('')}</ol>`
      : `<p>${copy.noHistory}</p>`
  }${pages > 1 ? `<nav class="history-pagination" aria-label="${copy.history}"><button id="history-prev" ${historyPage === 0 ? 'disabled' : ''}>${copy.previousPage}</button><span><bdi>${number(historyPage + 1)} / ${number(pages)}</bdi></span><button id="history-next" ${historyPage === pages - 1 ? 'disabled' : ''}>${copy.nextPage}</button></nav>` : ''}`;
  if (pages > 1) {
    document.getElementById('history-prev').onclick = () => {
      historyPage--;
      renderHistory();
      document.getElementById('history-prev').focus();
    };
    document.getElementById('history-next').onclick = () => {
      historyPage++;
      renderHistory();
      document.getElementById('history-next').focus();
    };
  }
  historyContainer.scrollTop = 0;
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
// Prefer mixed real/AI pairs across cars and portraits, then fill unseen slots.
// Keep the 1–2 AI limit and unseen-only rule when categories run short.
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
  app.innerHTML = `<section class="home"><img class="home-art" src="${new URL('assets/home-process.webp', baseURL).href}" width="1600" height="800" fetchpriority="high" alt="${copy.homeAlt}"><p>${copy.homeIntro}<small class="home-count" aria-live="off">${copy.homeCount.replace('{count}', `<span id="home-count-number">${number(images.length)}</span>`)}</small><small class="home-rounds">${copy.homeRounds}</small></p>${(state.active && state.active.index < state.active.ids.length) || canStartTest() ? `<a class="start-game" href="#play">${copy.start}</a>` : `<p class="finished">${copy.later}</p>`}</section>`;
  animateHomeCount();
}
function animateHomeCount() {
  if (
    typeof window.requestAnimationFrame !== 'function' ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
    return;
  const counter = document.getElementById('home-count-number');
  if (!counter) return;
  const token = renderToken;
  counter.textContent = number(0);
  let startTime;
  function tick(time) {
    if (token !== renderToken) return;
    startTime ??= time;
    const progress = Math.min((time - startTime) / 1100, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = number(Math.round(images.length * eased));
    if (progress < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}
let lastReviewHash = null;
function route() {
  if (
    window.location.hash === '#about' ||
    window.location.hash === '#history'
  ) {
    const page = window.location.hash.slice(1);
    window.location.replace(new URL(languagePath + page + '/', baseURL).href);
    return;
  }
  if (window.location.pathname?.endsWith('/history/')) {
    renderHistory();
    return;
  }
  if (window.location.hash.startsWith('#review=')) {
    renderToken++;
    loaded = false;
    const entry = state.history.find(
      (item) =>
        `#review=${encodeURIComponent(item.id)}` === window.location.hash,
    );
    app.innerHTML = `<section class="history-page"><h2>${copy.reviewGame}</h2>${entry ? `<p class="score"><bdi>${number(entry.correct)} / ${number(entry.total)}</bdi></p>${historyReview(entry)}` : `<p>${copy.reviewUnavailable}</p>`}</section>`;
    if (entry && lastReviewHash !== window.location.hash)
      window.QUIZ_ANALYTICS?.track('review-open');
    lastReviewHash = window.location.hash;
    return;
  }
  lastReviewHash = null;
  if (window.location.hash !== '#play') {
    home();
    return;
  }
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
  const roundSize = Math.min(5, real.length + Math.min(2, ai.length));
  const minimumAI = Math.max(1, roundSize - real.length);
  const maximumAI = Math.min(2, ai.length, roundSize);
  const aiCount =
    minimumAI + Math.floor(Math.random() * (maximumAI - minimumAI + 1));
  const selected = selectRound(ai, real, aiCount, roundSize);
  state.active = {
    ids: shuffle(selected).map((i) => i.id),
    index: 0,
    answers: [],
    startedAt: new Date().toISOString(),
  };
  if (save()) {
    window.QUIZ_ANALYTICS?.track('game-start', {
      total: selected.length,
    });
    render();
  }
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
    <figure class="image"><div id="image-frame" class="image-frame" data-state="loading" aria-busy="true"><img id="quiz-image" alt="${copy.quizImage} ${number(test.index + 1)}" width="1000" height="750"><div class="image-skeleton" aria-hidden="true"></div><p id="image-status" role="status">${copy.loading}</p><div id="load-actions"></div></div><figcaption>${copy.round} ${number(test.index + 1)} ${copy.of} ${number(test.ids.length)}</figcaption></figure>

    <div class="buttons"><button id="real" disabled>${copy.real}</button><button id="ai" disabled>${copy.ai}</button></div>
  </section>`;
  const img = document.getElementById('quiz-image');
  img.onload = () => {
    if (token !== renderToken || loaded) return;
    state.seen[image.id] ??= new Date().toISOString();
    if (!save()) return;
    loaded = true;
    document.getElementById('image-frame').dataset.state = 'ready';
    document.getElementById('image-frame').ariaBusy = 'false';
    document.getElementById('image-status').hidden = true;
    document.getElementById('real').disabled = false;
    document.getElementById('ai').disabled = false;
  };
  img.onerror = () => {
    if (token !== renderToken) return;

    loaded = false;
    document.getElementById('image-frame').dataset.state = 'error';
    document.getElementById('image-frame').ariaBusy = 'false';
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
    timedOut: value === null,
    answeredAt: new Date().toISOString(),
  };
  test.answers.push(record);
  state.answers.push(record);
  test.index++;
  if (save()) {
    window.QUIZ_ANALYTICS?.track('answer', {
      choice: value === null ? 'skipped' : value ? 'real' : 'ai',
      correct: record.correct,
      timedOut: record.timedOut,
      position: test.index,
    });
    render();
  }
}
function results() {
  const test = state.active;
  const answers = test.answers.filter((a) => byId.has(a.id));
  const correct = answers.filter((a) => a.correct).length;
  const historyID = `${test.startedAt}:${test.ids.join(',')}`;
  if (
    answers.length &&
    !state.history.some((entry) => entry.id === historyID)
  ) {
    state.history.push({
      id: historyID,
      correct,
      total: answers.length,
      skipped: answers.filter((answer) => answer.timedOut).length,
      completedAt: new Date().toISOString(),
      answers: test.answers.map((answer) => ({ ...answer })),
    });
    if (!save()) return;
    window.QUIZ_ANALYTICS?.track('game-complete', {
      score: correct,
      total: answers.length,
      skipped: answers.filter((answer) => answer.timedOut).length,
    });
  }
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
        return `<li>${credit}<span class="result-number">${number(index + 1)}</span><strong>${answer.timedOut ? '—' : answer.correct ? '✓' : '×'} ${answer.timedOut ? copy.timedOut : answer.correct ? copy.correct : copy.wrong}</strong><span class="result-answer">${image.real ? copy.answerReal : copy.answerAI}</span></li>`;
      })
      .join('')}</ol>
    <div id="share-options" hidden></div>
    <div class="result-actions">
      ${canStartTest() ? `<button id="next">${copy.next}</button>` : `<p class="finished">${copy.later}</p>`}
      <button id="share-result" type="button">${copy.share}</button>
    </div>
  </section>`;
  document.getElementById('share-result').onclick = async () => {
    const url = new URL(languagePath || './', baseURL).href;
    const text = copy.shareText
      .replace('{score}', number(correct))
      .replace('{total}', number(answers.length));
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Real or AI?',
          text: text + '\n\n' + url,
        });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    const options = document.getElementById('share-options');
    options.hidden = false;
    options.replaceChildren();
    for (const [label, href] of [
      [
        'WhatsApp',
        'https://wa.me/?text=' + encodeURIComponent(text + '\n\n' + url),
      ],
      [
        'Telegram',
        'https://t.me/share/url?url=' +
          encodeURIComponent(url) +
          '&text=' +
          encodeURIComponent(text),
      ],
      [
        'X',
        'https://twitter.com/intent/tweet?text=' +
          encodeURIComponent(text) +
          '&url=' +
          encodeURIComponent(url),
      ],
      [
        'Facebook',
        'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(url),
      ],
    ]) {
      const link = document.createElement('a');
      link.textContent = label;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      options.append(link);
    }
    const field = document.createElement('input');
    field.readOnly = true;
    field.value = text + ' ' + url;
    field.setAttribute('aria-label', copy.copyShare);
    field.onclick = () => field.select();
    options.append(field);
    options.querySelector('a').focus();
  };
  const next = document.getElementById('next');
  if (next) next.onclick = start;
}
// Stable IDs preserve history when this catalog grows. Never automatically clear seen IDs.
window.addEventListener('hashchange', route);
route();
