// src/components/quill/ImageEnhancer.ts
// Adds drag-resize handles + double-click hook for replacing images

export function enhanceImages(
  openMediaManager: (target: HTMLImageElement) => void
) {
  const editor = document.querySelector(".ql-editor");
  if (!editor) return;

  // Remove any old handles
  editor.querySelectorAll(".image-resize-handle").forEach((el) => el.remove());

  const handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "IMG") {
      showResizeHandles(target as HTMLImageElement);
    }
  };

  const handleDblClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "IMG") {
      openMediaManager(target as HTMLImageElement);
    }
  };

  editor.addEventListener("click", handleClick);
  editor.addEventListener("dblclick", handleDblClick);
}

function showResizeHandles(img: HTMLImageElement) {
  document.querySelectorAll(".image-resize-handle").forEach((h) => h.remove());

  const rect = img.getBoundingClientRect();

  const left = document.createElement("div");
  left.className = "image-resize-handle";
  styleHandle(left, rect.left, rect.top + rect.height / 2);

  const right = document.createElement("div");
  right.className = "image-resize-handle";
  styleHandle(right, rect.right, rect.top + rect.height / 2);

  document.body.appendChild(left);
  document.body.appendChild(right);

  const startResize = (e: MouseEvent, direction: "left" | "right") => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = img.offsetWidth;

    const move = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidth =
        direction === "right" ? startWidth + delta : startWidth - delta;

      img.style.width = Math.max(80, newWidth) + "px";
      img.style.maxWidth = "none";

      const r = img.getBoundingClientRect();
      left.style.left = r.left - 6 + "px";
      left.style.top = r.top + r.height / 2 - 6 + "px";

      right.style.left = r.right - 6 + "px";
      right.style.top = r.top + r.height / 2 - 6 + "px";
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  left.addEventListener("mousedown", (e) => startResize(e, "left"));
  right.addEventListener("mousedown", (e) => startResize(e, "right"));
}

function styleHandle(handle: HTMLElement, x: number, y: number) {
  Object.assign(handle.style, {
    position: "fixed",
    width: "12px",
    height: "12px",
    background: "#0b1831",
    borderRadius: "50%",
    cursor: "ew-resize",
    zIndex: 99999,
    left: x - 6 + "px",
    top: y - 6 + "px",
  });
}
