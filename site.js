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
  document.querySelectorAll(".phone img, .theme-tile img, .hero__fan-card").forEach((img) => {
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

(function () {
  var SECTORS = 6,
    ORANGE = "#F9862E",
    WHITE = "#FFFFFF";
  var labels = ["Приз", "Мимо", "Приз", "Мимо", "Приз", "Мимо"];
  var isWin = function (i) {
    return i % 2 === 0;
  };
  var wheel = document.getElementById("spinlyWheel");
  if (!wheel) return;
  var cx = 100,
    cy = 100,
    r = 100;
  function pt(a) {
    var rad = ((a - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  var svg = "";
  for (var i = 0; i < SECTORS; i++) {
    var a0 = i * (360 / SECTORS),
      a1 = (i + 1) * (360 / SECTORS),
      p0 = pt(a0),
      p1 = pt(a1);
    svg +=
      '<path d="M100,100 L' +
      p0[0].toFixed(2) +
      "," +
      p0[1].toFixed(2) +
      " A100,100 0 0,1 " +
      p1[0].toFixed(2) +
      "," +
      p1[1].toFixed(2) +
      ' Z" fill="' +
      (isWin(i) ? ORANGE : WHITE) +
      '" stroke="#F9862E" stroke-width="1.5"/>';
    var mid = (a0 + a1) / 2,
      rad = ((mid - 90) * Math.PI) / 180,
      tx = cx + 64 * Math.cos(rad),
      ty = cy + 64 * Math.sin(rad);
    svg +=
      '<text x="' +
      tx.toFixed(1) +
      '" y="' +
      ty.toFixed(1) +
      '" fill="' +
      (isWin(i) ? "#fff" : "#E4741C") +
      '" font-size="11" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(' +
      mid +
      " " +
      tx.toFixed(1) +
      " " +
      ty.toFixed(1) +
      ')">' +
      labels[i] +
      "</text>";
  }
  svg += '<circle cx="100" cy="100" r="99" fill="none" stroke="#F9862E" stroke-width="2"/>';
  wheel.innerHTML = svg;

  var modal = document.getElementById("spinlyModal"),
    fab = document.getElementById("spinlyFab");
  var spinBtn = document.getElementById("spinlySpin"),
    result = document.getElementById("spinlyResult");
  var cta = document.getElementById("spinlyCta"),
    closeBtn = document.getElementById("spinlyClose");
  var rotation = 0,
    spinning = false;

  function openModal() {
    modal.classList.add("open");
  }
  function closeModal() {
    modal.classList.remove("open");
  }
  fab.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  spinBtn.addEventListener("click", function () {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    result.textContent = "";
    result.className = "spinly-result";
    cta.style.display = "none";
    var win = Math.random() < 0.5;
    var pool = win ? [0, 2, 4] : [1, 3, 5];
    var target = pool[Math.floor(Math.random() * pool.length)];
    var seg = 360 / SECTORS,
      center = target * seg + seg / 2;
    rotation += 5 * 360 + (360 - center) - (rotation % 360);
    wheel.style.transform = "rotate(" + rotation + "deg)";
    setTimeout(function () {
      spinning = false;
      spinBtn.disabled = false;
      if (win) {
        result.textContent = "🎉 Победа! Ты бы выиграл приз";
        result.className = "spinly-result win";
      } else {
        result.textContent = "Почти! Крути ещё";
        result.className = "spinly-result lose";
      }
      cta.style.display = "inline-block";
    }, 4700);
  });
})();

