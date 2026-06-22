/* =========================================================
   Alpha Efficiency — Test Task
   Vanilla JS: burger menu, countdown timer, FAQ accordion
   ========================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initCountdown();
  initFaq();
});

/* ---------------------------------------------------------
   1) BURGER MENU
   Toggles the mobile navigation drawer + animates the icon.
--------------------------------------------------------- */
function initBurger() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("primaryNav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the drawer when a link is tapped (better mobile UX)
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    });
  });
}

/* ---------------------------------------------------------
   2) COUNTDOWN TIMER
   Counts down to a fixed offer deadline. The deadline is
   stored in localStorage so it stays consistent across
   refreshes; it resets to 7 days out once it expires.
--------------------------------------------------------- */
function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const daysEl = root.querySelector("[data-days]");
  const hoursEl = root.querySelector("[data-hours]");
  const minutesEl = root.querySelector("[data-minutes]");
  const secondsEl = root.querySelector("[data-seconds]");

  const STORAGE_KEY = "offerDeadline";
  const OFFER_LENGTH = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  function getDeadline() {
    let deadline = Number(localStorage.getItem(STORAGE_KEY));
    if (!deadline || deadline <= Date.now()) {
      deadline = Date.now() + OFFER_LENGTH;
      localStorage.setItem(STORAGE_KEY, String(deadline));
    }
    return deadline;
  }

  let deadline = getDeadline();

  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    let diff = deadline - Date.now();

    if (diff <= 0) {
      deadline = getDeadline(); // restart the offer window
      diff = deadline - Date.now();
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   3) FAQ ACCORDION
   Expands one answer at a time with smooth max-height anim.
--------------------------------------------------------- */
function initFaq() {
  const list = document.getElementById("faqList");
  if (!list) return;

  const items = list.querySelectorAll(".faq__item");

  items.forEach((item) => {
    const question = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all items (single-open accordion)
      items.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq__answer").style.maxHeight = null;
        other.querySelector(".faq__question").setAttribute("aria-expanded", "false");
      });

      // Open the clicked one if it was closed
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}
