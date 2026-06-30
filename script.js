const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const registrationForm = document.querySelector("[data-registration-form]");
const registrationStatus = document.querySelector("[data-registration-status]");
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const registrationEndpoint = window.REGISTRATION_ENDPOINT || (isLocalHost ? "/api/register" : "");

const setRegistrationStatus = (message, type = "") => {
  if (!registrationStatus) return;

  registrationStatus.textContent = message;
  registrationStatus.classList.toggle("is-success", type === "success");
  registrationStatus.classList.toggle("is-error", type === "error");
};

registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = registrationForm.querySelector('button[type="submit"]');
  const formData = new FormData(registrationForm);
  const payload = Object.fromEntries(formData.entries());
  payload.areasOfInterest = formData.getAll("areasOfInterest");

  if (!registrationEndpoint) {
    setRegistrationStatus("Registration endpoint is not configured for production.", "error");
    return;
  }

  submitButton.disabled = true;
  setRegistrationStatus("Submitting...");

  try {
    if (registrationEndpoint.startsWith("http")) {
      const spreadsheetPayload = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        spreadsheetPayload.set(key, Array.isArray(value) ? value.join("; ") : value);
      });

      await fetch(registrationEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: spreadsheetPayload,
      });

      registrationForm.reset();
      setRegistrationStatus("Registration submitted. Thank you.", "success");
      return;
    }

    const response = await fetch(registrationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Registration failed.");
    }

    registrationForm.reset();
    setRegistrationStatus("Registration submitted. Thank you.", "success");
  } catch (error) {
    setRegistrationStatus(error.message || "Unable to submit registration.", "error");
  } finally {
    submitButton.disabled = false;
  }
});
