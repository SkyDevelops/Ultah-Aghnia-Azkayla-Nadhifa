/* =========================================
   GUEST LIST PAGE — Logic (Ocean Theme)
   ========================================= */
(function () {
  "use strict";

  const grid = document.getElementById("guestGrid");
  const searchInput = document.getElementById("searchInput");
  const guestCount = document.getElementById("guestCount");
  const noResults = document.getElementById("noResults");
  const loadingScreen = document.getElementById("loadingScreen");
  const mainPage = document.getElementById("mainPage");

  function getInitials(name) {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  const avatarColors = [
    "linear-gradient(135deg, #0D47A1, #42A5F5)",
    "linear-gradient(135deg, #00695C, #26A69A)",
    "linear-gradient(135deg, #00838F, #00BCD4)",
    "linear-gradient(135deg, #1565C0, #64B5F6)",
    "linear-gradient(135deg, #00796B, #4DB6AC)",
    "linear-gradient(135deg, #0277BD, #4FC3F7)",
  ];

  const fishEmojis = ["🐠", "🐟", "🦈", "🐙", "🐡", "🦀", "🐬", "🐳", "🦑", "🐚"];

  function renderGuests(filter = "") {
    const query = filter.toLowerCase().trim();
    const filtered = GUESTS.filter(
      (g) => g.name.toLowerCase().includes(query) || g.relation.toLowerCase().includes(query)
    );

    grid.innerHTML = "";
    guestCount.textContent = `${filtered.length} dari ${GUESTS.length} tamu`;

    if (filtered.length === 0) {
      noResults.classList.add("show");
      return;
    }
    noResults.classList.remove("show");

    filtered.forEach((guest, i) => {
      const card = document.createElement("div");
      card.className = "guest-card";
      card.setAttribute("role", "listitem");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Pilih ${guest.name}`);
      card.dataset.guestId = guest.id;

      const colorIndex = guest.id % avatarColors.length;

      card.innerHTML = `
        <div class="guest-avatar" style="background:${avatarColors[colorIndex]}">
          ${getInitials(guest.name)}
        </div>
        <div class="guest-info">
          <div class="guest-name">${guest.name}</div>
          <div class="guest-relation">${guest.relation}</div>
        </div>
        <span class="guest-arrow">→</span>
      `;

      card.style.opacity = "0";
      card.style.transform = "translateY(16px)";
      setTimeout(() => {
        card.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 40 * i);

      card.addEventListener("click", (e) => selectGuest(guest, card, e));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectGuest(guest, card, e); }
      });

      grid.appendChild(card);
    });
  }

  function selectGuest(guest, card, e) {
    if (card.classList.contains("selected")) return;

    const rect = card.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    const clientX = e.clientX || rect.left + rect.width / 2;
    const clientY = e.clientY || rect.top + rect.height / 2;
    ripple.style.left = clientX - rect.left + "px";
    ripple.style.top = clientY - rect.top + "px";
    card.appendChild(ripple);

    card.classList.add("selected");

    if (window.confettiBurst) confettiBurst(clientX, clientY, 40);

    sessionStorage.setItem("guestName", guest.name);
    sessionStorage.setItem("guestId", guest.id);

    setTimeout(() => {
      document.body.style.transition = "opacity 0.4s ease";
      document.body.style.opacity = "0";
      setTimeout(() => { window.location.href = "dashboard.html"; }, 400);
    }, 700);
  }

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { renderGuests(searchInput.value); }, 150);
  });

  function init() {
    renderGuests();
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      mainPage.style.display = "flex";
    }, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
