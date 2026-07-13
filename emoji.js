(function () {
  const emojiButton = document.getElementById('emoji-button');
  const emojiPicker = document.getElementById('emoji-picker');
  const userInput = document.getElementById('user-input');

  if (!emojiButton || !emojiPicker || !userInput) return;

  function setOpen(open) {
    emojiPicker.setAttribute('aria-hidden', open ? 'false' : 'true');
    emojiPicker.style.display = open ? 'grid' : 'none';
  }

  // Default closed
  setOpen(false);

  emojiButton.addEventListener('click', () => {
    const isHidden = emojiPicker.getAttribute('aria-hidden') === 'true';
    setOpen(isHidden);
  });

  emojiPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-emoji]');
    if (!btn) return;

    const emoji = btn.getAttribute('data-emoji') || '';
    if (!emoji) return;

    // Insert emoji at cursor position if possible, otherwise append.
    const start = userInput.selectionStart ?? userInput.value.length;
    const end = userInput.selectionEnd ?? userInput.value.length;

    // If emoji is provided as an escaped unicode string, decode it.
    // (e.g., "\uD83D\uDE00" -> actual emoji)
    let toInsert = emoji;
    try {
      if (/\\u[0-9a-fA-F]{4}/.test(emoji)) {
        toInsert = emoji.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      }
    } catch (_) {}

    userInput.value = userInput.value.slice(0, start) + toInsert + userInput.value.slice(end);
    const cursor = start + toInsert.length;

    userInput.setSelectionRange(cursor, cursor);
    userInput.focus();

    setOpen(false);
  });

  // Close picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!emojiPicker || !emojiButton) return;
    const target = e.target;
    if (target === emojiButton || emojiButton.contains(target)) return;
    if (emojiPicker.contains(target)) return;
    setOpen(false);
  });
})();

