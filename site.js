(function () {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

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
  document.querySelectorAll(".phone img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || "";
      lightbox.classList.add("is-open");
    });
  });

  const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
    const tocIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => tocIo.observe(s));
  }

  function revealAllNow() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  tocLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      revealAllNow();
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      });
    });
  });

  const mobileSelect = document.querySelector(".toc-mobile select");
  if (mobileSelect) {
    mobileSelect.addEventListener("change", () => {
      const el = document.querySelector(mobileSelect.value);
      if (!el) return;
      revealAllNow();
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    });
  }

  if ("IntersectionObserver" in window) {
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          revealIo.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealIo.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }
})();
