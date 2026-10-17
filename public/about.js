'use strict';
const aboutDialog = document.getElementById('about-dialog');
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
