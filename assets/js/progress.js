let postContent = document.querySelector(".post .post-content");

if (postContent) {
  let progress = document.createElement("div");
  progress.className = "progress";

  let bar = document.createElement("div");
  bar.className = "progress-bar";
  progress.appendChild(bar);

  document.body.prepend(progress);

  let queued = false;

  function update() {
    queued = false;

    let { top, height } = postContent.getBoundingClientRect();
    let scrollable = height - window.innerHeight;
    let ratio = scrollable > 0 ? -top / scrollable : 1;

    bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  }

  function queueUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);

  // Also fires once on observe, which paints the initial state.
  new ResizeObserver(queueUpdate).observe(postContent);
}
