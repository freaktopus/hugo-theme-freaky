const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const pathEl = document.getElementById("path");
if (pathEl) pathEl.textContent = location.pathname;

// Avatar change animation
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  document.querySelectorAll(".flicker").forEach((el) => {
    const holdA = Number(el.dataset.holdA) || 3000;
    const holdB = Number(el.dataset.holdB) || 400;
    const delay = Number(el.dataset.delay) || 0;

    const loop = () => {
      el.classList.remove("on"); // avatar 1
      setTimeout(() => {
        el.classList.add("on"); // show avatar 2
        setTimeout(loop, holdB);
      }, holdA);
    };

    setTimeout(loop, delay);
  });
})();

// show more projects
(function () {
  const btn = document.getElementById("show-more-projects");
  const list = document.getElementById("project-list");
  if (!btn || !list) return;

  btn.addEventListener("click", () => {
    const expanded = list.classList.toggle("is-expanded");
    btn.textContent = expanded ? "show less" : "show more";
    btn.dataset.expanded = String(expanded);
  });
})();

// terminal typing — fixed Currently: + cycling roles
(function () {
  const el = document.getElementById("typer");
  const fixed = document.getElementById("term-fixed");
  if (!el || !fixed) return;

  const roles =
    window.CURRENT_ROLES && window.CURRENT_ROLES.length
      ? window.CURRENT_ROLES
      : [];

  // No roles configured — hide the terminal line instead of typing placeholder text.
  if (!roles.length) {
    const term = el.closest(".term");
    if (term) term.style.display = "none";
    return;
  }

  const typeInto = (node, text, onDone) => {
    let i = 0;
    node.textContent = "";
    const step = () => {
      i++;
      node.textContent = text.slice(0, i);
      if (i >= text.length) return onDone();
      setTimeout(step, 36 + Math.random() * 40);
    };
    step();
  };

  const deleteFrom = (node, onDone) => {
    const step = () => {
      const t = node.textContent;
      if (!t.length) return onDone();
      node.textContent = t.slice(0, -1);
      setTimeout(step, 28);
    };
    step();
  };

  let i = 0;

  const nextRole = () => {
    typeInto(el, roles[i], () => {
      setTimeout(() => {
        deleteFrom(el, () => {
          i = (i + 1) % roles.length;
          setTimeout(nextRole, 280);
        });
      }, 2000);
    });
  };

  // type Currently: once, then keep it forever
  typeInto(fixed, "Currently: ", nextRole);
})();

// scroll reveal
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
})();

