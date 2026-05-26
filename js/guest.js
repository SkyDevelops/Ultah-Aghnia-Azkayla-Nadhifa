/* ========================================================
   GUEST PROFILE PAGE — Logic (Ocean Theme)
   ======================================================== */
(function () {
  "use strict";

  const profileForm = document.getElementById("profileForm");
  const guestNameInput = document.getElementById("guestNameInput");
  const guestAddressInput = document.getElementById("guestAddressInput");
  const loadingScreen = document.getElementById("loadingScreen");
  const mainPage = document.getElementById("mainPage");

  function init() {
    // Hide loading screen after 800ms
    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add("hidden");
      if (mainPage) mainPage.style.display = "flex";
    }, 800);

    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = guestNameInput.value.trim();
        const address = guestAddressInput.value.trim();

        if (!name || !address) return;

        // Visual effects (confetti burst) on submit button position
        const btn = profileForm.querySelector("button[type='submit']");
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const clientX = rect.left + rect.width / 2;
          const clientY = rect.top + rect.height / 2;
          if (window.confettiBurst) {
            window.confettiBurst(clientX, clientY, 45);
          }
        }

        // Save in sessionStorage
        sessionStorage.setItem("guestName", name);
        sessionStorage.setItem("guestAddress", address);

        // Transition fade-out to dashboard.html
        setTimeout(() => {
          document.body.style.transition = "opacity 0.4s ease";
          document.body.style.opacity = "0";
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 400);
        }, 600);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
