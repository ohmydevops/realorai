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
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
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
});
