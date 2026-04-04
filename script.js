const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const footerLinks = document.querySelectorAll(".site-footer__menu a");
const revealItems = document.querySelectorAll("[data-reveal]");
const motionSections = document.querySelectorAll("main section, .visual-band, .site-footer");
const faqItems = document.querySelectorAll(".faq-item");
const magneticTargets = document.querySelectorAll(".button, .social-widget__link, .contact-pill");
const interactiveCards = document.querySelectorAll(
  ".program-card, .visual-band__item, .result-card, .faq-item, .contact-form, .trust-point, .trust-panel, .tariff-overview__item, .tariff-detail__spot"
);
const contactForms = document.querySelectorAll(".contact-form");
const linkedCards = document.querySelectorAll("[data-card-href]");
const resultsSliders = document.querySelectorAll("[data-results-slider]");
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const TELEGRAM_BOT_TOKEN = "8621776447:AAF-yqZTlzfjJpGUExIuxa7hNH8hiGxrvPI";
const TELEGRAM_CHAT_ID = "1185656239";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
const TELEGRAM_FIELD_LABELS = {
  interest: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
  contact: "\u0421\u043f\u043e\u0441\u043e\u0431 \u0441\u0432\u044f\u0437\u0438",
  email: "Email",
  message: "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435",
};
const applyMenuToggleLabel = (expanded) => {
  if (!menuToggle) {
    return;
  }

  menuToggle.setAttribute(
    "aria-label",
    expanded
      ? "\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e"
      : "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e"
  );
};

const setMenuToggleLabel = (expanded) => {
  if (!menuToggle) {
    return;
  }

  menuToggle.setAttribute("aria-label", expanded ? "Закрыть меню" : "Открыть меню");
};

const closeMenu = () => {
  body.classList.remove("menu-open");

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    applyMenuToggleLabel(false);
  }
};

if (menuToggle) {
  applyMenuToggleLabel(false);

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;

    menuToggle.setAttribute("aria-expanded", String(nextExpanded));
    applyMenuToggleLabel(nextExpanded);
    body.classList.toggle("menu-open", nextExpanded);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 900 || !body.classList.contains("menu-open")) {
      return;
    }

    if (event.target instanceof Element && event.target.closest(".site-header")) {
      return;
    }

    closeMenu();
  });
}

[...navLinks, ...footerLinks].forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const syncHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const syncHeroDepth = () => {
  const offset = window.innerWidth <= 720 ? 0 : Math.min(window.scrollY, 360);
  document.documentElement.style.setProperty("--hero-shift", `${offset}px`);
};

const syncScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
};

syncHeader();
syncHeroDepth();
syncScrollProgress();

let scrollTicking = false;

const runScrollEffects = () => {
  syncHeader();
  syncHeroDepth();
  syncScrollProgress();
  scrollTicking = false;
};

const queueScrollEffects = () => {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(runScrollEffects);
};

