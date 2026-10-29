/* Saffron & Stone — interactive behaviours */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
        navToggle.focus();
      }
    });
  }

  // Menu category filters
  const filterButtons = document.querySelectorAll(".filter-button");
  const dishes = document.querySelectorAll(".dish-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      dishes.forEach((dish) => {
        dish.hidden = selectedCategory !== "all" && dish.dataset.category !== selectedCategory;
      });
    });
  });

  // Copyright year
  const yearElement = document.querySelector("#copyright-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Reservation date: today's local date is the earliest selectable date.
  const dateInput = document.querySelector("#reservation-date");
  const reservationForm = document.querySelector("#reservation-form");
  const formMessage = document.querySelector("#form-message");

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (dateInput) {
    dateInput.min = localDateString(new Date());
  }

  if (reservationForm && formMessage) {
    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formMessage.textContent = "";
      formMessage.className = "form-message";

      // Use built-in browser validation and provide a clear accessible message.
      if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        formMessage.textContent = "Please complete all required fields with valid details.";
        formMessage.classList.add("error");
        return;
      }

      if (dateInput && dateInput.value < localDateString(new Date())) {
        formMessage.textContent = "Please choose today or a future date.";
        formMessage.classList.add("error");
        dateInput.focus();
        return;
      }

      const formData = new FormData(reservationForm);
      const guestName = String(formData.get("name") || "").trim();
      const reservationDate = String(formData.get("date") || "");
      const reservationTime = String(formData.get("time") || "");
      const guests = String(formData.get("guests") || "");

      // This is a local demo only. It does not book, email, or store a reservation.
      formMessage.textContent =
        `Thank you, ${guestName}. Your details are valid for ${guests} guest(s) on ${reservationDate} at ${reservationTime}. This is a demo only; no reservation has been sent or confirmed.`;
      formMessage.classList.add("success");
    });
  }

  // Graceful fallback for remote images that fail to load.
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-unavailable");
      image.alt = image.alt ? `${image.alt} (image unavailable)` : "Image unavailable";
    }, { once: true });
  });
});
