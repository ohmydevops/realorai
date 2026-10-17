'use strict';
// Apply the saved theme before the stylesheet renders to avoid a theme flash.
const THEME_KEY = 'real-or-ai-theme';
let theme = 'light';
try {
  if (localStorage.getItem(THEME_KEY) === 'dark') theme = 'dark';
} catch {
  // Theme switching still works for this visit if storage is unavailable.
}
document.documentElement.dataset.theme = theme;
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  function updateToggle() {
    const symbol =
      theme === 'dark'
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
        : '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>';
    toggle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${symbol}</svg>`;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage is optional for appearance preferences.
    }
    updateToggle();
  });
  updateToggle();
  for (const link of document.querySelectorAll('.footer-links a')) {
    const url = new URL(link.href, location.href);
    if (!url.hash && url.pathname === location.pathname)
      link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
});
