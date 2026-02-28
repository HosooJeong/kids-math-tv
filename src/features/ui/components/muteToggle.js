const TOGGLE_SELECTOR = "[data-audio-toggle='kids-math-tv']";

export function mountMuteToggle({ isMuted, onToggle, onInteract }) {
  let button = document.querySelector(TOGGLE_SELECTOR);

  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "mute-toggle-btn";
    button.dataset.audioToggle = "kids-math-tv";
    document.body.appendChild(button);
  }

  function render() {
    const muted = Boolean(isMuted?.());
    button.classList.toggle("muted", muted);
    button.textContent = muted ? "🔇" : "🔊";
    button.setAttribute("aria-label", muted ? "소리 켜기" : "소리 끄기");
    button.setAttribute("title", muted ? "소리 켜기" : "소리 끄기");
    button.setAttribute("aria-pressed", String(muted));
  }

  function handlePointerDown() {
    onInteract?.();
  }

  function handleClick() {
    onInteract?.();
    onToggle?.();
    render();
  }

  button.addEventListener("pointerdown", handlePointerDown);
  button.addEventListener("click", handleClick);
  render();

  return {
    render,
    destroy() {
      button.removeEventListener("pointerdown", handlePointerDown);
      button.removeEventListener("click", handleClick);
      button.remove();
    }
  };
}
