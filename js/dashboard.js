/* =========================================
   DASHBOARD PAGE — Logic (Ocean Theme 🦈)
   ========================================= */
(function () {
  "use strict";

  const loadingScreen = document.getElementById("loadingScreen");
  const dashboardPage = document.getElementById("dashboardPage");
  const chipName = document.getElementById("chipName");
  const guestNameDisplay = document.getElementById("guestNameDisplay");
  const childNameWelcome = document.getElementById("childNameWelcome");
  const childAge = document.getElementById("childAge");
  const aboutTitle = document.getElementById("aboutTitle");
  const aboutName = document.getElementById("aboutName");
  const aboutBirth = document.getElementById("aboutBirth");
  const aboutAge = document.getElementById("aboutAge");
  const polaroidCaption = document.getElementById("polaroidCaption");
  const eventChildName = document.getElementById("eventChildName");
  const eventDate = document.getElementById("eventDate");
  const eventTime = document.getElementById("eventTime");
  const eventVenue = document.getElementById("eventVenue");
  const eventAddress = document.getElementById("eventAddress");
  const eventDresscode = document.getElementById("eventDresscode");
  const mapsBtn = document.getElementById("mapsBtn");
  const albumGrid = document.getElementById("albumGrid");
  const wishForm = document.getElementById("wishForm");
  const wishName = document.getElementById("wishName");
  const wishMessage = document.getElementById("wishMessage");
  const wishesList = document.getElementById("wishesList");
  const wishEmpty = document.getElementById("wishEmpty");
  const toast = document.getElementById("toast");
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxContent = document.getElementById("lightboxContent");

  const guestName = sessionStorage.getItem("guestName") || "Tamu Istimewa";

  function populateInfo() {
    chipName.textContent = `Halo, ${guestName}! 🫧`;
    guestNameDisplay.textContent = guestName + "!";
    childNameWelcome.textContent = EVENT_INFO.childName;
    childAge.textContent = EVENT_INFO.age;
    aboutTitle.textContent = EVENT_INFO.childFullName;
    aboutName.textContent = EVENT_INFO.childFullName;
    aboutBirth.textContent = EVENT_INFO.birthDate;
    aboutAge.textContent = EVENT_INFO.age + " Tahun!";
    polaroidCaption.textContent = "Baby Shark " + EVENT_INFO.childName + " — " + EVENT_INFO.age + " Tahun! 🦈";
    eventChildName.textContent = EVENT_INFO.childFullName;
    eventDate.textContent = EVENT_INFO.eventDate;
    eventTime.textContent = EVENT_INFO.eventTime;
    eventVenue.textContent = EVENT_INFO.eventVenue;
    eventAddress.textContent = EVENT_INFO.eventAddress;
    eventDresscode.textContent = EVENT_INFO.dresscode;
    mapsBtn.href = EVENT_INFO.googleMapsUrl;
    wishName.value = guestName !== "Tamu Istimewa" ? guestName : "";
  }

  function startCountdown() {
    // Tanggal acara: Minggu, 28 Juni 2026 jam 18:00 WIB
    const target = new Date("2026-06-28T18:00:00+07:00");
    function update() {
      const now = new Date();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      document.getElementById("countDays").textContent = String(d).padStart(2, "0");
      document.getElementById("countHours").textContent = String(h).padStart(2, "0");
      document.getElementById("countMins").textContent = String(m).padStart(2, "0");
      document.getElementById("countSecs").textContent = String(s).padStart(2, "0");
    }
    update();
    setInterval(update, 1000);
  }

  // Ocean-themed album
  // File naming: foto1.jpg - foto16.jpg (foto), video1.mp4 - video4.mp4 (video)
  // Urutan grid: 20 item total → 16 foto + 4 video
  // Video ada di posisi: 4, 9, 15, 19 (index 3, 8, 14, 18)
  const albumItems = [
    { file: "foto1.jpg",   label: "Foto 1",   type: "photo", emoji: "🦈" },
    { file: "foto2.jpg",   label: "Foto 2",   type: "photo", emoji: "🐠" },
    { file: "foto3.jpg",   label: "Foto 3",   type: "photo", emoji: "🐙" },
    { file: "video1.mp4",  label: "Video 1",  type: "video", emoji: "🎬" },
    { file: "foto4.jpg",   label: "Foto 4",   type: "photo", emoji: "🐬" },
    { file: "foto5.jpg",   label: "Foto 5",   type: "photo", emoji: "🦀" },
    { file: "foto6.jpg",   label: "Foto 6",   type: "photo", emoji: "🐡" },
    { file: "foto7.jpg",   label: "Foto 7",   type: "photo", emoji: "🌊" },
    { file: "video2.mp4",  label: "Video 2",  type: "video", emoji: "🎬" },
    { file: "foto8.jpg",   label: "Foto 8",   type: "photo", emoji: "🦑" },
    { file: "foto9.jpg",   label: "Foto 9",   type: "photo", emoji: "🐳" },
    { file: "foto10.jpg",  label: "Foto 10",  type: "photo", emoji: "🐋" },
    { file: "foto11.jpg",  label: "Foto 11",  type: "photo", emoji: "🪸" },
    { file: "foto12.jpg",  label: "Foto 12",  type: "photo", emoji: "🦞" },
    { file: "video3.mp4",  label: "Video 3",  type: "video", emoji: "🎬" },
    { file: "foto13.jpg",  label: "Foto 13",  type: "photo", emoji: "🫧" },
    { file: "foto14.jpg",  label: "Foto 14",  type: "photo", emoji: "🎂" },
    { file: "foto15.jpg",  label: "Foto 15",  type: "photo", emoji: "🎉" },
    { file: "video4.mp4",  label: "Video 4",  type: "video", emoji: "🎬" },
    { file: "foto16.jpg",  label: "Foto 16",  type: "photo", emoji: "💕" },
  ];

  function renderAlbum() {
    albumGrid.innerHTML = "";
    albumItems.forEach((a, i) => {
      const isVideo = a.type === "video";
      const item = document.createElement("div");
      item.className = "album-item";
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", a.label);
      item.setAttribute("tabindex", "0");

      const filePath = "public/images/" + a.file;
      let inner = `<div class="album-item-inner">`;

      if (isVideo) {
        inner += `<video src="${filePath}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0"></video>`;
        inner += `<div class="video-overlay"><div class="play-btn-circle">▶</div></div>`;
      } else {
        inner += `<img src="${filePath}" alt="${a.label}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />`;
        inner += `<div style="display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%">
          <span class="album-emoji">${a.emoji}</span>
          <span class="album-label">${a.label}</span>
        </div>`;
      }

      inner += `</div>`;
      item.innerHTML = inner;

      item.addEventListener("click", () => openLightbox(i, isVideo));
      item.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(i, isVideo); });
      albumGrid.appendChild(item);
    });
  }

  function openLightbox(index, isVideo) {
    lightboxContent.innerHTML = "";
    const a = albumItems[index];
    const filePath = "public/images/" + a.file;

    if (isVideo) {
      const video = document.createElement("video");
      video.src = filePath;
      video.controls = true;
      video.autoplay = true;
      video.style.cssText = "max-width:90vw;max-height:82dvh;border-radius:14px;";
      lightboxContent.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = filePath;
      img.alt = a.label;
      img.style.cssText = "max-width:90vw;max-height:82dvh;border-radius:14px;";
      img.onerror = function() {
        // Fallback to emoji if image not found
        this.remove();
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;text-align:center;padding:40px;gap:16px;min-height:300px;";
        wrapper.innerHTML = `<div style="font-size:6rem">${a.emoji}</div><div style="font-family:var(--font-display);font-size:1.3rem;font-weight:700">${a.label}</div><div style="background:rgba(255,255,255,0.15);padding:8px 20px;border-radius:999px;font-size:0.85rem">📸 Foto belum tersedia</div>`;
        lightboxContent.appendChild(wrapper);
      };
      lightboxContent.appendChild(img);
    }

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxContent.innerHTML = ""; }, 350);
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  // ---- Wishes ----
  function getWishes() {
    try { return JSON.parse(localStorage.getItem("kaylaWishes") || "[]"); }
    catch { return []; }
  }

  function saveWishes(wishes) {
    localStorage.setItem("kaylaWishes", JSON.stringify(wishes));
  }

  function renderWishes() {
    const wishes = getWishes();
    wishesList.innerHTML = "";
    if (wishes.length === 0) { wishEmpty.style.display = "block"; return; }
    wishEmpty.style.display = "none";

    [...wishes].reverse().forEach((w, i) => {
      const card = document.createElement("div");
      card.className = "wish-card";
      card.style.animationDelay = i * 0.08 + "s";
      card.innerHTML = `
        <div class="wish-card-name">🐠 ${escapeHtml(w.name)}</div>
        <div class="wish-card-message">${escapeHtml(w.message)}</div>
        <div class="wish-card-time">${getTimeAgo(w.timestamp)}</div>
      `;
      wishesList.appendChild(card);
    });
  }

  document.getElementById("emojiPicks").addEventListener("click", (e) => {
    if (e.target.classList.contains("emoji-pick-btn")) {
      const emoji = e.target.textContent;
      const pos = wishMessage.selectionStart || wishMessage.value.length;
      wishMessage.value = wishMessage.value.substring(0, pos) + emoji + wishMessage.value.substring(pos);
      wishMessage.focus();
      wishMessage.selectionStart = wishMessage.selectionEnd = pos + emoji.length;
    }
  });

  wishForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = wishName.value.trim();
    const message = wishMessage.value.trim();
    if (!name || !message) return;

    const wishes = getWishes();
    wishes.push({ name, message, timestamp: Date.now() });
    saveWishes(wishes);
    wishMessage.value = "";

    if (window.confettiRain) confettiRain(2000, 3);
    showToast("Ucapan berhasil dikirim! 🫧🦈");
    renderWishes();
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getTimeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return mins + " menit lalu";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + " jam lalu";
    return Math.floor(hours / 24) + " hari lalu";
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // ---- Music Player ----
  function initMusicPlayer() {
    const audio = document.getElementById("bgMusic");
    const playBtn = document.getElementById("playBtn");
    const volUp = document.getElementById("volUp");
    const volDown = document.getElementById("volDown");
    const progressFill = document.getElementById("progressFill");
    const progressBar = document.getElementById("progressBar");
    const currentTimeEl = document.getElementById("currentTime");
    const totalTimeEl = document.getElementById("totalTime");
    const volumeDisplay = document.getElementById("volumeDisplay");
    const musicDisc = document.getElementById("musicDisc");

    if (!audio || !playBtn) return;

    let isPlaying = false;

    function formatTime(sec) {
      if (isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return m + ":" + String(s).padStart(2, "0");
    }

    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playBtn.textContent = "▶️";
        musicDisc.classList.remove("spinning");
      } else {
        audio.play().catch(() => {
          showToast("Tap sekali lagi untuk play 🎵");
        });
        playBtn.textContent = "⏸️";
        musicDisc.classList.add("spinning");
      }
      isPlaying = !isPlaying;
    });

    volUp.addEventListener("click", () => {
      audio.volume = Math.min(1, audio.volume + 0.1);
      updateVolDisplay();
    });

    volDown.addEventListener("click", () => {
      audio.volume = Math.max(0, audio.volume - 0.1);
      updateVolDisplay();
    });

    function updateVolDisplay() {
      const pct = Math.round(audio.volume * 100);
      const icon = pct === 0 ? "🔇" : pct < 50 ? "🔉" : "🔊";
      volumeDisplay.textContent = icon + " " + pct + "%";
    }

    audio.addEventListener("loadedmetadata", () => {
      totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + "%";
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    progressBar.addEventListener("click", (e) => {
      if (audio.duration) {
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      }
    });
  }

  function init() {
    populateInfo();
    startCountdown();
    renderAlbum();
    renderWishes();
    initScrollReveal();
    initMusicPlayer();

    // Set footer child name
    const footerName = document.getElementById("footerChildName");
    if (footerName) footerName.textContent = EVENT_INFO.childName;

    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      dashboardPage.style.display = "block";
      setTimeout(() => { if (window.confettiRain) confettiRain(3000, 3); }, 300);
    }, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
