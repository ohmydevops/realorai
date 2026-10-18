document.querySelectorAll('[data-copy-prompt]').forEach((button) => {
  button.addEventListener('click', async () => {
    const prompt = document.getElementById('article-prompt');
    const status = document.querySelector('[data-copy-status]');
    try {
      await navigator.clipboard.writeText(prompt.textContent.trim());
      status.textContent = button.dataset.copied;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = button.dataset.failed;
    }
  });
});