// contact form — custom purpose select + mailto send
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const select = document.getElementById("purpose-select") || form.querySelector("[data-select]");
  const trigger = document.getElementById("purpose-trigger");
  const menu = document.getElementById("purpose-menu") || select?.querySelector(".purpose-menu");
  const valueEl = document.getElementById("purpose-placeholder") || select?.querySelector(".purpose-value");
  const hidden = document.getElementById("contact-purpose");
  const status = document.getElementById("contact-status");
  const sendBtn = document.getElementById("contact-send");
  const options = menu ? [...menu.querySelectorAll('[role="option"]')] : [];
  const purposeLabels = options.map((o) => o.textContent.trim()).filter(Boolean);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cycleTimer = null;
  let cycleIndex = 0;
  let isOpen = false;

  const setStatus = (msg, kind) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle("is-error", kind === "error");
    status.classList.toggle("is-ok", kind === "ok");
  };

  const stopPlaceholderCycle = () => {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
    valueEl?.classList.remove("is-cycling");
  };

  const showPlaceholder = (text, animate) => {
    if (!valueEl) return;
    if (animate && !reduced) {
      valueEl.classList.remove("is-cycling");
      void valueEl.offsetWidth;
      valueEl.classList.add("is-cycling");
    }
    valueEl.textContent = text;
  };

  const startPlaceholderCycle = () => {
    if (!valueEl || valueEl.dataset.placeholder !== "true" || !purposeLabels.length) return;
    stopPlaceholderCycle();
    showPlaceholder(purposeLabels[0], false);
    if (reduced || purposeLabels.length < 2) return;
    cycleIndex = 0;
    cycleTimer = setInterval(() => {
      if (valueEl.dataset.placeholder !== "true") {
        stopPlaceholderCycle();
        return;
      }
      cycleIndex = (cycleIndex + 1) % purposeLabels.length;
      showPlaceholder(purposeLabels[cycleIndex], true);
    }, 2200);
  };

  const closeMenu = () => {
    if (!select || !trigger || !menu) return;
    isOpen = false;
    select.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  };

  const openMenu = () => {
    if (!select || !trigger || !menu) return;
    isOpen = true;
    select.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  };

  const choose = (option) => {
    if (!option || !valueEl || !hidden) return;
    stopPlaceholderCycle();
    options.forEach((o) => o.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", "true");
    valueEl.textContent = option.textContent.trim();
    valueEl.dataset.placeholder = "false";
    valueEl.classList.remove("is-cycling");
    hidden.value = option.getAttribute("data-value") || option.dataset.value || "";
    closeMenu();
    trigger?.focus();
  };

  trigger?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) closeMenu();
    else openMenu();
  });

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      choose(option);
    });
    option.addEventListener("keydown", (e) => {
      const i = options.indexOf(option);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        options[(i + 1) % options.length]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        options[(i - 1 + options.length) % options.length]?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        choose(option);
      } else if (e.key === "Escape") {
        closeMenu();
        trigger?.focus();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    if (select && !select.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
      trigger?.focus();
    }
  });

  startPlaceholderCycle();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (document.getElementById("contact-email")?.value || "").trim();
    const purpose = (hidden?.value || "").trim();
    const purposeLabel = valueEl?.dataset.placeholder === "true"
      ? ""
      : (valueEl?.textContent || "").trim();
    const message = (document.getElementById("contact-message")?.value || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email.", "error");
      return;
    }
    if (!purpose) {
      setStatus("Please select a purpose.", "error");
      openMenu();
      return;
    }
    if (!message) {
      setStatus("Please add a short description.", "error");
      return;
    }

    sendBtn?.classList.remove("is-sent");
    sendBtn?.classList.add("is-sending");

    const draft = `Purpose: ${purposeLabel}\nFrom: ${email}\n\n${message}`;
    const finish = (statusMsg) => {
      sendBtn?.classList.remove("is-sending");
      sendBtn?.classList.add("is-sent");
      setStatus(statusMsg, "ok");
      setTimeout(() => sendBtn?.classList.remove("is-sent"), 900);
    };

    const copyDraft = () => {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(draft);
      }
      return Promise.reject();
    };

    setTimeout(() => {
      copyDraft()
        .then(() => {
          finish("Message copied. Paste it via LinkedIn, X, or another link below.");
        })
        .catch(() => {
          finish("Please reach out using the links under Other ways to reach me.");
        });
    }, 450);
  });
})();

// site views counter (optional — requires [params.siteviews] with count_url)
(function () {
  const siteViews = document.getElementById("site-views");
  const countEl = document.getElementById("site-views-count");

  if (!siteViews || !countEl) return;

  const countUrl = siteViews.dataset.countUrl;
  if (!countUrl) return;

  const label = countEl.textContent.replace(/^--\s*/, "") || "Site Views";

  fetch(countUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch site views");
      return response.json();
    })
    .then((data) => {
      if (typeof data.count === "number") {
        countEl.textContent = `${data.count} ${label}`;
        siteViews.classList.add("connected");
      }
    })
    .catch(() => {
      countEl.textContent = `-- ${label}`;
      siteViews.classList.remove("connected");
    });
})();

// active nav on scroll
(function () {
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const ids = navLinks
    .map((a) => (a.getAttribute("href") || "").split("#")[1])
    .filter((id) => id && document.getElementById(id));
  if (!ids.length) return;
  if (!ids.includes("home") && document.getElementById("home")) ids.unshift("home");

  const onScroll = () => {
    let current = "home";
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= 100) current = id;
    });
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href.endsWith(`#${current}`));
    });
  };

  if (!document.getElementById("home")) return;

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