window.addEventListener("scroll", queueScrollEffects, { passive: true });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${(index % 6) * 0.06}s`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -36px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-inview", entry.isIntersecting);
      });
    },
    {
      threshold: 0.38,
      rootMargin: "-10% 0px -45% 0px",
    }
  );

  motionSections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  motionSections.forEach((section) => section.classList.add("is-inview"));
}

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-item__button");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("is-open");
      faqItem.querySelector(".faq-item__button")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

if (supportsHover) {
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;

      card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

linkedCards.forEach((card) => {
  const href = card.getAttribute("data-card-href");

  if (!href) {
    return;
  }

  card.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button, input, select, option, label")) {
      return;
    }

    window.location.href = href;
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    window.location.href = href;
  });
});

resultsSliders.forEach((slider) => {
  const section = slider.closest(".results");
  const prevButton = section?.querySelector("[data-results-prev]");
  const nextButton = section?.querySelector("[data-results-next]");
  const cards = Array.from(slider.querySelectorAll(".result-card"));
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragMoved = false;
  let snapTimer = null;

  if (!cards.length) {
    return;
  }

  const getSnapPositions = () => {
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);

    return cards.map((card) => {
      const centeredOffset = card.offsetLeft - (slider.clientWidth - card.clientWidth) / 2;
      return Math.min(maxScroll, Math.max(0, Math.round(centeredOffset)));
    });
  };

  const syncResultsNav = () => {
    const current = slider.scrollLeft;
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);

    if (prevButton) {
      prevButton.disabled = current <= 8;
    }

    if (nextButton) {
      nextButton.disabled = current >= maxScroll - 8;
    }
  };

  const snapToClosestCard = (behavior = "smooth") => {
    const positions = getSnapPositions();
    const current = slider.scrollLeft;

    if (!positions.length) {
      return;
    }

    const target = positions.reduce((closest, position) =>
      Math.abs(position - current) < Math.abs(closest - current) ? position : closest
    , positions[0]);

    slider.scrollTo({ left: target, behavior });
  };

  const queueSnapToClosestCard = (delay = 150) => {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      if (!isDragging) {
        snapToClosestCard();
      }
    }, delay);
  };

  const moveResultsSlider = (direction) => {
    const offsets = getSnapPositions();
    const current = slider.scrollLeft;

    if (!offsets.length) {
      return;
    }

    if (direction > 0) {
      const target = offsets.find((offset) => offset > current + 24) ?? offsets[offsets.length - 1];
      slider.scrollTo({ left: target, behavior: "smooth" });
      return;
    }

    const target = [...offsets].reverse().find((offset) => offset < current - 24) ?? offsets[0];
    slider.scrollTo({ left: target, behavior: "smooth" });
  };

  prevButton?.addEventListener("click", () => {
    moveResultsSlider(-1);
  });

  nextButton?.addEventListener("click", () => {
    moveResultsSlider(1);
  });

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveResultsSlider(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveResultsSlider(-1);
    }
  });

  const handleResultsDrag = (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - startX;
    dragMoved = dragMoved || Math.abs(deltaX) > 4;
    slider.scrollLeft = startScrollLeft - deltaX * 0.92;
    event.preventDefault();
  };

  const stopResultsDrag = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    slider.classList.remove("is-dragging");
    window.removeEventListener("mousemove", handleResultsDrag);
    window.removeEventListener("mouseup", stopResultsDrag);
    if (dragMoved) {
      queueSnapToClosestCard(70);
    }
    syncResultsNav();
  };

  slider.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
      return;
    }

    window.clearTimeout(snapTimer);
    isDragging = true;
    dragMoved = false;
    startX = event.clientX;
    startScrollLeft = slider.scrollLeft;
    slider.classList.add("is-dragging");
    window.addEventListener("mousemove", handleResultsDrag);
    window.addEventListener("mouseup", stopResultsDrag);
  });

  slider.addEventListener("dragstart", (event) => event.preventDefault());
  slider.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 3) {
      return;
    }

    slider.scrollLeft += event.deltaY * 0.9;
    queueSnapToClosestCard(170);
    event.preventDefault();
  }, { passive: false });

  slider.addEventListener("scroll", () => {
    syncResultsNav();

    if (!isDragging) {
      queueSnapToClosestCard(170);
    }
  }, { passive: true });
  window.addEventListener("resize", syncResultsNav);
  syncResultsNav();
});

if (supportsHover) {
  magneticTargets.forEach((target) => {
    target.addEventListener("mousemove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const moveX = (x - 50) * 0.08;
      const moveY = (y - 50) * 0.08;

      target.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
      target.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
      target.style.setProperty("--magnetic-x", `${moveX.toFixed(2)}px`);
      target.style.setProperty("--magnetic-y", `${moveY.toFixed(2)}px`);
    });

    target.addEventListener("mouseleave", () => {
      target.style.removeProperty("--magnetic-x");
      target.style.removeProperty("--magnetic-y");
      target.style.removeProperty("--pointer-x");
      target.style.removeProperty("--pointer-y");
    });
  });
}

contactForms.forEach((form) => {
  const response = form.querySelector(".form-response");
  const submitButton = form.querySelector('button[type="submit"]');

  const formatLeadDateTime = () =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

  const buildTelegramMessage = (formData) => {
    const name = String(formData.get("name") || "").trim() || "\u2014";
    const phone = String(formData.get("phone") || "").trim() || "\u2014";
    const lines = [
      "\uD83D\uDD25 \u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u0441 \u0441\u0430\u0439\u0442\u0430",
      "",
      `\uD83D\uDC64 \u0418\u043c\u044f: ${name}`,
      `\uD83D\uDCDE \u0422\u0435\u043b\u0435\u0444\u043e\u043d: ${phone}`,
      `\uD83D\uDD52 ${formatLeadDateTime()}`,
    ];

    for (const [key, rawValue] of formData.entries()) {
      const value = String(rawValue || "").trim();

      if (!value || key === "name" || key === "phone") {
        continue;
      }

      const label = TELEGRAM_FIELD_LABELS[key] || key;
      lines.push(`${label}: ${value}`);
    }

    return lines.join("\n");
  };

  const sendLeadToTelegram = async (message) => {
    if (
      !TELEGRAM_BOT_TOKEN ||
      !TELEGRAM_CHAT_ID ||
      TELEGRAM_BOT_TOKEN === "PASTE_BOT_TOKEN_HERE" ||
      TELEGRAM_CHAT_ID === "PASTE_CHAT_ID_HERE"
    ) {
      throw new Error("TELEGRAM_NOT_CONFIGURED");
    }

    const telegramResponse = await fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error(`TELEGRAM_HTTP_${telegramResponse.status}`);
    }

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      throw new Error(telegramResult.description || "TELEGRAM_API_ERROR");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!response) {
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const message = buildTelegramMessage(formData);

    response.textContent = "";

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      await sendLeadToTelegram(message);
      response.textContent =
        "\u0421\u043f\u0430\u0441\u0438\u0431\u043e! \u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430, \u043c\u044b \u0441\u043a\u043e\u0440\u043e \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438.";
      form.reset();
    } catch (error) {
      console.error("Telegram lead submit failed:", error);

      response.textContent =
        error instanceof Error && error.message === "TELEGRAM_NOT_CONFIGURED"
          ? "\u0424\u043e\u0440\u043c\u0430 \u0435\u0449\u0435 \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0430. \u0423\u043a\u0430\u0436\u0438\u0442\u0435 TELEGRAM_BOT_TOKEN \u0438 TELEGRAM_CHAT_ID \u0432 script.js."
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0438\u043b\u0438 \u0441\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 \u043d\u0430\u043c\u0438 \u043f\u043e \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0443.";
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }

    return;

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const parts = [];

    if (name) {
      parts.push(`${name}, \u0441\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u0437\u0430\u044f\u0432\u043a\u0443.`);
    } else {
      parts.push("\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u0437\u0430\u044f\u0432\u043a\u0443.");
    }

    if (interest) {
      parts.push(`\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435: \u00ab${interest}\u00bb.`);
    }

    parts.push(
      "\u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u043c \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0441\u0442\u0438."
    );

    if (contact) {
      parts.push(
        `\u0423\u0434\u043e\u0431\u043d\u044b\u0439 \u0441\u043f\u043e\u0441\u043e\u0431 \u0441\u0432\u044f\u0437\u0438: ${contact.toLowerCase()}.`
      );
    }

    response.textContent = parts.join(" ");
    form.reset();
    return;

    if (name) {
      parts.push(`${name}, спасибо за заявку.`);
    } else {
      parts.push("Спасибо за заявку.");
    }

    if (interest) {
      parts.push(`Направление: «${interest}».`);
    }

    parts.push("Мы свяжемся с вами и отправим подробности.");

    if (contact) {
      parts.push(`Удобный способ связи: ${contact.toLowerCase()}.`);
    }

    response.textContent = parts.join(" ");
    form.reset();
  });
});
