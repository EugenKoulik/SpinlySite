(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Закрыть">×</button><img alt="" />';
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");
  const closeLb = () => {
    lightbox.classList.remove("is-open");
    lbImg.removeAttribute("src");
  };
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox__close")) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });
  document.querySelectorAll(".phone img, .theme-tile img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || "";
      lightbox.classList.add("is-open");
    });
  });

  document.querySelectorAll(".media-slot[data-video]").forEach((slot) => {
    const src = slot.getAttribute("data-video");
    if (!src) return;
    const video = document.createElement("video");
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.preload = "metadata";
    video.src = src;
    video.addEventListener("loadeddata", () => {
      slot.classList.add("is-filled");
      slot.replaceChildren(video);
      video.play().catch(() => {});
    });
  });

  const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  const mobileSelect = document.querySelector(".toc-mobile select");
  if (mobileSelect) {
    mobileSelect.addEventListener("change", () => {
      const id = mobileSelect.value;
      if (id) {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
})();
