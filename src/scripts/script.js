document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("copyright-year");
  if (el) el.textContent = new Date().getFullYear();
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons if available
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Smooth scrolling for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  // Sidebar active state highlighting (left nav)
  var sidebarLinks = document.querySelectorAll(".sidebar-link[href^='#']");
  var sections = [];

  sidebarLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    var target = document.querySelector(href);
    if (target) {
      sections.push({ link: link, target: target, href: href });
    }
  });

  function updateSidebarActive() {
    if (!sections.length) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var offset = 200;
    var active = sections[0];

    sections.forEach(function (item) {
      var rectTop = item.target.getBoundingClientRect().top + window.scrollY;
      if (scrollY >= rectTop - offset) {
        active = item;
      }
    });

    sidebarLinks.forEach(function (link) {
      link.style.color = "";
      link.style.paddingLeft = "";
    });

    if (active && active.link) {
      active.link.style.color = "var(--gold)";
      active.link.style.paddingLeft = "0.5rem";
    }
  }

  window.addEventListener("scroll", updateSidebarActive);
  updateSidebarActive();

  // Also mark clicked item as active immediately
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      sidebarLinks.forEach(function (l) {
        l.style.color = "";
        l.style.paddingLeft = "";
      });
      link.style.color = "var(--gold)";
      link.style.paddingLeft = "0.5rem";
    });
  });

  // Expertise carousel: static two-card layout with data substitution
  const expertiseItems = [
    {
      id: "data-consulting",
      icon: "database-zap",
      title: "Data Consulting",
      body: "Beyond simple POC-style visualisation. We provide end-to-end data strategy, from storage optimisation to real-time analytics architectures.",
    },
    {
      id: "agents-ai",
      icon: "cpu",
      title: "Agentic AI",
      body: "Consulting on next-generation automation. We help enterprises deploy autonomous AI agents that reason, plan, and execute in your ecosystem.",
    },
    {
      id: "integration",
      icon: "network",
      title: "Enterprise Integration",
      body: "Designing and hardening the connective tissue of your digital landscape: APIs, events, and services that keep your critical systems in sync.",
    },
    {
      id: "governance",
      icon: "shield-check",
      title: "API Governance",
      body: "Establishing standards, guardrails, and lifecycle management for APIs so that your integration strategy scales without sacrificing control.",
    },
  ];

  const cardsContainer = document.getElementById("expertise-cards");
  const cardSlots = cardsContainer ? cardsContainer.querySelectorAll("[data-slot]") : [];

  const dotsContainer = document.getElementById("expertise-dots");
  const dots = dotsContainer ? dotsContainer.querySelectorAll("button[data-page]") : [];

  // If the section isn't on this page, don't do anything else
  if (!cardsContainer || cardSlots.length === 0 || dots.length === 0) {
    return;
  }

  let activePage = 0; // 0 => items 0–1, 1 => items 2–3

  function renderPage(pageIndex) {
    const startIndex = pageIndex * 2;

    cardSlots.forEach((slotEl, slotIndex) => {
      const item = expertiseItems[startIndex + slotIndex];

      if (!item) {
        // If no item for this slot (future-proofing)
        slotEl.style.visibility = "hidden";
        return;
      }

      slotEl.style.visibility = "visible";

      const iconWrapper = slotEl.querySelector(".expertise-icon");
      const titleEl = slotEl.querySelector(".expertise-title");
      const bodyEl = slotEl.querySelector(".expertise-body");

      if (iconWrapper) {
        iconWrapper.innerHTML = '<i data-lucide="' + item.icon + '" class="w-10 h-10 text-[var(--gold-bright)]"></i>';
      }
      if (titleEl) titleEl.textContent = item.title;
      if (bodyEl) bodyEl.textContent = item.body;

      // Re-run Lucide to turn <i data-lucide="..."> into SVG
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    });

    // Update dot visual state
    dots.forEach((dot) => {
      const page = Number(dot.getAttribute("data-page"));
      if (page === pageIndex) {
        dot.classList.remove("bg-black");
        dot.classList.add("bg-[var(--gold-bright)]");
      } else {
        dot.classList.remove("bg-[var(--gold-bright)]");
        dot.classList.add("bg-black");
      }
    });

    activePage = pageIndex;
  }

  function lockExpertiseCardHeight() {
    // Measure tallest configuration across both carousel pages
    let maxHeight = 0;

    // We have 2 pages: 0 => items 0–1, 1 => items 2–3
    [0, 1].forEach((pageIndex) => {
      renderPage(pageIndex);

      const cardsContainer = document.getElementById("expertise-cards");
      if (!cardsContainer) return;

      const cardSlots = cardsContainer.querySelectorAll("[data-slot]");
      cardSlots.forEach((card) => {
        const h = card.offsetHeight;
        if (h > maxHeight) maxHeight = h;
      });
    });

    // Apply min-height to all card slots
    const cardsContainer = document.getElementById("expertise-cards");
    if (!cardsContainer) return;

    const cardSlots = cardsContainer.querySelectorAll("[data-slot]");
    cardSlots.forEach((card) => {
      card.style.minHeight = maxHeight + "px";
    });

    // Return to the active page
    renderPage(activePage);
  }

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const page = Number(dot.getAttribute("data-page"));
      renderPage(page);
    });
  });

  // Auto-rotate between the two pages
  setInterval(() => {
    const next = activePage === 0 ? 1 : 0;
    renderPage(next);
  }, 10000);

  // Initial render
  renderPage(activePage);
  lockExpertiseCardHeight();
});

