'use strict';
const sourcesBase = new URL('.', document.currentScript.src);
const warning = document.getElementById('source-warning');
const sourceList = document.getElementById('source-list');
const credits = document.getElementById('photo-credits');
document.getElementById('show-sources').addEventListener('click', () => {
  if (!sourceList.hidden) return;
  // Do not reveal credits or load thumbnails until the visitor accepts the spoiler.
  if (!credits.childElementCount) {
    for (const image of window.QUIZ_IMAGES.filter((entry) => entry.real)) {
      const row = document.createElement('li');
      const thumbnail = document.createElement('img');
      thumbnail.src = new URL(image.src, sourcesBase).href;
      thumbnail.alt = '';
      thumbnail.width = 64;
      thumbnail.height = 48;
      thumbnail.loading = 'lazy';
      const link = document.createElement('a');
      link.href = image.source;
      link.textContent = image.credit;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      row.append(thumbnail, link);
      credits.append(row);
    }
  }
  warning.hidden = true;
  sourceList.hidden = false;
  window.QUIZ_ANALYTICS?.track('sources-reveal');
  sourceList.tabIndex = -1;
  sourceList.focus();
});
