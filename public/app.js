'use strict';
const language = Object.hasOwn(
  window.QUIZ_TRANSLATIONS,
  document.documentElement.lang,
)
  ? document.documentElement.lang
  : 'en';
const languagePath = language === 'fa' ? '' : language + '/';
const baseURL = new URL('.', document.currentScript.src);
const images = window.QUIZ_IMAGES.filter((image) => image.active !== false);
const byId = new Map(window.QUIZ_IMAGES.map((image) => [image.id, image]));
const app = document.getElementById('app');
const STORAGE_KEY = 'real-or-ai-images-v2';
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
let state = { version: 2, history: [], current: null };
let storageOK = true;
let loaded = false;
let renderToken = 0;
let historyPage = 0;
let historyPageSize = 12;
const unavailable = new Set();
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (
      parsed.version === 2 &&
      Array.isArray(parsed.history) &&
      parsed.history.every(
        (record) =>
          typeof record.id === 'string' &&
          typeof record.choice === 'boolean' &&
          typeof record.real === 'boolean' &&
          typeof record.answeredAt === 'string',
      ) &&
      (parsed.current === null || typeof parsed.current === 'string')
    )
      state = parsed;
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
  app.innerHTML = '<p role="alert">' + copy.storage + '</p>';
}
function unseen() {
  const seen = new Set(state.history.map((record) => record.id));
  return images.filter(
    (image) => !seen.has(image.id) && !unavailable.has(image.id),
  );
}
function currentRecord() {
  return state.history.find((record) => record.id === state.current);
}
function home() {
  renderToken++;
  loaded = false;
  app.innerHTML =
    '<section class="home"><img class="home-art" src="' +
    new URL('assets/home-process.webp', baseURL).href +
    '" width="1600" height="800" fetchpriority="high" alt="' +
    copy.homeAlt +
    '"><p>' +
    copy.homeIntro +
    '<small class="home-count">' +
    copy.homeCount.replace(
      '{count}',
      '<span id="home-count-number">' + number(images.length) + '</span>',
    ) +
    '</small></p>' +
    (state.current || unseen().length
      ? '<a class="start-game" href="' +
        new URL(languagePath + 'play/', baseURL).href +
        '">' +
        copy.start +
        '</a>'
      : '<p class="finished">' + copy.later + '</p>') +
    '</section>';
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
    const progress = Math.min((time - startTime) / 1800, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = number(Math.round(images.length * eased));
    if (progress < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}

function renderHistory(measure = true) {
  renderToken++;
  loaded = false;
  app.classList.add('history-index');
  const pages = Math.max(1, Math.ceil(state.history.length / historyPageSize));
  historyPage = Math.max(0, Math.min(historyPage, pages - 1));
  const entries = [...state.history]
    .reverse()
    .slice(historyPage * historyPageSize, (historyPage + 1) * historyPageSize);
  app.innerHTML =
    '<h2>' +
    copy.history +
    '</h2>' +
    (entries.length
      ? '<ol class="history-review">' +
        entries
          .map((record) => {
            const image = byId.get(record.id);
            const date = new Date(record.answeredAt);
            const label = Number.isNaN(date.getTime())
              ? ''
              : new Intl.DateTimeFormat(language, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(date);
            return (
              '<li>' +
              (image
                ? '<button class="history-thumbnail" data-image-id="' +
                  escapeHTML(image.id) +
                  '" aria-label="' +
                  copy.enlarge +
                  '"><img src="' +
                  escapeHTML(src(image)) +
                  '" loading="lazy" alt="' +
                  copy.quizImage +
                  '"></button>'
                : '<p>' + copy.failed + '</p>') +
              '<div><time datetime="' +
              escapeHTML(record.answeredAt) +
              '">' +
              escapeHTML(label) +
              '</time><strong>' +
              (record.choice === record.real
                ? '✓ ' + copy.correct
                : '× ' + copy.wrong) +
              '</strong><p>' +
              copy.yourAnswer +
              ': ' +
              (record.choice ? copy.answerReal : copy.answerAI) +
              '</p><p>' +
              copy.rightAnswer +
              ': ' +
              (record.real ? copy.answerReal : copy.answerAI) +
              '</p></div></li>'
            );
          })
          .join('') +
        '</ol>'
      : '<p>' + copy.noHistory + '</p>') +
    (pages > 1
      ? '<nav class="history-pagination" aria-label="' +
        copy.history +
        '"><button id="history-prev" ' +
        (historyPage === 0 ? 'disabled' : '') +
        '>' +
        copy.previousPage +
        '</button><span><bdi>' +
        number(historyPage + 1) +
        ' / ' +
        number(pages) +
        '</bdi></span><button id="history-next" ' +
        (historyPage === pages - 1 ? 'disabled' : '') +
        '>' +
        copy.nextPage +
        '</button></nav>'
      : '');
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
  if (measure && entries.length) {
    const list = app.querySelector('.history-review');
    const rowHeight = Math.max(
      ...[...list.children].map((row) => row.getBoundingClientRect().height),
    );
    const available =
      app.getBoundingClientRect().bottom -
      list.getBoundingClientRect().top -
      68;
    const size = Math.max(2, Math.floor((available + 8) / (rowHeight + 8)) * 2);
    if (size !== historyPageSize) {
      historyPage = Math.floor((historyPage * historyPageSize) / size);
      historyPageSize = size;
      return renderHistory(false);
    }
  }
  for (const thumbnail of app.querySelectorAll('.history-thumbnail')) {
    thumbnail.onclick = () =>
      openHistoryImage(thumbnail.dataset.imageId, thumbnail);
  }
  app.scrollTop = 0;
}
function openHistoryImage(id, trigger) {
  const image = byId.get(id);
  if (!image) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'history-image-modal';
  dialog.setAttribute('aria-label', copy.enlarge);
  dialog.innerHTML =
    '<button class="control modal-close" aria-label="' +
    copy.close +
    '">×</button><img src="' +
    escapeHTML(src(image)) +
    '" alt="' +
    copy.quizImage +
    '">';
  document.body.append(dialog);
  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener(
    'close',
    () => {
      dialog.remove();
      trigger.focus();
    },
    { once: true },
  );
  dialog.showModal();
}
window.addEventListener('resize', () => {
  if (window.location.pathname.endsWith('/history/')) renderHistory();
});
function route() {
  if (!storageOK) return storageError();
  if (window.location.pathname.endsWith('/history/')) return renderHistory();
  if (!window.location.pathname.endsWith('/play/')) return home();
  if (state.current) render();
  else start();
}
function start() {
  if (!storageOK) return storageError();
  const pool = unseen();
  const previous =
    byId.get(state.current) || byId.get(state.history.at(-1)?.id);
  const category = previous?.category.en === 'Cars' ? 'Portrait' : 'Cars';
  const matching = pool.filter((image) => image.category.en === category);
  const candidates = matching.length ? matching : pool;
  state.current = candidates.length
    ? candidates[Math.floor(Math.random() * candidates.length)].id
    : null;
  if (!save()) return;
  if (!state.current) return exhausted();
  window.QUIZ_ANALYTICS?.track('image-start');
  render();
}
function exhausted() {
  renderToken++;
  loaded = false;
  app.innerHTML =
    '<section class="empty-game"><h2>' +
    (images.some(
      (image) => !state.history.some((record) => record.id === image.id),
    )
      ? copy.failed
      : copy.done) +
    '</h2><p>' +
    copy.later +
    '</p></section>';
}
function answerControls(record) {
  return record
    ? '<div class="answer-feedback" role="status" tabindex="-1" id="answer-feedback"><strong>' +
        (record.choice === record.real
          ? '✓ ' + copy.correct
          : '× ' + copy.wrong) +
        '</strong><p>' +
        copy.yourAnswer +
        ': ' +
        (record.choice ? copy.answerReal : copy.answerAI) +
        ' · ' +
        copy.rightAnswer +
        ': ' +
        (record.real ? copy.answerReal : copy.answerAI) +
        '</p></div><button id="next">' +
        copy.next +
        '</button>'
    : '<div class="buttons"><button id="real" disabled>' +
        copy.real +
        '</button><button id="ai" disabled>' +
        copy.ai +
        '</button></div>';
}
function render() {
  if (!storageOK) return storageError();
  const image = byId.get(state.current);
  const record = currentRecord();
  if (!image || (image.active === false && !record)) return start();
  loaded = false;
  const token = ++renderToken;
  const position = state.history.length + (record ? 0 : 1);
  app.innerHTML =
    '<section class="quiz" aria-label="' +
    copy.image +
    '"><figure class="image"><div id="image-frame" class="image-frame" data-state="loading" aria-busy="true"><img id="quiz-image" alt="' +
    copy.quizImage +
    ' ' +
    number(position) +
    '" width="1000" height="750"><div class="image-skeleton" aria-hidden="true"></div><p id="image-status" role="status">' +
    copy.loading +
    '</p><div id="load-actions"></div></div><figcaption>' +
    copy.image +
    ' ' +
    number(position) +
    '</figcaption></figure><div id="answer-panel" class="answer-panel">' +
    answerControls(record) +
    '</div></section>';
  const img = document.getElementById('quiz-image');
  img.onload = () => {
    if (token !== renderToken) return;
    loaded = true;
    document.getElementById('image-frame').dataset.state = 'ready';
    document.getElementById('image-frame').ariaBusy = 'false';
    document.getElementById('image-status').hidden = true;
    if (!currentRecord()) {
      document.getElementById('real').disabled = false;
      document.getElementById('ai').disabled = false;
    }
  };
  img.onerror = () => {
    if (token !== renderToken) return;
    loaded = false;
    document.getElementById('image-frame').dataset.state = 'error';
    document.getElementById('image-frame').ariaBusy = 'false';
    document.getElementById('image-status').textContent = copy.failed;
    document.getElementById('load-actions').innerHTML =
      '<button id="retry">' +
      copy.retry +
      '</button>' +
      (record ? '' : '<button id="skip">' + copy.skip + '</button>');
    document.getElementById('retry').onclick = render;
    if (!record)
      document.getElementById('skip').onclick = () => {
        unavailable.add(image.id);
        start();
      };
  };
  if (record) document.getElementById('next').onclick = start;
  else {
    document.getElementById('real').onclick = () => answer(true);
    document.getElementById('ai').onclick = () => answer(false);
  }
  img.src = src(image);
}
function answer(choice) {
  if (!loaded || !storageOK || typeof choice !== 'boolean' || currentRecord())
    return;
  loaded = false;
  const image = byId.get(state.current);
  state.history.push({
    id: image.id,
    choice,
    real: image.real,
    answeredAt: new Date().toISOString(),
  });
  if (!save()) return;
  window.QUIZ_ANALYTICS?.track('answer', {
    choice: choice ? 'real' : 'ai',
    correct: choice === image.real,
  });
  document.getElementById('answer-panel').innerHTML =
    answerControls(currentRecord());
  document.getElementById('next').onclick = start;
  document.getElementById('answer-feedback').focus();
}
route();