const form = document.getElementById("consult-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = form.querySelector('[name="email"]').value;
    const industry = form.querySelector('[name="industry"]').value;
    const anonId = getOrCreateAnonId();

    // reCAPTCHA v3: execute and get token
    grecaptcha.ready(function () {
      grecaptcha.execute("__RC_SITE_KEY__", { action: "contact" }).then(async function (token) {
        // Send everything to your API Gateway endpoint
        const res = await fetch("__BL_CONTACT_US_API__", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            industry,
            anonId,
            captchaToken: token,
            action: "contact",
          }),
        });

        if (res.ok) {
          alert("Thank you — we’ll get back to you shortly.");
          form.reset();
        } else {
          alert("Something went wrong — please try again.");
        }
      });
    });
  });
}

// Setup a logo track
const CLIENT_LOGOS = [
  { src: "logo/bank_of_ceylon.png", alt: "Bank of Ceylon" },
  { src: "logo/claria.png", alt: "Claria" },
  { src: "logo/imperial.png", alt: "Imperial College London" },
  { src: "logo/mitrai.png", alt: "Mitra" },
  { src: "logo/randoli.png", alt: "Randoli" },
  { src: "logo/rkd_group.png", alt: "RKD Group" },
  { src: "logo/sikoia.png", alt: "Sikoia" },
  { src: "logo/tilli.png", alt: "Tilli" },
];

function initLogoTrack() {
  const heroSection = document.querySelector("main > section");
  if (!heroSection) return;

  // Outer section – sits between hero & rest of content
  const section = document.createElement("section");
  section.className = "logo-track-section py-8 md:py-10";

  const inner = document.createElement("div");
  inner.className = "max-w-7xl mx-auto px-6";

  const label = document.createElement("p");
  label.className = "text-[11px] md:text-xs tracking-[0.35em] uppercase text-gray-400 mb-4 text-center w-full";
  label.textContent = "Trusted by leading organisations";

  const wrapper = document.createElement("div");
  wrapper.className = "logo-track-wrapper overflow-hidden";

  const track = document.createElement("div");
  track.className = "logo-track";

  function appendLogoSet() {
    CLIENT_LOGOS.forEach((logo) => {
      const fig = document.createElement("figure");
      fig.className = "logo-track-logo shrink-0 flex items-center justify-center";

      const img = document.createElement("img");
      img.src = logo.src;
      img.alt = logo.alt;
      img.loading = "lazy";

      fig.appendChild(img);
      track.appendChild(fig);
    });
  }

  // Duplicate the set so the marquee can loop seamlessly
  appendLogoSet();
  appendLogoSet();

  wrapper.appendChild(track);
  inner.appendChild(label);
  inner.appendChild(wrapper);
  section.appendChild(inner);
  heroSection.insertAdjacentElement("afterend", section);

  // === JS-only marquee ===
  setupLogoMarquee(track, wrapper);
}

// JS-only marquee: pixel based, cross-browser consistent
function setupLogoMarquee(track, wrapper) {
  let offset = 0;
  let lastTime = null;
  let loopWidth = 0;
  let paused = false;
  const COPIES = 2; // we appended two sets
  const SPEED = CLIENT_LOGOS.length * 4; // px per second

  function measure() {
    const totalWidth = track.scrollWidth;
    loopWidth = totalWidth / COPIES;
  }

  // Initial measurement after images/layout are ready
  function start() {
    measure();

    wrapper.addEventListener("mouseenter", () => {
      paused = true;
    });
    wrapper.addEventListener("mouseleave", () => {
      paused = false;
    });

    window.addEventListener("resize", () => {
      const prevLoop = loopWidth;
      measure();
      if (loopWidth > 0 && loopWidth !== prevLoop) {
        offset = offset % loopWidth;
      }
    });

    requestAnimationFrame(step);
  }

  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaSec = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (!paused && loopWidth > 0) {
      offset += SPEED * deltaSec;
      if (offset >= loopWidth) {
        offset -= loopWidth;
      }
      track.style.transform = `translateX(${-offset * 1.025}px)`;
    }

    requestAnimationFrame(step);
  }

  // Wait until window load so images have dimensions
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initLogoTrack();
});

