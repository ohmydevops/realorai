'use strict';
const aboutDialog = document.getElementById('about-dialog');
const installButton = document.getElementById('install-app');
let installPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  const prompt = installPrompt;
  installPrompt = null;
  installButton.hidden = true;
  await prompt.prompt();
});
document.getElementById('about-open').addEventListener('click', () => {
  aboutDialog.showModal();
});
aboutDialog.addEventListener('click', (event) => {
  if (event.target !== aboutDialog) return;
  const bounds = aboutDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  ) {
    aboutDialog.close();
  }
});
