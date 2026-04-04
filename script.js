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

const closeMenu = () => {
  body.classList.remove("menu-open");

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    body.classList.toggle("menu-open", !expanded);
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
  const offset = Math.min(window.scrollY, 360);
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

window.addEventListener("scroll", () => {
  syncHeader();
  syncHeroDepth();
  syncScrollProgress();
});

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

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 900) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;

    card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

linkedCards.forEach((card) => {
  const href = card.getAttribute("data-card-href");

  if (!href) {
    return;
  }

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input, select, option, label")) {
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

  slider.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
      return;
    }

    isDragging = true;
    dragMoved = false;
    startX = event.clientX;
    startScrollLeft = slider.scrollLeft;
    slider.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - startX;
    dragMoved = dragMoved || Math.abs(deltaX) > 4;
    slider.scrollLeft = startScrollLeft - deltaX * 1.12;
    event.preventDefault();
  });

  const stopResultsDrag = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    slider.classList.remove("is-dragging");
    if (dragMoved) {
      snapToClosestCard();
    }
    syncResultsNav();
  };

  window.addEventListener("mouseup", stopResultsDrag);
  slider.addEventListener("mouseleave", stopResultsDrag);
  slider.addEventListener("dragstart", (event) => event.preventDefault());

  slider.addEventListener("scroll", syncResultsNav, { passive: true });
  window.addEventListener("resize", syncResultsNav);
  syncResultsNav();
});

magneticTargets.forEach((target) => {
  target.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 900) {
      return;
    }

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

contactForms.forEach((form) => {
  const response = form.querySelector(".form-response");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!response) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const parts = [];

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