// Resize privacy table for mobile
document.addEventListener("DOMContentLoaded", function () {
  // Only do this on small screens (where mobile menu would be visible)
  if (!window.matchMedia("(max-width: 768px)").matches) return;

  function transformPrivacyTable(table) {
    if (!table || table.dataset.mobileTransformed === "true") return;

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;

    // Collect header texts from <th>
    const headerCells = Array.from(thead.querySelectorAll("th")).map((th) => th.textContent.trim());

    // For each row, merge all cells into a single <td> with:
    // <strong>Header:</strong> value
    Array.from(tbody.rows).forEach((row) => {
      const originalCells = Array.from(row.cells);
      const newTd = document.createElement("td");

      headerCells.forEach((headerText, index) => {
        const cell = originalCells[index];
        if (!cell) return;

        const line = document.createElement("p");
        line.style.margin = "0 0 0.35rem";

        const strong = document.createElement("strong");
        strong.textContent = headerText + ": ";
        line.appendChild(strong);

        // We might encounter text nodes, spans, <ul>, etc.
        // If it's a <ul> (like the "Purposes" column), keep bullets
        // but indent the whole list slightly for mobile.
        const extraNodes = []; // e.g. ULs we want to place after the label

        while (cell.firstChild) {
          const node = cell.firstChild;

          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "UL") {
            // Move the UL out, indent it, and append after the label paragraph
            cell.removeChild(node);
            node.style.margin = "0 0 0 1.5rem";
            extraNodes.push(node);
          } else {
            // Normal text / inline nodes go inside the label <p>
            line.appendChild(node);
          }
        }

        newTd.appendChild(line);

        // Append any ULs (or other extra nodes) after the label line
        extraNodes.forEach((n) => newTd.appendChild(n));
      });

      // Replace row content with the single merged cell
      row.innerHTML = "";
      row.appendChild(newTd);
    });

    // Remove the header row entirely
    thead.remove();

    // Mark as done so we don't do it twice
    table.dataset.mobileTransformed = "true";
  }

  function tryTransform() {
    const table = document.querySelector(".privacy-table");
    if (!table) return false;
    transformPrivacyTable(table);
    return true;
  }

  // Try immediately in case the table is already there
  if (tryTransform()) return;

  // Otherwise, watch for it being injected later
  const observer = new MutationObserver(() => {
    if (tryTransform()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Safety: stop watching after 15 seconds
  setTimeout(() => observer.disconnect(), 15000);
});

// GA Anon ID
function getOrCreateAnonId() {
  if (!window.Cookiebot?.consent?.statistics) return "";

  const KEY = "__BL_ANALYTICS_ID__";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

// Set GA User ID
function setGaUserIdIfAllowed(tries = 20) {
  if (!window.Cookiebot?.consent?.statistics) return;

  if (typeof window.gtag === "function") {
    if (!window.__bl_ga_identity_applied) {
      window.__bl_ga_identity_applied = true;
      window.gtag("config", "__GA_MEASUREMENT_ID__", {
        user_id: getOrCreateAnonId()
      });
    }
  } else if (tries > 0) {
    setTimeout(() => setGaUserIdIfAllowed(tries - 1), 100);
  }
}
document.addEventListener("DOMContentLoaded", () => setGaUserIdIfAllowed());
window.addEventListener("CookiebotOnAccept", () => setGaUserIdIfAllowed());
window.addEventListener("CookiebotOnTagsExecuted", () => setGaUserIdIfAllowed());
window.addEventListener("CookiebotOnConsentReady", () => {
  if (!window.Cookiebot?.consent?.statistics) {
    localStorage.removeItem("__BL_ANALYTICS_ID__");
  }
  setGaUserIdIfAllowed();
});
window.addEventListener("CookiebotOnDecline", () => {
  if (!window.Cookiebot?.consent?.statistics) {
    localStorage.removeItem("__BL_ANALYTICS_ID__");
  }
  window.__bl_ga_identity_applied = false;
});
