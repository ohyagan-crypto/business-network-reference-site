const dropdownToggle = document.querySelector("[data-dropdown-toggle]");
const dropdownMenu = document.querySelector("[data-dropdown-menu]");
const mobileToggle = document.querySelector("[data-mobile-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const overlay = document.querySelector("[data-visit-overlay]");
const openOverlayLinks = document.querySelectorAll("[data-open-overlay]");
const closeOverlayButton = document.querySelector("[data-close-overlay]");
const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll("[data-slide-target]"));
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
let activeSlide = 0;
let timer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activeSlide));
}

function restartTimer() {
  window.clearInterval(timer);
  timer = window.setInterval(() => showSlide(activeSlide + 1), 9000);
}

function openOverlay() {
  overlay?.classList.add("open");
  overlay?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeOverlay() {
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

dropdownToggle?.addEventListener("click", () => {
  const isOpen = dropdownMenu?.classList.toggle("open") || false;
  dropdownToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("open") || false;
  document.body.classList.toggle("menu-open", isOpen);
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    mobileToggle?.setAttribute("aria-expanded", "false");
  });
});

openOverlayLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openOverlay();
  });
});

closeOverlayButton?.addEventListener("click", closeOverlay);

overlay?.addEventListener("click", (event) => {
  if (event.target === overlay) closeOverlay();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOverlay();
    dropdownMenu?.classList.remove("open");
  }
});

prevButton?.addEventListener("click", () => {
  showSlide(activeSlide - 1);
  restartTimer();
});

nextButton?.addEventListener("click", () => {
  showSlide(activeSlide + 1);
  restartTimer();
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slideTarget || 0));
    restartTimer();
  });
});

document.querySelector("#chapter-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const keyword = String(new FormData(form).get("chapter") || "").trim();
  const message = document.querySelector("#chapter-message");
  message.textContent = keyword ? `已收到「${keyword}」查找需求。` : "請先輸入想查找的分會或地區。";
});

document.querySelector("#newsletter-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector("#newsletter-status");
  status.textContent = "已收到訂閱資料。";
  event.currentTarget.reset();
});

showSlide(0);
restartTimer();
