export function bindRemote({ onLeft, onRight, onSelect }) {
  function handler(e) {
    const key = e.key;
    if (["ArrowLeft", "ArrowRight", "Enter", " ", "Spacebar"].includes(key)) {
      e.preventDefault();
    }

    if (key === "ArrowLeft") onLeft?.();
    if (key === "ArrowRight") onRight?.();
    if (key === "Enter" || key === " " || key === "Spacebar") onSelect?.();
  }

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}
