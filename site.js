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
  const crumbsCurrent = document.querySelector(".crumbs__current");
  const mobileSelect = document.querySelector(".toc-mobile select");

  function sectionTitle(section) {
    return (
      section.getAttribute("data-title") ||
      (section.querySelector("h2") && section.querySelector("h2").textContent.trim()) ||
      ""
    );
  }

  function setActiveSection(id) {
    tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
    const section = document.querySelector(id);
    if (crumbsCurrent && section) crumbsCurrent.textContent = sectionTitle(section);
    if (mobileSelect && mobileSelect.value !== id) mobileSelect.value = id;
  }

  if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
    const tocIo = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        setActiveSection("#" + visible[0].target.id);
      },
      { rootMargin: "-28% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => tocIo.observe(s));
  }

  function revealAllNow() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  function goToSection(id) {
    const target = id && document.querySelector(id);
    if (!target) return false;
    revealAllNow();
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
      setActiveSection(id);
    });
    return true;
  }

  tocLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!goToSection(id)) return;
      e.preventDefault();
    });
  });

  if (mobileSelect) {
    mobileSelect.addEventListener("change", () => {
      goToSection(mobileSelect.value);
    });
  }

  if (location.hash && document.querySelector(location.hash)) {
    revealAllNow();
    setActiveSection(location.hash);
    requestAnimationFrame(() => {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  } else if (sections[0]) {
    setActiveSection("#" + sections[0].id);
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
