/* ========================================================
   DASHBOARD PAGE — Dynamic Database Sync & Features (Ocean Theme 🦈)
   ======================================================== */
(function () {
  "use strict";

  // Canvas Scene Variables
  let canvas, ctx, wrapper;
  let dpr = 1, cw = 1000, ch = 600, af, t = 0;
  let fishes = [], ambBub = [], wishBub = [], snails = [];
  let submarine, diver, ships = [], birds = [];
  const SURFACE_Y = 50;

  // Elements
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
  const polaroidImg = document.getElementById("polaroidImg");
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
  const toast = document.getElementById("toast");
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxContent = document.getElementById("lightboxContent");

  // Gift Chest Elements
  const giftChestWrapper = document.getElementById("giftChestWrapper");
  const giftChestBtn = document.getElementById("giftChestBtn");
  const giftModal = document.getElementById("giftModal");
  const giftModalClose = document.getElementById("giftModalClose");
  const giftModalBackdrop = document.getElementById("giftModalBackdrop");
  const giftDigitalCard = document.getElementById("giftDigitalCard");
  const giftBankName = document.getElementById("giftBankName");
  const giftAccountNumber = document.getElementById("giftAccountNumber");
  const giftAccountName = document.getElementById("giftAccountName");
  const giftAddressText = document.getElementById("giftAddressText");
  const copyBankBtn = document.getElementById("copyBankBtn");
  const copyAddressBtn = document.getElementById("copyAddressBtn");

  // Admin Modal Elements
  const adminLink = document.getElementById("adminLink");
  const adminModal = document.getElementById("adminModal");
  const adminModalClose = document.getElementById("adminModalClose");
  const adminModalBackdrop = document.getElementById("adminModalBackdrop");
  const adminPinScreen = document.getElementById("adminPinScreen");
  const adminDashboardArea = document.getElementById("adminDashboardArea");
  const adminPinError = document.getElementById("adminPinError");
  const adminPinSubmit = document.getElementById("adminPinSubmit");
  const adminInfoForm = document.getElementById("adminInfoForm");

  const pinDigits = [
    document.getElementById("adminPin1"),
    document.getElementById("adminPin2"),
    document.getElementById("adminPin3"),
    document.getElementById("adminPin4")
  ];

  // Admin Config Inputs
  const cfgChildName = document.getElementById("cfgChildName");
  const cfgChildFullName = document.getElementById("cfgChildFullName");
  const cfgAge = document.getElementById("cfgAge");
  const cfgBirthDate = document.getElementById("cfgBirthDate");
  const cfgEventAddress = document.getElementById("cfgEventAddress");
  const cfgAdminPin = document.getElementById("cfgAdminPin");
  const cfgGiftBank = document.getElementById("cfgGiftBank");
  const cfgGiftNumber = document.getElementById("cfgGiftNumber");
  const cfgGiftName = document.getElementById("cfgGiftName");
  const cfgFunQuote = document.getElementById("cfgFunQuote");
  const cfgFunQuoteAuthor = document.getElementById("cfgFunQuoteAuthor");

  // Supabase Config Tab Elements
  const adminSupabaseForm = document.getElementById("adminSupabaseForm");
  const cfgSupaUrl = document.getElementById("cfgSupaUrl");
  const cfgSupaKey = document.getElementById("cfgSupaKey");
  const resetSupaBtn = document.getElementById("resetSupaBtn");

  // Admin Album CRUD
  const adminAlbumForm = document.getElementById("adminAlbumForm");
  const newMediaFile = document.getElementById("newMediaFile");
  const newMediaLabel = document.getElementById("newMediaLabel");
  const newMediaEmoji = document.getElementById("newMediaEmoji");
  const adminMediaList = document.getElementById("adminMediaList");

  // Admin Songs CRUD
  const adminSongForm = document.getElementById("adminSongForm");
  const newSongTitle = document.getElementById("newSongTitle");
  const newSongArtist = document.getElementById("newSongArtist");
  const newSongUrl = document.getElementById("newSongUrl");
  const adminSongsList = document.getElementById("adminSongsList");

  // Session Profile
  const guestName = sessionStorage.getItem("guestName") || "Tamu Istimewa";
  const guestAddress = sessionStorage.getItem("guestAddress") || "Lautan Cinta";

  // State Variables
  const defaultSupabaseConfig = (typeof SUPABASE_CONFIG !== "undefined" && SUPABASE_CONFIG)
    ? SUPABASE_CONFIG
    : { url: "", anonKey: "" };
  let localSupaUrl = localStorage.getItem("supabase_url");
  let localSupaKey = localStorage.getItem("supabase_anonKey");

  let activeSupaUrl = localSupaUrl || defaultSupabaseConfig.url || "";
  let activeSupaKey = localSupaKey || defaultSupabaseConfig.anonKey || "";

  let isSupabaseConfigured = Boolean(
    activeSupaUrl &&
    activeSupaKey &&
    activeSupaKey !== "MASUKKAN_SUPABASE_ANON_KEY_ANDA_DI_SINI"
  );
  let supabase = null;
  let eventInfoState = {
    child_name: "Jimbuy",
    child_full_name: "Aghnia Azkayla Nadhifa",
    age: 2,
    birth_date: "29 Juni 2024 Surabaya",
    event_date: "Minggu, 28 Juni 2026",
    event_time: "18.00 WIB - Selesai",
    event_venue: "Rumah Kayla",
    event_address: "Jl. Setro 5 no 38-A, Surabaya, Jawa Timur",
    google_maps_url: "https://maps.app.goo.gl/C6QYsDA3QMtcsyks6",
    dress_code: "Ocean Blue & Sea Creatures 🌊🦈",
    admin_pin: "2906",
    gift_bank: "",
    gift_number: "",
    gift_name: "",
    fun_quote: "Dua tahun berenang di lautan cinta! 🌊 Si kecil Baby Shark yang selalu bikin tersenyum.",
    fun_quote_author: "— Mommy & Daddy Shark 🦈💕"
  };

  let wishesData = [];
  let albumItems = [
    { file_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", label: "Penyelaman Pertama", type: "photo", emoji: "🦈" },
    { file_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", label: "Pantai Pasir Putih", type: "photo", emoji: "🐚" },
    { file_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80", label: "Berenang Bebas", type: "photo", emoji: "🐠" },
    { file_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", label: "Naik Kapal Laut", type: "photo", emoji: "🚢" },
    { file_url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80", label: "Terumbu Karang", type: "photo", emoji: "🪸" },
    { file_url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80", label: "Lumba-Lumba Lompat", type: "photo", emoji: "🐬" },
    { file_url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80", label: "Gurita Lucu", type: "photo", emoji: "🐙" },
    { file_url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80", label: "Ubur-Ubur Bersinar", type: "photo", emoji: "🪼" },
    { file_url: "https://images.unsplash.com/photo-1601579899389-15529c28583a?auto=format&fit=crop&w=800&q=80", label: "Penyu Berenang", type: "photo", emoji: "🐢" },
    { file_url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80", label: "Makan Kue Ulang Tahun", type: "photo", emoji: "🎂" },
    { file_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80", label: "Senyum Ceria Kayla", type: "photo", emoji: "😊" },
    { file_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80", label: "Main Air", type: "photo", emoji: "💦" },
    { file_url: "https://images.unsplash.com/photo-1530652101053-8c0db4fbb5de?auto=format&fit=crop&w=800&q=80", label: "Ikan Mas Koki", type: "photo", emoji: "🐠" },
    { file_url: "https://images.unsplash.com/photo-1503642551022-c011aafb3c88?auto=format&fit=crop&w=800&q=80", label: "Sunset Indah", type: "photo", emoji: "🌅" },
    { file_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80", label: "Pesta Balon", type: "photo", emoji: "🎈" },
    { file_url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80", label: "Bintang Laut", type: "photo", emoji: "⭐" },
    { file_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", label: "Pita Warna-Warni", type: "photo", emoji: "🎉" },
    { file_url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80", label: "Istana Pasir", type: "photo", emoji: "🏰" },
    { file_url: "public/images/video1.mp4", label: "Kayla Tertawa Lucu", type: "video", emoji: "🎬" },
    { file_url: "public/images/video2.mp4", label: "Bermain Bersama Kakak", type: "video", emoji: "👶" }
  ];

  const defaultAlbumItems = albumItems.map(item => ({ ...item }));

  function mergeAlbumItems(remoteItems) {
    const seen = new Set();
    return [...defaultAlbumItems, ...(Array.isArray(remoteItems) ? remoteItems : [])].filter((item) => {
      const key = item.file_url || `${item.label || ""}-${item.type || ""}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getStorageObjectPath(url) {
    const value = String(url || "").trim();
    if (/^items\/[^"'<>\\\s]+$/i.test(value)) return value;
    const publicMarker = "/storage/v1/object/public/album/";
    const signedMarker = "/storage/v1/object/sign/album/";
    if (value.includes(publicMarker)) {
      return decodeURIComponent((value.split(publicMarker)[1] || "").split("?")[0]);
    }
    if (value.includes(signedMarker)) {
      return decodeURIComponent((value.split(signedMarker)[1] || "").split("?")[0]);
    }
    return "";
  }

  let playlist = [
    { title: "Baby Shark", artist: "Pinkfong", url: "public/audio/baby-shark.mp3", is_youtube: false }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentVolume = 1.0;
  let progressInterval = null;

  // Initialize Supabase
  if (isSupabaseConfigured && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      supabase = window.supabase.createClient(activeSupaUrl, activeSupaKey);
    } catch (e) {
      console.error("Gagal inisialisasi Supabase client:", e);
      isSupabaseConfigured = false;
    }
  } else {
    if (isSupabaseConfigured) {
      console.warn("Supabase CDN belum tersedia. Menggunakan data statis fallback.");
    } else {
      console.warn("Supabase tidak dikonfigurasi. Menggunakan data statis fallback.");
    }
    isSupabaseConfigured = false;
  }

  // ==========================================
  // 1. DATA AND VIEW BINDING
  // ==========================================
  async function loadAllData() {
    if (isSupabaseConfigured) {
      try {
        // Fetch Event Info
        let { data: eventData, error: eventErr } = await supabase
          .from("event_info")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (eventErr || !eventData) {
          // Self-healing default row
          const defaultRow = {
            id: 1,
            child_name: "Jimbuy",
            child_full_name: "Aghnia Azkayla Nadhifa",
            age: 2,
            birth_date: "29 Juni 2024 Surabaya",
            event_date: "Minggu, 28 Juni 2026",
            event_time: "18.00 WIB - Selesai",
            event_venue: "Rumah Kayla",
            event_address: "Jl. Setro 5 no 38-A, Surabaya, Jawa Timur",
            google_maps_url: "https://maps.app.goo.gl/C6QYsDA3QMtcsyks6",
            dress_code: "Ocean Blue & Sea Creatures 🌊🦈",
            admin_pin: "2906",
            gift_bank: "",
            gift_number: "",
            gift_name: "",
            fun_quote: "Dua tahun berenang di lautan cinta! 🌊 Si kecil Baby Shark yang selalu bikin tersenyum.",
            fun_quote_author: "— Mommy & Daddy Shark 🦈💕"
          };

          const { error: insertErr } = await supabase
            .from("event_info")
            .insert([defaultRow]);

          if (!insertErr) {
            eventInfoState = defaultRow;
          } else {
            console.error("Gagal melakukan self-healing event_info:", insertErr);
          }
        } else {
          eventInfoState = eventData;
        }

        // Fetch Wishes
        const { data: wishes, error: wishErr } = await supabase
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: false });

        if (wishes && !wishErr) {
          wishesData = wishes;
        }

        // Fetch Album
        const { data: album, error: albumErr } = await supabase
          .from("album")
          .select("*")
          .order("created_at", { ascending: true });

        if (!albumErr) {
          albumItems = mergeAlbumItems(album || []);
        }

        // Fetch Songs
        const { data: songs, error: songErr } = await supabase
          .from("songs")
          .select("*")
          .order("created_at", { ascending: true });

        if (songs && songs.length > 0 && !songErr) {
          playlist = songs;
        }
      } catch (err) {
        console.error("Error fetching Supabase data:", err);
        isSupabaseConfigured = false;
        wishesData = [];
      }
    } else {
      wishesData = [];
    }

    populateInfo();
    prepareBirthdayPhoto();
    renderAlbum();
    renderPublicWishes();
    syncSnails();
  }

  function populateInfo() {
    // Dynamic Welcome Card
    chipName.textContent = `Halo, ${guestName}! 🫧`;
    guestNameDisplay.textContent = guestName + "!";

    document.getElementById("cardRecipientName").textContent = guestName;

    childNameWelcome.textContent = eventInfoState.child_name;
    childAge.textContent = eventInfoState.age;

    // Dynamic About Details
    aboutTitle.textContent = eventInfoState.child_full_name;
    aboutName.textContent = eventInfoState.child_full_name;
    aboutBirth.textContent = eventInfoState.birth_date;
    aboutAge.textContent = eventInfoState.age + " Tahun!";
    polaroidCaption.textContent = `Baby Shark ${eventInfoState.child_name} — ${eventInfoState.age} Tahun! 🎂`;

    // Dynamic Timeline Descriptions
    const timeline0 = document.getElementById("timeline0");
    const timeline6 = document.getElementById("timeline6");
    const timeline12 = document.getElementById("timeline12");
    const timeline24 = document.getElementById("timeline24");
    if (timeline0) timeline0.textContent = `Kehadiran putri kecil ${eventInfoState.child_full_name} membawa kehangatan dan kebahagiaan tak terhingga di tengah keluarga.`;
    if (timeline6) timeline6.textContent = `${eventInfoState.child_name} mulai belajar MPASI pertamanya dengan sangat lahap dan sudah bisa tengkurap serta berguling sendiri!`;
    if (timeline12) timeline12.textContent = `Langkah kaki pertama ${eventInfoState.child_name} yang menggemaskan! ${eventInfoState.child_name} juga mulai bisa memanggil mama, papa, dan menirukan suara ikan.`;
    if (timeline24) timeline24.textContent = `Menjadi si kecil ${eventInfoState.child_name} (Baby Shark) kesayangan yang aktif berlarian, bernyanyi, dan menari doo doo doo di lautan cinta!`;

    const milestoneChildName = document.getElementById("milestoneChildName");
    if (milestoneChildName) milestoneChildName.textContent = eventInfoState.child_name;

    // Dynamic Quote
    const funQuoteText = document.getElementById("funQuoteText");
    const funQuoteAuthor = document.getElementById("funQuoteAuthor");
    if (funQuoteText) funQuoteText.textContent = `"${eventInfoState.fun_quote || 'Dua tahun berenang di lautan cinta! 🌊 Si kecil Baby Shark yang selalu bikin tersenyum.'}"`;
    if (funQuoteAuthor) funQuoteAuthor.textContent = eventInfoState.fun_quote_author || '— Mommy & Daddy Shark 🦈💕';

    // Personal Greeting Card
    const cardRecipientName = document.getElementById("cardRecipientName");
    const cardChildName = document.getElementById("cardChildName");
    const cardFromFamily = document.getElementById("cardFromFamily");
    if (cardRecipientName) cardRecipientName.textContent = guestName;
    if (cardChildName) cardChildName.textContent = eventInfoState.child_name;
    if (cardFromFamily) cardFromFamily.textContent = `— Keluarga Baby Shark ${eventInfoState.child_name} 🦈💕`;

    // Polaroid Thumbnail (Use first album image if available, else emoji)
    if (!albumItems || albumItems.length === 0) albumItems = mergeAlbumItems([]);
    const firstPhoto = albumItems.find(a => a.type === "photo" && safeMediaUrl(a.file_url));
    const invitePhotoFrame = document.getElementById("invitePhotoFrame");
    const invitePhotoCaption = document.getElementById("invitePhotoCaption");
    if (firstPhoto && invitePhotoFrame) {
      invitePhotoFrame.innerHTML = `<img src="${safeMediaUrl(firstPhoto.file_url)}" alt="Foto Kayla" />`;
    }
    if (invitePhotoCaption) invitePhotoCaption.textContent = `Baby Shark ${eventInfoState.child_name} ? ${eventInfoState.age} Tahun!`;

    if (firstPhoto && polaroidImg) {
      polaroidImg.innerHTML = `<img src="${safeMediaUrl(firstPhoto.file_url)}" alt="Kayla Photo" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" />`;
    } else if (polaroidImg) {
      polaroidImg.innerHTML = `<span>🦈</span><small style="font-size:0.7rem;color:var(--text-muted)">Foto Kayla</small>`;
    }

    // Event Info (Fallback text bindings if elements exist)
    if (eventDate) eventDate.textContent = eventInfoState.event_date;
    if (eventTime) eventTime.textContent = eventInfoState.event_time;
    if (eventVenue) eventVenue.textContent = eventInfoState.event_venue;
    if (eventAddress) eventAddress.textContent = eventInfoState.event_address;
    if (eventDresscode) eventDresscode.textContent = eventInfoState.dress_code;
    if (mapsBtn) mapsBtn.href = eventInfoState.google_maps_url;
    if (wishName) wishName.value = guestName !== "Tamu Istimewa" ? guestName : "";

    // Virtual Gift Details Setup
    const isGiftConfigured = eventInfoState.gift_bank && eventInfoState.gift_bank.trim() !== "";
    if (isGiftConfigured) {
      if (giftChestWrapper) giftChestWrapper.style.display = "block";
      if (giftBankName) giftBankName.textContent = eventInfoState.gift_bank;
      if (giftAccountNumber) giftAccountNumber.textContent = eventInfoState.gift_number;
      if (giftAccountName) giftAccountName.textContent = eventInfoState.gift_name;
      if (copyBankBtn) copyBankBtn.setAttribute("data-copy", eventInfoState.gift_number);
    } else {
      if (giftChestWrapper) giftChestWrapper.style.display = "none";
    }

    if (giftAddressText) giftAddressText.textContent = eventInfoState.event_address;
    if (copyAddressBtn) copyAddressBtn.setAttribute("data-copy", eventInfoState.event_address);

    const footerName = document.getElementById("footerChildName");
    if (footerName) footerName.textContent = eventInfoState.child_name;
  }

  // ==========================================
  // 2. COUNTDOWN TIMER
  // ==========================================
  function startCountdown() {
    // Target date set to June 28, 2026
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

  // ==========================================
  // 3. PHOTO & VIDEO ALBUM GRID
  // ==========================================
  function shuffleAlbumItems(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAlbumBubbleSizeClass(index) {
    const pattern = ["bubble-xl", "bubble-xs", "bubble-md", "bubble-lg", "bubble-sm", "bubble-xxl", "bubble-sm", "bubble-lg", "bubble-xs", "bubble-md"];
    return pattern[index % pattern.length];
  }

  function getAlbumBubbleLayout(index, total) {
    const isMobile = window.innerWidth <= 560;
    const isTablet = window.innerWidth > 560 && window.innerWidth <= 980;
    const mobileSlots = [
      [24, 9], [74, 13], [48, 24], [22, 36], [76, 43],
      [48, 55], [23, 68], [75, 74], [47, 86], [24, 96]
    ];
    const tabletSlots = [
      [14, 16], [42, 12], [72, 16], [88, 34],
      [24, 42], [55, 40], [78, 56], [14, 66],
      [42, 72], [66, 82], [88, 88]
    ];
    const desktopSlots = [
      [8, 18], [25, 10], [43, 18], [61, 10], [79, 18], [94, 28],
      [15, 42], [34, 34], [53, 44], [72, 34], [90, 52],
      [8, 68], [25, 82], [43, 68], [61, 84], [79, 68], [94, 84],
      [19, 58], [50, 58], [83, 78]
    ];
    const slots = isMobile ? mobileSlots : isTablet ? tabletSlots : desktopSlots;
    const base = slots[index % slots.length];
    const jitterX = isMobile ? 2.5 : 1.5;
    const jitterY = isMobile ? 2 : 1.5;
    const x = Math.max(6, Math.min(94, base[0] + (Math.random() * jitterX * 2 - jitterX)));
    const y = Math.max(6, Math.min(96, base[1] + (Math.random() * jitterY * 2 - jitterY)));
    return { x, y };
  }

  function renderAlbumBackgroundLife() {
    const section = document.getElementById("albumSection");
    if (!section || section.querySelector(".album-life-layer")) return;

    const layer = document.createElement("div");
    layer.className = "album-life-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<span class="album-life fish f1">\u{1F420}</span>' +
      '<span class="album-life fish f2">\u{1F41F}</span>' +
      '<span class="album-life fish f3">\u{1F421}</span>' +
      '<span class="album-life fish f4">\u{1F42C}</span>' +
      '<span class="album-life creature c1">\u{1F419}</span>' +
      '<span class="album-life creature c2">\u{1F980}</span>' +
      '<span class="album-life creature c3">\u{1F988}</span>' +
      '<span class="album-life submarine">\u{1F6F8}</span>' +
      '<span class="album-life ship s1">\u{26F5}</span>' +
      '<span class="album-life ship s2">\u{1F6A2}</span>' +
      '<span class="album-life bird b1">\u{1F426}</span>' +
      '<span class="album-life bird b2">\u{1F426}</span>' +
      '<span class="album-life shell sh1">\u{1F41A}</span>' +
      '<span class="album-life shell sh2">\u{1FAB8}</span>' +
      '<span class="album-life shell sh3">\u{1F40C}</span>' +
      '<span class="album-life bubble bb1"></span>' +
      '<span class="album-life bubble bb2"></span>' +
      '<span class="album-life bubble bb3"></span>';
    section.prepend(layer);
  }

  function renderAlbum() {
    renderAlbumBackgroundLife();
    if (!albumGrid) return;
    if (!albumItems || albumItems.length === 0) albumItems = mergeAlbumItems([]);
    albumGrid.innerHTML = "";
    const displayAlbumItems = shuffleAlbumItems(albumItems);
    displayAlbumItems.forEach((a, i) => {
      const isVideo = a.type === "video";
      const item = document.createElement("div");
      item.className = "album-item album-bubble " + getAlbumBubbleSizeClass(i);
      const bubbleLayout = getAlbumBubbleLayout(i, displayAlbumItems.length);
      item.style.setProperty("--bubble-x", bubbleLayout.x + "%");
      item.style.setProperty("--bubble-y", bubbleLayout.y + "%");
      item.style.setProperty("--bubble-delay", (-Math.random() * 5).toFixed(2) + "s");
      item.style.setProperty("--bubble-drift", (Math.random() * 18 - 9).toFixed(1) + "px");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", a.label || "Media Item");
      item.setAttribute("tabindex", "0");

      let inner = `<div class="album-item-inner">`;

      if (isVideo) {
        inner += `<video src="${safeMediaUrl(a.file_url)}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0"></video>`;
        inner += `<div class="video-overlay"><div class="play-btn-circle">▶</div></div>`;
      } else {
        inner += `<img src="${safeMediaUrl(a.file_url)}" alt="${escapeHtml(a.label)}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />`;
        inner += `<div style="display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%">
          <span class="album-emoji">${escapeHtml(a.emoji || "🦈")}</span>
          <span class="album-label">${escapeHtml(a.label || "Momen")}</span>
        </div>`;
      }

      inner += `</div>`;
      item.innerHTML = inner;

      const originalIndex = albumItems.indexOf(a);
      item.addEventListener("click", () => openLightbox(originalIndex, isVideo));
      item.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(originalIndex, isVideo); });
      albumGrid.appendChild(item);
    });
  }

  function ensureAlbumRendered() {
    const grid = document.getElementById("albumGrid");
    if (!grid) return;
    if (!albumItems || albumItems.length === 0) albumItems = mergeAlbumItems([]);
    if (grid.children.length === 0 && albumItems.length > 0) renderAlbum();
  }

  setTimeout(ensureAlbumRendered, 300);
  setTimeout(ensureAlbumRendered, 1200);

  let albumResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(albumResizeTimer);
    albumResizeTimer = setTimeout(() => {
      const grid = document.getElementById("albumGrid");
      if (grid && grid.children.length > 0) renderAlbum();
    }, 250);
  });

  function openLightbox(index, isVideo) {
    lightboxContent.innerHTML = "";
    const a = albumItems[index];

    if (isVideo) {
      const video = document.createElement("video");
      video.src = safeMediaUrl(a.file_url);
      video.controls = true;
      video.autoplay = true;
      video.style.cssText = "max-width:90vw;max-height:82dvh;border-radius:14px;";
      lightboxContent.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = safeMediaUrl(a.file_url);
      img.alt = a.label || "Photo Detail";
      img.style.cssText = "max-width:90vw;max-height:82dvh;border-radius:14px;";
      img.onerror = function () {
        this.remove();
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;text-align:center;padding:40px;gap:16px;min-height:300px;";
        wrapper.innerHTML = `<div style="font-size:6rem">${escapeHtml(a.emoji || "🦈")}</div><div style="font-family:var(--font-display);font-size:1.3rem;font-weight:700">${escapeHtml(a.label || "Momen")}</div><div style="background:rgba(255,255,255,0.15);padding:8px 20px;border-radius:999px;font-size:0.85rem">📸 Media belum termuat</div>`;
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

  // ==========================================
  // 4. HYBRID MUSIC PLAYER (LOCAL & YOUTUBE)
  // ==========================================
  const bgMusic = document.getElementById("bgMusic");
  const playBtn = document.getElementById("playBtn");
  const volUp = document.getElementById("volUp");
  const volDown = document.getElementById("volDown");
  const progressFill = document.getElementById("progressFill");
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");
  const volumeDisplay = document.getElementById("volumeDisplay");
  const musicDisc = document.getElementById("musicDisc");
  const musicTitle = document.getElementById("musicTitle");
  const musicArtist = document.getElementById("musicArtist");

  // Load YouTube IFrame API
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  let ytPlayer = null;
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player("ytPlayer", {
      height: "1",
      width: "1",
      videoId: "",
      playerVars: {
        "playsinline": 1,
        "controls": 0,
        "disablekb": 1,
        "fs": 0,
        "rel": 0,
        "modestbranding": 1
      },
      events: {
        "onStateChange": onPlayerStateChange
      }
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      playNext();
    }
  }

  function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function playTrack(index) {
    if (playlist.length === 0) return;
    currentTrackIndex = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrackIndex];

    musicTitle.textContent = track.title;
    musicArtist.textContent = track.artist;
    musicDisc.classList.add("spinning");
    playBtn.textContent = "⏸️";
    isPlaying = true;

    if (track.is_youtube) {
      bgMusic.pause();
      const ytId = getYoutubeId(track.url);
      if (ytId) {
        if (ytPlayer && ytPlayer.loadVideoById) {
          ytPlayer.loadVideoById(ytId);
          ytPlayer.setVolume(currentVolume * 100);
        } else {
          setTimeout(() => {
            if (ytPlayer && ytPlayer.loadVideoById) {
              ytPlayer.loadVideoById(ytId);
              ytPlayer.setVolume(currentVolume * 100);
            }
          }, 1000);
        }
      }
    } else {
      if (ytPlayer && ytPlayer.pauseVideo) {
        try { ytPlayer.pauseVideo(); } catch (e) {}
      }
      bgMusic.src = track.url;
      bgMusic.volume = currentVolume;
      bgMusic.play().catch(() => {
        showToast("Ketuk tombol Play untuk memulai musik! 🎵");
      });
    }

    startProgressTimer();
  }

  function playNext() {
    playTrack(currentTrackIndex + 1);
  }

  function playPrev() {
    playTrack(currentTrackIndex - 1);
  }

  function startProgressTimer() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      const track = playlist[currentTrackIndex];
      let cur = 0;
      let dur = 0;

      if (track.is_youtube) {
        if (ytPlayer && ytPlayer.getCurrentTime) {
          cur = ytPlayer.getCurrentTime();
          dur = ytPlayer.getDuration() || 0;
        }
      } else {
        cur = bgMusic.currentTime;
        dur = bgMusic.duration || 0;
      }

      if (dur > 0) {
        const pct = (cur / dur) * 100;
        progressFill.style.width = pct + "%";
        currentTimeEl.textContent = formatTime(cur);
        totalTimeEl.textContent = formatTime(dur);
      }
    }, 500);
  }

  // Local audio ended event
  bgMusic.loop = false;
  bgMusic.addEventListener("ended", playNext);

  // Play controls
  playBtn.addEventListener("click", () => {
    if (playlist.length === 0) return;
    const track = playlist[currentTrackIndex];

    if (isPlaying) {
      if (track.is_youtube) {
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
      } else {
        bgMusic.pause();
      }
      playBtn.textContent = "▶️";
      musicDisc.classList.remove("spinning");
    } else {
      if (track.is_youtube) {
        if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
      } else {
        bgMusic.play().catch(() => {});
      }
      playBtn.textContent = "⏸️";
      musicDisc.classList.add("spinning");
    }
    isPlaying = !isPlaying;
  });

  document.getElementById("nextBtn").addEventListener("click", playNext);
  document.getElementById("prevBtn").addEventListener("click", playPrev);

  volUp.addEventListener("click", () => {
    currentVolume = Math.min(1.0, currentVolume + 0.1);
    updateVolume();
  });

  volDown.addEventListener("click", () => {
    currentVolume = Math.max(0.0, currentVolume - 0.1);
    updateVolume();
  });

  function updateVolume() {
    const pct = Math.round(currentVolume * 100);
    const icon = pct === 0 ? "🔇" : pct < 50 ? "🔉" : "🔊";
    volumeDisplay.textContent = icon + " " + pct + "%";

    const track = playlist[currentTrackIndex];
    if (track && track.is_youtube) {
      if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(currentVolume * 100);
    } else {
      bgMusic.volume = currentVolume;
    }
  }

  progressBar.addEventListener("click", (e) => {
    const track = playlist[currentTrackIndex];
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;

    if (track.is_youtube) {
      if (ytPlayer && ytPlayer.getDuration) {
        const dur = ytPlayer.getDuration();
        ytPlayer.seekTo(pct * dur, true);
      }
    } else {
      if (bgMusic.duration) {
        bgMusic.currentTime = pct * bgMusic.duration;
      }
    }
  });

  // ==========================================
  // 5. SECURE PIN AUTHENTICATION & CRUD OVERLAYS
  // ==========================================
  adminLink.addEventListener("click", (e) => {
    e.preventDefault();
    adminPinError.textContent = "";
    pinDigits.forEach(p => p.value = "");
    adminPinScreen.style.display = "flex";
    adminDashboardArea.style.display = "none";
    adminModal.style.display = "flex";
    pinDigits[0].focus();
  });

  adminModalClose.addEventListener("click", () => adminModal.style.display = "none");
  adminModalBackdrop.addEventListener("click", () => adminModal.style.display = "none");

  // Digit auto tab focusing
  pinDigits.forEach((p, idx) => {
    p.addEventListener("input", () => {
      if (p.value.length === 1 && idx < 3) {
        pinDigits[idx + 1].focus();
      }
    });
    p.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !p.value && idx > 0) {
        pinDigits[idx - 1].focus();
      }
      if (e.key === "Enter" && idx === 3) {
        verifyAdminPin();
      }
    });
  });

  adminPinSubmit.addEventListener("click", verifyAdminPin);

  function verifyAdminPin() {
    const pin = pinDigits.map(p => p.value).join("");
    if (pin === eventInfoState.admin_pin) {
      adminPinScreen.style.display = "none";
      adminDashboardArea.style.display = "flex";
      populateAdminFields();
      renderAdminMediaList();
      renderAdminSongsList();
      renderAdminWishesList();
    } else {
      adminPinError.textContent = "❌ PIN Keamanan Salah!";
      pinDigits.forEach(p => {
        p.value = "";
        p.style.borderColor = "#FF6B6B";
      });
      pinDigits[0].focus();
      setTimeout(() => {
        pinDigits.forEach(p => p.style.borderColor = "");
        adminPinError.textContent = "";
      }, 2000);
    }
  }

  // Populate info fields in Tab 1
  function populateAdminFields() {
    cfgChildName.value = eventInfoState.child_name;
    cfgChildFullName.value = eventInfoState.child_full_name;
    cfgAge.value = eventInfoState.age;
    cfgBirthDate.value = eventInfoState.birth_date;
    cfgEventAddress.value = eventInfoState.event_address;
    cfgAdminPin.value = eventInfoState.admin_pin;
    cfgGiftBank.value = eventInfoState.gift_bank || "";
    cfgGiftNumber.value = eventInfoState.gift_number || "";
    cfgGiftName.value = eventInfoState.gift_name || "";
    if (cfgFunQuote) cfgFunQuote.value = eventInfoState.fun_quote || "";
    if (cfgFunQuoteAuthor) cfgFunQuoteAuthor.value = eventInfoState.fun_quote_author || "";

    // Supabase Config fields
    if (cfgSupaUrl) cfgSupaUrl.value = activeSupaUrl || "";
    if (cfgSupaKey) cfgSupaKey.value = (activeSupaKey && activeSupaKey !== "MASUKKAN_SUPABASE_ANON_KEY_ANDA_DI_SINI") ? activeSupaKey : "";
  }

  // Save Tab 1: Event Info
  adminInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updated = {
      child_name: cfgChildName.value.trim(),
      child_full_name: cfgChildFullName.value.trim(),
      age: parseInt(cfgAge.value),
      birth_date: cfgBirthDate.value.trim(),
      event_date: eventInfoState.event_date || "Minggu, 28 Juni 2026",
      event_time: eventInfoState.event_time || "18.00 WIB - Selesai",
      event_venue: eventInfoState.event_venue || "Rumah Kayla",
      event_address: cfgEventAddress.value.trim(),
      google_maps_url: eventInfoState.google_maps_url || "https://maps.app.goo.gl/C6QYsDA3QMtcsyks6",
      dress_code: eventInfoState.dress_code || "Ocean Blue & Sea Creatures 🌊🦈",
      admin_pin: cfgAdminPin.value.trim(),
      gift_bank: cfgGiftBank.value.trim(),
      gift_number: cfgGiftNumber.value.trim(),
      gift_name: cfgGiftName.value.trim(),
      fun_quote: cfgFunQuote ? cfgFunQuote.value.trim() : "",
      fun_quote_author: cfgFunQuoteAuthor ? cfgFunQuoteAuthor.value.trim() : ""
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("event_info")
        .upsert([{ id: 1, ...updated }], { onConflict: "id" });

      if (!error) {
        eventInfoState = { ...eventInfoState, ...updated };
        showToast("Pengaturan berhasil disimpan! 💾");
        populateInfo();
      } else {
        showToast("Gagal menyimpan ke database! ❌");
      }
    } else {
      eventInfoState = { ...eventInfoState, ...updated };
      showToast("Offline: Simpan lokal sukses! 💾");
      populateInfo();
    }
  });

  // Tab switching logic
  const adminTabButtons = document.querySelectorAll(".admin-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  adminTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      adminTabButtons.forEach(b => {
        b.classList.remove("active");
        b.style.color = "rgba(255,255,255,0.6)";
        b.style.borderBottomColor = "transparent";
      });
      tabPanes.forEach(p => {
        p.classList.remove("active");
        p.style.display = "none";
      });

      btn.classList.add("active");
      btn.style.color = "white";
      btn.style.borderBottomColor = "var(--aqua)";
      const target = btn.dataset.tab;
      const pane = document.getElementById(target);
      pane.classList.add("active");
      pane.style.display = "block";
    });
  });

  // Save Supabase Config Listener
  if (adminSupabaseForm) {
    adminSupabaseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const url = cfgSupaUrl.value.trim();
      const key = cfgSupaKey.value.trim();
      if (!url || !key) return;

      localStorage.setItem("supabase_url", url);
      localStorage.setItem("supabase_anonKey", key);
      showToast("Koneksi Supabase disimpan! Me-refresh halaman... 🔄");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  // Reset Supabase Config Listener
  if (resetSupaBtn) {
    resetSupaBtn.addEventListener("click", () => {
      localStorage.removeItem("supabase_url");
      localStorage.removeItem("supabase_anonKey");
      showToast("Reset koneksi berhasil! Me-refresh... 🔄");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  // Tab 2 CRUD Album
  function renderAdminMediaList() {
    if (!adminMediaList) return;
    if (!albumItems || albumItems.length === 0) albumItems = mergeAlbumItems([]);
    adminMediaList.innerHTML = "";
    albumItems.forEach((media) => {
      const item = document.createElement("div");
      item.className = "admin-list-item";
      item.innerHTML = `
        <span style="font-size:1.1rem">${escapeHtml(media.emoji || "🦈")}</span>
        <div class="admin-list-item-title">${escapeHtml(media.label)}</div>
        <span class="admin-list-item-meta">${escapeHtml(media.type)}</span>
        <button class="admin-delete-btn" title="Hapus Media">🗑️</button>
      `;

      item.querySelector(".admin-delete-btn").addEventListener("click", async () => {
        if (confirm(`Hapus media "${escapeHtml(media.label)}"?`)) {
          if (isSupabaseConfigured && media.id) {
            const { error } = await supabase
              .from("album")
              .delete()
              .eq("id", media.id);

            if (!error) {
              const pathPart = getStorageObjectPath(media.file_url);
              if (pathPart) {
                try {
                  await supabase.storage.from("album").remove([pathPart]);
                } catch (se) {
                  console.error("Storage delete error:", se);
                }
              }
              albumItems = albumItems.filter(a => a.id !== media.id);
              showToast("Media dihapus! 🗑️");
              renderAdminMediaList();
              renderAlbum();
            } else {
              showToast("Gagal menghapus! ❌");
            }
          } else {
            albumItems = albumItems.filter(a => a.file_url !== media.file_url);
            showToast("Offline: Media dihapus! 🗑️");
            renderAdminMediaList();
            renderAlbum();
          }
        }
      });

      adminMediaList.appendChild(item);
    });
  }

  if (adminAlbumForm) adminAlbumForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!newMediaFile.files || newMediaFile.files.length === 0) {
      showToast("Pilih file gambar/video terlebih dahulu! ⚠️");
      return;
    }

    const file = newMediaFile.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    showToast("Mengunggah media... ⏳");

    let fileUrl = "";
    const type = file.type.startsWith("video/") ? "video" : "photo";

    if (isSupabaseConfigured) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("album")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          showToast(`Gagal mengunggah file: ${uploadError.message} ❌`);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("album")
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
      } catch (err) {
        console.error("Storage upload catch error:", err);
        showToast("Terjadi kesalahan koneksi upload! ❌");
        return;
      }
    } else {
      // Offline fallback
      fileUrl = URL.createObjectURL(file);
    }

    const newMedia = {
      file_url: fileUrl,
      type: type,
      label: newMediaLabel.value.trim(),
      emoji: newMediaEmoji.value.trim() || "🦈"
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("album")
        .insert([newMedia])
        .select();

      if (!error && data) {
        albumItems.push(data[0]);
        showToast("Media berhasil diunggah & disimpan! ✨");
        newMediaFile.value = "";
        newMediaLabel.value = "";
        newMediaEmoji.value = "";
        renderAdminMediaList();
        renderAlbum();
      } else {
        console.error("Database insert error:", error);
        const pathPart = getStorageObjectPath(fileUrl);
        if (pathPart) {
          await supabase.storage.from("album").remove([pathPart]);
        }
        showToast(`Gagal menyimpan info media: ${error.message} ❌`);
      }
    } else {
      albumItems.push(newMedia);
      showToast("Offline: Media ditambahkan! ✨");
      newMediaFile.value = "";
      newMediaLabel.value = "";
      newMediaEmoji.value = "";
      renderAdminMediaList();
      renderAlbum();
    }
  });

  // Tab 3 CRUD Songs
  function renderAdminSongsList() {
    adminSongsList.innerHTML = "";
    playlist.forEach((song) => {
      const item = document.createElement("div");
      item.className = "admin-list-item";
      item.innerHTML = `
        <span style="font-size:1.1rem">${song.is_youtube ? "🎥" : "🎵"}</span>
        <div class="admin-list-item-title">${escapeHtml(song.title)}</div>
        <span class="admin-list-item-meta">${escapeHtml(song.artist)}</span>
        <button class="admin-delete-btn" title="Hapus Lagu">🗑️</button>
      `;

      item.querySelector(".admin-delete-btn").addEventListener("click", async () => {
        if (isSupabaseConfigured && song.id) {
          const { error } = await supabase
            .from("songs")
            .delete()
            .eq("id", song.id);

          if (!error) {
            playlist = playlist.filter(s => s.id !== song.id);
            showToast("Lagu dihapus! 🗑️");
            renderAdminSongsList();
            if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
            // update UI title / controls
            if (playlist.length > 0) {
              musicTitle.textContent = playlist[currentTrackIndex].title;
              musicArtist.textContent = playlist[currentTrackIndex].artist;
            }
          } else {
            showToast("Gagal menghapus! ❌");
          }
        } else {
          playlist = playlist.filter(s => s.title !== song.title);
          showToast("Offline: Lagu dihapus! 🗑️");
          renderAdminSongsList();
          if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
          if (playlist.length > 0) {
            musicTitle.textContent = playlist[currentTrackIndex].title;
            musicArtist.textContent = playlist[currentTrackIndex].artist;
          }
        }
      });

      adminSongsList.appendChild(item);
    });
  }

  if (adminSongForm) adminSongForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newSong = {
      title: newSongTitle.value.trim(),
      artist: newSongArtist.value.trim(),
      url: newSongUrl.value.trim(),
      is_youtube: true
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("songs")
        .insert([newSong])
        .select();

      if (!error && data) {
        playlist.push(data[0]);
        showToast("Lagu ditambahkan ke Playlist! 🎵");
        newSongTitle.value = "";
        newSongArtist.value = "";
        newSongUrl.value = "";
        renderAdminSongsList();
      } else {
        showToast("Gagal menyimpan ke database! ❌");
      }
    } else {
      playlist.push(newSong);
      showToast("Offline: Lagu ditambahkan! 🎵");
      newSongTitle.value = "";
      newSongArtist.value = "";
      newSongUrl.value = "";
      renderAdminSongsList();
    }
  });

  // ==========================================
  // 6. GUEST WISH SUBMITTING
  // ==========================================
  if (wishForm) wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = wishName.value.trim();
    const message = wishMessage.value.trim();
    if (!name || !message) return;

    const newWish = {
      name: name,
      message: message,
      address: guestAddress,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("wishes")
        .insert([newWish])
        .select();

      if (!error && data) {
        wishesData.unshift(data[0]);
        wishMessage.value = "";
        showToast("Ucapan berhasil dikirim! 🫧🦈");
        if (window.confettiRain) confettiRain(2000, 3);

        // Blow a physical wish bubble immediately from first snail
        if (snails[0]) {
          spawnWish(snails[0].x, snails[0].y - 34, data[0]);
        }
        renderPublicWishes();
        renderAdminWishesList();
        syncSnails();
      } else {
        console.error("Database insert wish error:", error);
        showToast(`Gagal mengirim ucapan: ${error ? error.message : "Error"} ❌`);
      }
    } else {
      showToast("Database belum tersambung. Ucapan hanya dikirim jika Supabase aktif.");
    }
  });

  const emojiPicks = document.getElementById("emojiPicks");
  if (emojiPicks) emojiPicks.addEventListener("click", (e) => {
    if (e.target.classList.contains("emoji-pick-btn")) {
      const emoji = e.target.textContent;
      const pos = wishMessage.selectionStart || wishMessage.value.length;
      wishMessage.value = wishMessage.value.substring(0, pos) + emoji + wishMessage.value.substring(pos);
      wishMessage.focus();
      wishMessage.selectionStart = wishMessage.selectionEnd = pos + emoji.length;
    }
  });

  // Helper toasts & copies
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function setupClipboardCopy(btn) {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Salin sukses! 📋✨");
        }).catch(() => {
          showToast("Gagal menyalin! ❌");
        });
      }
    });
  }

  setupClipboardCopy(copyBankBtn);
  setupClipboardCopy(copyAddressBtn);

  // Peti Kado Virtual animations
  if (giftChestBtn) giftChestBtn.addEventListener("click", () => {
    giftChestBtn.classList.add("wobbling");
    setTimeout(() => {
      giftChestBtn.classList.remove("wobbling");
      giftModal.style.display = "flex";
    }, 850);
  });

  if (giftModalClose && giftModal) giftModalClose.addEventListener("click", () => giftModal.style.display = "none");
  if (giftModalBackdrop && giftModal) giftModalBackdrop.addEventListener("click", () => giftModal.style.display = "none");

  // ==========================================
  // 6.5. PUBLIC WISHES FEED & VISITOR TRACKER
  // ==========================================
  let wishesPerPage = 6;
  let visibleWishesCount = 6;

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeMediaUrl(url) {
    const value = String(url || "").trim();
    if (!value || /["'<>\s]/.test(value)) return "";
    if (/^(https?:\/\/|public\/|data:image\/|blob:)/i.test(value)) return value;
    return "";
  }

  function renderPublicWishes() {
    const grid = document.getElementById("publicWishesGrid");
    const empty = document.getElementById("publicWishEmpty");
    const loadMoreBtn = document.getElementById("loadMoreWishesBtn");

    if (!grid) return;
    grid.innerHTML = "";
    grid.style.display = "none";
    grid.setAttribute("hidden", "");
    grid.setAttribute("aria-hidden", "true");

    if (empty) {
      empty.style.display = "none";
      empty.setAttribute("hidden", "");
      empty.setAttribute("aria-hidden", "true");
    }

    if (loadMoreBtn) loadMoreBtn.style.display = "none";

    wishesData.forEach(wish => {
      const card = document.createElement("div");
      card.className = "wish-card bubble-card";

      const dateObj = new Date(wish.created_at);
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      card.innerHTML =
        '<div class="wish-card-bubble">' +
        '<p class="wish-card-message">"' + escapeHtml(wish.message) + '"</p>' +
        '<div class="wish-card-tail"></div>' +
        '</div>' +
        '<div class="wish-card-sender">' +
        '<span class="sender-name">' + escapeHtml(wish.name) + '</span>' +
        '<span class="sender-address">' + escapeHtml(wish.address || "Lautan Cinta") + '</span>' +
        '<span class="sender-time">' + formattedDate + '</span>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  // Hook up load more button
  const loadMoreWishesBtn = document.getElementById("loadMoreWishesBtn");
  if (loadMoreWishesBtn) {
    loadMoreWishesBtn.addEventListener("click", () => {
      visibleWishesCount += wishesPerPage;
      renderPublicWishes();
    });
  }

  // Admin Wishes tab rendering & handlers
  const adminWishesList = document.getElementById("adminWishesList");
  const adminWishesEmpty = document.getElementById("adminWishesEmpty");
  const statTotal = document.getElementById("statTotal");
  const statToday = document.getElementById("statToday");
  const exportWishesBtn = document.getElementById("exportWishesBtn");
  const exportWishesVideoBtn = document.getElementById("exportWishesVideoBtn");
  const wishVideoFormat = document.getElementById("wishVideoFormat");

  function renderAdminWishesList() {
    if (!adminWishesList) return;
    adminWishesList.innerHTML = "";

    // Calculate stats
    const totalCount = wishesData.length;
    if (statTotal) statTotal.textContent = totalCount;

    const todayStr = new Date().toDateString();
    const todayCount = wishesData.filter(w => new Date(w.created_at).toDateString() === todayStr).length;
    if (statToday) statToday.textContent = todayCount;

    if (totalCount === 0) {
      if (adminWishesEmpty) adminWishesEmpty.style.display = "block";
      return;
    } else {
      if (adminWishesEmpty) adminWishesEmpty.style.display = "none";
    }

    wishesData.forEach((wish) => {
      const item = document.createElement("div");
      item.className = "admin-list-item";

      const dateObj = new Date(wish.created_at);
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
      });

      item.innerHTML = `
        <span style="font-size:1.1rem">🫧</span>
        <div class="admin-list-item-title" style="flex:1; text-align:left;">
          <div style="font-weight:700; font-size:0.88rem; color:var(--yellow);">${escapeHtml(wish.name)} <span style="font-weight:400; font-size:0.72rem; color:rgba(255,255,255,0.5);">(${escapeHtml(wish.address || 'Lautan')})</span></div>
          <div style="font-size:0.8rem; color:white; margin-top:2px;">${escapeHtml(wish.message)}</div>
        </div>
        <span class="admin-list-item-meta" style="font-size:0.7rem; color:rgba(255,255,255,0.4); margin-right:8px;">${dateStr}</span>
        <button class="admin-delete-btn" title="Hapus Ucapan">🗑️</button>
      `;

      item.querySelector(".admin-delete-btn").addEventListener("click", async () => {
        if (confirm(`Hapus ucapan dari ${wish.name}?`)) {
          if (isSupabaseConfigured && wish.id) {
            const { error } = await supabase
              .from("wishes")
              .delete()
              .eq("id", wish.id);

            if (!error) {
              wishesData = wishesData.filter(w => w.id !== wish.id);
              showToast("Ucapan berhasil dihapus! 🗑️");
              renderAdminWishesList();
              renderPublicWishes();
              syncSnails();
            } else {
              showToast("Gagal menghapus ucapan! ❌");
            }
          } else {
            showToast("Database belum tersambung. Hapus ucapan hanya tersedia saat Supabase aktif.");
          }
        }
      });

      adminWishesList.appendChild(item);
    });
  }

  function wrapVideoText(context, text, maxWidth, maxLines) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      lines.length = maxLines;
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+$/, "")}...`;
    }
    return lines;
  }

  function drawWishesVideoFrame(context, width, height, bubbles, frame, totalFrames) {
    const progress = frame / totalFrames;
    const sea = context.createLinearGradient(0, 0, 0, height);
    sea.addColorStop(0, "#89dcff");
    sea.addColorStop(0.18, "#0786bd");
    sea.addColorStop(0.58, "#063b95");
    sea.addColorStop(1, "#050038");
    context.fillStyle = sea;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(255,255,255,0.18)";
    for (let i = 0; i < 7; i += 1) {
      const x = (i + 0.5) * width / 7;
      context.beginPath();
      context.moveTo(x - width * 0.025, height * 0.1);
      context.lineTo(x + width * 0.025, height * 0.1);
      context.lineTo(x + width * 0.08, height * 0.82);
      context.lineTo(x - width * 0.08, height * 0.82);
      context.closePath();
      context.fill();
    }

    context.textAlign = "center";
    context.font = `700 ${Math.max(20, width * 0.024)}px Arial`;
    ["fish", "fish", "ship", "sub", "fish", "bird"].forEach((label, i) => {
      const x = ((progress * width * (0.35 + i * 0.05)) + i * width * 0.19) % (width + 120) - 60;
      const y = height * (0.14 + (i % 4) * 0.13);
      context.fillStyle = "rgba(255,255,255,0.5)";
      context.fillText(label, x, y);
    });

    bubbles.forEach((bubble, i) => {
      const local = (progress + bubble.delay) % 1;
      const x = bubble.x * width + Math.sin(local * Math.PI * 2 + i) * width * 0.025;
      const y = height * (1.08 - local * 1.18);
      const r = bubble.r * Math.min(width, height);
      const glow = context.createRadialGradient(x, y, r * 0.1, x, y, r);
      glow.addColorStop(0, "rgba(255,255,255,0.74)");
      glow.addColorStop(0.48, "rgba(135,220,255,0.26)");
      glow.addColorStop(1, "rgba(160,235,255,0.08)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(190,245,255,0.58)";
      context.lineWidth = Math.max(2, r * 0.035);
      context.stroke();

      context.fillStyle = "rgba(255,255,255,0.78)";
      context.beginPath();
      context.arc(x - r * 0.32, y - r * 0.32, r * 0.16, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = `800 ${Math.max(14, r * 0.16)}px Arial`;
      const lines = wrapVideoText(context, bubble.wish.message, r * 1.35, 3);
      const lineHeight = Math.max(17, r * 0.2);
      lines.forEach((line, lineIndex) => {
        context.fillText(line, x, y - (lines.length - 1) * lineHeight * 0.5 + lineIndex * lineHeight);
      });
      context.fillStyle = "rgba(255,255,255,0.75)";
      context.font = `700 ${Math.max(12, r * 0.12)}px Arial`;
      context.fillText(bubble.wish.name || "Tamu", x, y + r * 0.45);
    });
  }

  async function exportWishesVideo(format) {
    if (wishesData.length === 0) {
      showToast("Tidak ada ucapan untuk diexport!");
      return;
    }
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      showToast("Browser ini belum mendukung export video otomatis.");
      return;
    }

    const isPortrait = format === "portrait";
    const width = isPortrait ? 720 : 1280;
    const height = isPortrait ? 1280 : 720;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext("2d");
    const durationMs = Math.max(9000, Math.min(24000, wishesData.length * 3000));
    const fps = 30;
    const totalFrames = Math.round(durationMs / 1000 * fps);
    const bubbles = wishesData.slice(0, 18).map((wish, i) => ({
      wish,
      x: 0.14 + ((i * 0.23) % 0.72),
      r: (isPortrait ? 0.082 : 0.075) + (i % 4) * 0.012,
      delay: (i * 0.17) % 1
    }));

    const mimeType = MediaRecorder.isTypeSupported("video/mp4")
      ? "video/mp4"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
    const extension = mimeType.includes("mp4") ? "mp4" : "webm";
    const stream = exportCanvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size) chunks.push(event.data);
    };

    showToast("Membuat video lautan ucapan...");
    const finished = new Promise((resolve) => {
      recorder.onstop = resolve;
    });
    recorder.start();

    let frame = 0;
    await new Promise((resolve) => {
      const tick = () => {
        drawWishesVideoFrame(exportCtx, width, height, bubbles, frame, totalFrames);
        frame += 1;
        if (frame <= totalFrames) {
          setTimeout(tick, 1000 / fps);
        } else {
          resolve();
        }
      };
      tick();
    });

    recorder.stop();
    await finished;
    stream.getTracks().forEach(track => track.stop());

    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lautan-gelembung-ucapan-${format}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Video ${format} berhasil diunduh.`);
  }

  if (exportWishesVideoBtn) {
    exportWishesVideoBtn.addEventListener("click", () => {
      exportWishesVideo(wishVideoFormat ? wishVideoFormat.value : "landscape");
    });
  }

  if (exportWishesBtn) {
    exportWishesBtn.addEventListener("click", () => {
      if (wishesData.length === 0) {
        showToast("Tidak ada ucapan untuk diexport! ⚠️");
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Nama,Alamat,Ucapan,Tanggal\n";

      wishesData.forEach(w => {
        const row = [
          w.id || "",
          `"${(w.name || "").replace(/"/g, '""')}"`,
          `"${(w.address || "").replace(/"/g, '""')}"`,
          `"${(w.message || "").replace(/"/g, '""')}"`,
          w.created_at || ""
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ucapan_ulang_tahun_kayla_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("CSV Berhasil diunduh! 📥✨");
    });
  }

  async function recordVisitor() {
    if (isSupabaseConfigured && guestName !== "Tamu Istimewa") {
      const visitorRecorded = sessionStorage.getItem("visitorRecorded");
      if (!visitorRecorded) {
        try {
          const { error } = await supabase.from("visitors").insert([
            { name: guestName, address: guestAddress }
          ]);
          if (!error) {
            sessionStorage.setItem("visitorRecorded", "true");
          }
        } catch (e) {
          console.error("Gagal mencatat data pengunjung:", e);
        }
      }
    }
  }

  // ==========================================
  // 7. CANVAS SCENE: UNDERWATER ANIMATIONS 🐚🫧
  // ==========================================
  // Assign canvas elements (declared at top)
  canvas = document.getElementById("wishTree");
  ctx = canvas.getContext("2d");
  wrapper = document.getElementById("treeWrapper");

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = wrapper ? wrapper.getBoundingClientRect() : { width: 0, height: 0 };
    const parentWidth = wrapper && wrapper.parentElement ? wrapper.parentElement.getBoundingClientRect().width : 0;
    const viewportFallback = Math.min(window.innerWidth - 40, 720);
    const w = Math.max(320, Math.round(rect.width || wrapper.clientWidth || parentWidth || viewportFallback || 600));
    const h = Math.max(340, Math.min(Math.round(w * 0.58), 520));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = "100%";
    canvas.style.height = h + "px";
    if (wrapper) wrapper.style.minHeight = h + "px";
    cw = w;
    ch = h;
  }

  function getBirthdayPhotoUrl() {
    const photo = albumItems.find(a => a.type === "photo" && safeMediaUrl(a.file_url));
    return photo ? safeMediaUrl(photo.file_url) : "";
  }

  function hideMissingAsset(img) {
    img.style.display = "none";
  }

  function addOceanAsset(container, src, className, index) {
    if (!src) return;
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.className = "ocean-asset " + className + (index ? " asset-" + index : "");
    img.onerror = () => hideMissingAsset(img);
    container.appendChild(img);
  }

  function renderUploadedOceanAssets() {
    const container = document.getElementById("oceanUploadAssets");
    const assets = window.SCENE_ASSETS;
    if (!container || !assets) return;
    container.innerHTML = "";

    addOceanAsset(container, assets.backgrounds && assets.backgrounds.ocean, "ocean-asset-bg");
    addOceanAsset(container, assets.backgrounds && assets.backgrounds.wave, "ocean-asset-wave");
    (assets.fish || []).forEach((src, i) => addOceanAsset(container, src, "ocean-asset-fish", i + 1));
    (assets.seaCreatures || []).forEach((src, i) => addOceanAsset(container, src, "ocean-asset-creature", i + 1));
    if (assets.ships) {
      addOceanAsset(container, assets.ships.submarine, "ocean-asset-submarine");
      addOceanAsset(container, assets.ships.ship, "ocean-asset-ship");
      addOceanAsset(container, assets.ships.boat, "ocean-asset-boat");
    }
    (assets.seaFloor || []).forEach((src, i) => addOceanAsset(container, src, "ocean-asset-floor", i + 1));
  }

  function prepareBirthdayPhoto() {
    const nextUrl = getBirthdayPhotoUrl();
    if (!nextUrl || nextUrl === birthdayPhotoUrl) return;
    birthdayPhotoUrl = nextUrl;
    birthdayPhotoImg = new Image();
    birthdayPhotoImg.crossOrigin = "anonymous";
    birthdayPhotoImg.src = nextUrl;
  }

  // --- Fish ---
  const FISH_PALETTE = ["#FFCA3A", "#FF595E", "#8AC926", "#4D96FF", "#9B5DE5", "#00BBF9", "#F15BB5"];

  function mkFish() {
    const r = Math.random() > 0.5;
    return {
      x: r ? -70 : cw + 70,
      y: SURFACE_Y + 42 + Math.random() * Math.max(80, ch - SURFACE_Y - 155),
      spd: 0.35 + Math.random() * 0.75,
      dir: r ? 1 : -1,
      size: 12 + Math.random() * 16,
      color: FISH_PALETTE[Math.floor(Math.random() * FISH_PALETTE.length)],
      accent: FISH_PALETTE[Math.floor(Math.random() * FISH_PALETTE.length)],
      kind: Math.floor(Math.random() * 4),
      wo: Math.random() * 6.28,
      wa: 6 + Math.random() * 14,
      ws: 0.45 + Math.random() * 0.9
    };
  }

  function initFish() {
    fishes = Array.from({ length: 18 }, () => {
      const f = mkFish();
      f.x = Math.random() * cw;
      return f;
    });
  }

  function drawVectorFish(c, f) {
    const s = f.size;
    c.save();
    c.fillStyle = f.color;
    c.strokeStyle = "rgba(255,255,255,.25)";
    c.lineWidth = 1;

    c.beginPath();
    c.ellipse(0, 0, s * 1.35, s * 0.72, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.beginPath();
    c.moveTo(-s * 1.2, 0);
    c.lineTo(-s * 2.0, -s * 0.65);
    c.lineTo(-s * 1.82, 0);
    c.lineTo(-s * 2.0, s * 0.65);
    c.closePath();
    c.fillStyle = f.accent;
    c.fill();

    if (f.kind % 2 === 0) {
      c.fillStyle = "rgba(255,255,255,.35)";
      for (let i = -1; i <= 1; i++) {
        c.beginPath();
        c.ellipse(-s * 0.2 + i * s * 0.38, 0, s * 0.08, s * 0.58, 0.25, 0, Math.PI * 2);
        c.fill();
      }
    } else {
      c.fillStyle = "rgba(255,255,255,.55)";
      c.beginPath();
      c.arc(-s * 0.1, -s * 0.05, s * 0.18, 0, Math.PI * 2);
      c.fill();
    }

    c.fillStyle = "#071B33";
    c.beginPath();
    c.arc(s * 0.65, -s * 0.18, Math.max(1.6, s * 0.13), 0, Math.PI * 2);
    c.fill();

    c.fillStyle = f.accent;
    c.beginPath();
    c.moveTo(-s * 0.15, -s * 0.58);
    c.quadraticCurveTo(s * 0.2, -s * 1.15, s * 0.55, -s * 0.42);
    c.closePath();
    c.fill();
    c.restore();
  }

  function drawFish(c) {
    fishes.forEach((f, i) => {
      f.x += f.spd * f.dir;
      const wy = Math.sin(t * f.ws + f.wo) * f.wa;
      if ((f.dir > 0 && f.x > cw + 95) || (f.dir < 0 && f.x < -95)) {
        fishes[i] = mkFish();
        return;
      }
      c.save();
      c.translate(f.x, f.y + wy);
      if (f.dir < 0) c.scale(-1, 1);
      drawVectorFish(c, f);
      c.restore();
    });
  }

  // --- Ambient bubbles ---
  function mkAmb() {
    return {
      x: Math.random() * cw,
      y: ch - 35,
      sz: 1.8 + Math.random() * 4.5,
      spd: 0.25 + Math.random() * 0.55,
      wo: Math.random() * 6.28,
      op: 0.12 + Math.random() * 0.22
    };
  }

  function initAmb() {
    ambBub = Array.from({ length: 35 }, () => {
      const b = mkAmb();
      b.y = SURFACE_Y + Math.random() * (ch - SURFACE_Y - 35);
      return b;
    });
  }

  function drawBubble(c, x, y, r, alpha = 1) {
    c.save();
    c.globalAlpha = alpha;
    c.beginPath();
    c.arc(x, y, r, 0, 6.28);
    c.strokeStyle = "rgba(173,232,244,.65)";
    c.lineWidth = 1;
    c.stroke();
    c.beginPath();
    c.arc(x - r * 0.28, y - r * 0.28, Math.max(1, r * 0.18), 0, 6.28);
    c.fillStyle = "rgba(255,255,255,.55)";
    c.fill();
    c.restore();
  }

  function drawAmb(c) {
    ambBub.forEach((b, i) => {
      b.y -= b.spd;
      b.wo += 0.025;
      const bx = b.x + Math.sin(b.wo) * 3;
      if (b.y < SURFACE_Y - 8) {
        ambBub[i] = mkAmb();
        return;
      }
      drawBubble(c, bx, b.y, b.sz, b.op);
    });
  }

  // --- Coral and shell bubble emitters ---
  const EMITTER_TYPES = ["coral", "shell", "coral", "clam", "coral", "shell"];

  function getWishForEmitter(index) {
    return wishesData[index] || null;
  }

  function syncSnails() {
    const floorY = ch - 30;
    snails = [];
    const sp = cw / 7;
    for (let i = 0; i < 6; i++) {
      const isWish = i < 2;
      snails.push({
        x: sp * (i + 1),
        y: floorY,
        isWish,
        type: EMITTER_TYPES[i % EMITTER_TYPES.length],
        wish: isWish ? getWishForEmitter(i) : null,
        timer: 45 + Math.random() * 140 + i * 24,
        openT: 0,
        hue: 165 + i * 18
      });
    }
    if (wishesData.length > 2) {
      snails[0].wishPool = wishesData.filter((_, idx) => idx % 2 === 0);
      snails[1].wishPool = wishesData.filter((_, idx) => idx % 2 === 1);
      snails[0].poolIdx = 0;
      snails[1].poolIdx = 0;
    }
  }

  function spawnPlainBubbles(x, y, count = 4) {
    for (let j = 0; j < count; j++) {
      ambBub.push({
        x: x + (Math.random() - 0.5) * 22,
        y: y - 18 - Math.random() * 10,
        sz: 2.2 + Math.random() * 4.6,
        spd: 0.35 + Math.random() * 0.5,
        wo: Math.random() * 6.28,
        op: 0.2 + Math.random() * 0.2
      });
    }
  }

  function drawCoral(c, s) {
    c.save();
    c.translate(s.x, s.y);
    c.lineCap = "round";
    c.strokeStyle = s.type === "coral" ? "#FF6B8A" : "#FFB703";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, 8);
    c.quadraticCurveTo(-3, -15, 0, -34);
    c.moveTo(-2, -12);
    c.quadraticCurveTo(-20, -25, -22, -40);
    c.moveTo(2, -16);
    c.quadraticCurveTo(20, -28, 23, -48);
    c.moveTo(0, -2);
    c.quadraticCurveTo(16, -8, 17, -22);
    c.stroke();
    c.strokeStyle = "rgba(255,255,255,.25)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 8);
    c.quadraticCurveTo(-3, -15, 0, -34);
    c.stroke();
    c.restore();
  }

  function drawShell(c, s) {
    c.save();
    c.translate(s.x, s.y + 4);
    const open = s.openT > 0 ? Math.sin(s.openT / 25 * Math.PI) * 7 : 0;
    c.fillStyle = s.type === "clam" ? "#BDE0FE" : "#FFD6A5";
    c.strokeStyle = "rgba(255,255,255,.55)";
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(-24, 0);
    c.quadraticCurveTo(-12, -22 - open, 0, -24 - open);
    c.quadraticCurveTo(14, -22 - open, 25, 0);
    c.quadraticCurveTo(10, 10, -24, 0);
    c.fill();
    c.stroke();
    for (let i = -2; i <= 2; i++) {
      c.beginPath();
      c.moveTo(0, -21 - open);
      c.lineTo(i * 9, -1);
      c.strokeStyle = "rgba(10,38,71,.16)";
      c.stroke();
    }
    c.restore();
  }

  function drawSnails(c) {
    snails.forEach((s, i) => {
      s.timer--;
      if (s.timer <= 0) {
        s.openT = 25;
        if (s.isWish) {
          const pool = s.wishPool && s.wishPool.length ? s.wishPool : null;
          const w = pool ? pool[s.poolIdx % pool.length] : s.wish;
          if (w) spawnWish(s.x, s.y - 34, w);
          if (pool) s.poolIdx++;
        } else {
          spawnPlainBubbles(s.x, s.y, 5);
        }
        s.timer = s.isWish ? 210 + Math.random() * 180 : 95 + Math.random() * 170;
      }
      if (s.openT > 0) s.openT--;
      if (s.type === "coral") drawCoral(c, s);
      else drawShell(c, s);
    });
  }

  // --- Wish Bubbles ---
  function spawnWish(x, y, wish) {
    const message = String(wish.message || "").trim();
    if (!message) return;
    const fs = Math.max(10, Math.min(12, message.length < 30 ? 12 : 10));
    const maxW = message.length < 20 ? 76 : message.length < 50 ? 98 : 122;
    ctx.font = "700 " + fs + "px 'Nunito',sans-serif";

    const words = message.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else cur = test;
    }
    if (cur) lines.push(cur);

    const lh = fs * 1.35;
    const r = Math.max(38, Math.max(lines.length * lh / 1.35 + 16, ctx.measureText(message.slice(0, 20)).width / 2 + 20));

    wishBub.push({
      x, y,
      r: Math.min(r, 88),
      spd: 0.34 + Math.random() * 0.22,
      wo: Math.random() * 6.28,
      wa: 2 + Math.random() * 4,
      hue: 178 + Math.random() * 36,
      lines,
      fs,
      op: 0,
      phase: "rise",
      msg: message,
      name: wish.name || "Tamu"
    });
  }

  function drawWishBub(c) {
    wishBub = wishBub.filter(b => b.op > 0 || b.phase === "rise");
    wishBub.forEach(b => {
      b.y -= b.spd;
      b.wo += 0.015;
      const bx = b.x + Math.sin(b.wo) * b.wa;

      if (b.phase === "rise" && b.op < 1) b.op = Math.min(1, b.op + 0.035);
      if (b.y - b.r < SURFACE_Y + 18 && b.phase === "rise") b.phase = "fade";
      if (b.phase === "fade") {
        b.op -= 0.025;
        if (b.op <= 0) return;
      }

      c.save();
      c.globalAlpha = b.op;
      c.shadowColor = "hsla(" + b.hue + ",80%,70%,0.4)";
      c.shadowBlur = 12;

      const g = c.createRadialGradient(bx - b.r * .25, b.y - b.r * .25, b.r * .08, bx, b.y, b.r);
      g.addColorStop(0, "hsla(" + b.hue + ",90%,92%,.38)");
      g.addColorStop(.72, "hsla(" + b.hue + ",75%,70%,.16)");
      g.addColorStop(1, "hsla(" + b.hue + ",55%,55%,.06)");

      c.beginPath();
      c.arc(bx, b.y, b.r, 0, 6.28);
      c.fillStyle = g;
      c.fill();

      c.shadowBlur = 0;
      c.beginPath();
      c.arc(bx, b.y, b.r, 0, 6.28);
      c.strokeStyle = "hsla(" + b.hue + ",85%,80%,.72)";
      c.lineWidth = 1.6;
      c.stroke();

      c.beginPath();
      c.arc(bx - b.r * .35, b.y - b.r * .35, b.r * .16, 0, 6.28);
      c.fillStyle = "rgba(255,255,255,.45)";
      c.fill();

      const lh = b.fs * 1.35;
      const totalH = b.lines.length * lh;
      let sy = b.y - totalH / 2 + lh * .5;

      c.font = "800 " + b.fs + "px 'Nunito',sans-serif";
      c.fillStyle = "rgba(255,255,255,.92)";
      c.textAlign = "center";
      c.textBaseline = "middle";
      b.lines.forEach((l, li) => c.fillText(l, bx, sy + li * lh));
      c.restore();
    });
  }

  // Mouse over tooltip checker on wishes bubbles
  const treeTooltip = document.getElementById("treeTooltip");
  const tooltipName = document.getElementById("tooltipName");
  const tooltipMsg = document.getElementById("tooltipMsg");
  const tooltipTime = document.getElementById("tooltipTime");

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX / dpr;
    const my = (e.clientY - rect.top) * scaleY / dpr;

    let hovered = null;
    for (let i = wishBub.length - 1; i >= 0; i--) {
      const b = wishBub[i];
      const bx = b.x + Math.sin(b.wo) * b.wa;
      const dist = Math.hypot(mx - bx, my - b.y);
      if (dist <= b.r && b.op > 0.1) {
        hovered = b;
        break;
      }
    }

    if (hovered) {
      canvas.style.cursor = "pointer";
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      treeTooltip.style.left = (rx + 15) + "px";
      treeTooltip.style.top = (ry - 15) + "px";
      treeTooltip.style.display = "block";
      tooltipName.textContent = "Ucapan:";
      tooltipMsg.textContent = hovered.msg;
      tooltipTime.textContent = "Gelembung lautan Kayla";
    } else {
      canvas.style.cursor = "";
      treeTooltip.style.display = "none";
    }
  });

  // --- Submarine ---
  function initSubmarine() {
    submarine = { x: -180, y: ch - 112, spd: 0.32 + Math.random() * 0.12, dir: 1 };
  }
  function drawSubmarine(c) {
    const s = submarine;
    s.x += s.spd * s.dir;
    if (s.x > cw + 210) {
      s.x = -210;
      s.y = ch - 104 - Math.random() * 42;
      s.spd = 0.28 + Math.random() * 0.18;
    }
    c.save();
    c.translate(s.x, s.y);

    c.fillStyle = "#FFD23F";
    c.strokeStyle = "#B8860B";
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(0, 0, 66, 26, 0, 0, 6.28);
    c.fill();
    c.stroke();

    c.fillStyle = "#F4A261";
    c.beginPath();
    c.moveTo(36, -22);
    c.quadraticCurveTo(60, -10, 70, 0);
    c.quadraticCurveTo(58, 12, 34, 20);
    c.closePath();
    c.fill();
    c.stroke();

    c.fillStyle = "#E9C46A";
    c.fillRect(-8, -36, 10, 17);
    c.fillRect(-15, -40, 24, 7);
    c.strokeRect(-8, -36, 10, 17);

    const ports = [-28, 0, 28];
    ports.forEach((px) => {
      c.beginPath();
      c.arc(px, 0, 13, 0, 6.28);
      c.fillStyle = "#8ECAE6";
      c.fill();
      c.strokeStyle = "#8B6B00";
      c.lineWidth = 2;
      c.stroke();
    });

    c.save();
    c.beginPath();
    c.arc(0, 0, 11, 0, Math.PI * 2);
    c.clip();
    if (birthdayPhotoImg && birthdayPhotoImg.complete && birthdayPhotoImg.naturalWidth > 0) {
      c.drawImage(birthdayPhotoImg, -12, -12, 24, 24);
    } else {
      c.fillStyle = "#FFE5EC";
      c.fillRect(-12, -12, 24, 24);
      c.fillStyle = "#0A2647";
      c.font = "800 8px 'Nunito',sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(eventInfoState.child_name || "Kayla", 0, 0);
    }
    c.restore();

    const pa = t * 8;
    c.save();
    c.translate(-66, 0);
    c.rotate(pa);
    c.fillStyle = "#B8860B";
    c.fillRect(-2, -12, 4, 24);
    c.fillRect(-12, -2, 24, 4);
    c.restore();

    for (let i = 0; i < 5; i++) drawBubble(c, -82 - i * 13, -8 + Math.sin(t * 3 + i) * 5, 4 - i * 0.35, 0.22 - i * 0.025);
    c.restore();
  }

  // --- Diver and extra sea life ---
  function initDiver() {
    diver = { x: cw + 80, y: ch - 130, spd: 0.22 + Math.random() * 0.1, dir: -1, wo: Math.random() * 6.28 };
  }
  function drawDiver(c) {
    const d = diver;
    d.x += d.spd * d.dir;
    d.wo += 0.02;
    const dy = d.y + Math.sin(d.wo) * 8;
    if (d.x < -90) {
      d.x = cw + 90;
      d.y = ch - 120 - Math.random() * 60;
      d.spd = 0.2 + Math.random() * 0.15;
    }
    c.save();
    c.translate(d.x, dy);
    c.scale(d.dir, 1);
    c.fillStyle = "#111827";
    c.beginPath();
    c.ellipse(0, 0, 13, 19, -0.4, 0, 6.28);
    c.fill();
    c.fillStyle = "#90E0EF";
    c.beginPath();
    c.arc(9, -11, 7, 0, 6.28);
    c.fill();
    c.strokeStyle = "#CAF0F8";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-10, 16);
    c.lineTo(-24, 28);
    c.moveTo(8, 17);
    c.lineTo(20, 31);
    c.stroke();
    c.restore();
  }

  // --- Ships ---
  function initShips() {
    ships = [];
    for (let i = 0; i < 3; i++) {
      const r = Math.random() > 0.5;
      ships.push({
        x: r ? -90 : cw + 90,
        y: SURFACE_Y - 9,
        spd: 0.18 + Math.random() * 0.25,
        dir: r ? 1 : -1,
        size: 0.8 + Math.random() * 0.35,
        color: ["#FFFFFF", "#FFDD57", "#F07167"][i],
        wo: Math.random() * 6.28,
        delay: i * 120
      });
    }
  }
  function drawShipShape(c, s) {
    const z = s.size;
    c.save();
    c.scale(z, z);
    c.fillStyle = "#6C4F3D";
    c.beginPath();
    c.moveTo(-42, 3);
    c.lineTo(42, 3);
    c.lineTo(28, 18);
    c.lineTo(-28, 18);
    c.closePath();
    c.fill();
    c.strokeStyle = "rgba(255,255,255,.35)";
    c.stroke();
    c.fillStyle = s.color;
    c.beginPath();
    c.moveTo(-6, 2);
    c.lineTo(-6, -38);
    c.lineTo(26, -2);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(-9, 2);
    c.lineTo(-9, -31);
    c.lineTo(-34, -2);
    c.closePath();
    c.fillStyle = "#CAF0F8";
    c.fill();
    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-8, 4);
    c.lineTo(-8, -40);
    c.stroke();
    c.restore();
  }
  function drawShips(c) {
    ships.forEach((s) => {
      if (s.delay > 0) {
        s.delay--;
        return;
      }
      s.x += s.spd * s.dir;
      s.wo += 0.012;
      const sy = s.y + Math.sin(s.wo) * 2;
      if ((s.dir > 0 && s.x > cw + 95) || (s.dir < 0 && s.x < -95)) {
        s.dir *= -1;
        s.x = s.dir > 0 ? -90 : cw + 90;
        s.spd = 0.16 + Math.random() * 0.25;
      }
      c.save();
      c.translate(s.x, sy);
      if (s.dir < 0) c.scale(-1, 1);
      drawShipShape(c, s);
      c.globalAlpha = 0.16;
      c.strokeStyle = "#fff";
      c.beginPath();
      c.moveTo(-36, 18);
      c.lineTo(-72, 21);
      c.stroke();
      c.restore();
    });
  }

  // --- Birds ---
  function initBirds() {
    birds = [];
    for (let i = 0; i < 7; i++) {
      const r = Math.random() > 0.5;
      const onWater = i < 2;
      birds.push({
        x: r ? -60 : cw + 60,
        y: onWater ? SURFACE_Y - 11 : 9 + Math.random() * 34,
        spd: onWater ? 0.08 + Math.random() * 0.12 : 0.34 + Math.random() * 0.45,
        dir: r ? 1 : -1,
        onWater,
        wo: Math.random() * 6.28,
        flapPhase: Math.random() * 6.28
      });
    }
  }
  function drawPelican(c) {
    c.fillStyle = "#FFFFFF";
    c.strokeStyle = "rgba(10,38,71,.25)";
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(0, 2, 13, 7, 0, 0, 6.28);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(12, -4, 6, 0, 6.28);
    c.fill();
    c.stroke();
    c.fillStyle = "#F4A261";
    c.beginPath();
    c.moveTo(17, -4);
    c.lineTo(35, -1);
    c.lineTo(17, 2);
    c.closePath();
    c.fill();
    c.fillStyle = "#111827";
    c.beginPath();
    c.arc(14, -6, 1.4, 0, 6.28);
    c.fill();
  }
  function drawBirds(c) {
    birds.forEach((b) => {
      b.x += b.spd * b.dir;
      b.wo += 0.015;
      b.flapPhase += 0.08;
      if ((b.dir > 0 && b.x > cw + 70) || (b.dir < 0 && b.x < -70)) {
        b.dir *= -1;
        b.x = b.dir > 0 ? -60 : cw + 60;
        if (!b.onWater) b.y = 8 + Math.random() * 32;
      }
      c.save();
      const by = b.onWater ? b.y + Math.sin(b.wo) * 1.4 : b.y + Math.sin(b.wo) * 3;
      c.translate(b.x, by);
      if (b.dir < 0) c.scale(-1, 1);
      if (b.onWater) {
        drawPelican(c);
      } else {
        const flap = Math.sin(b.flapPhase) * 6;
        c.strokeStyle = "rgba(20,38,60,.7)";
        c.lineWidth = 2;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(-12, flap);
        c.quadraticCurveTo(-4, -5 + flap * 0.35, 0, 0);
        c.quadraticCurveTo(4, -5 + flap * 0.35, 12, flap);
        c.stroke();
      }
      c.restore();
    });
  }

  function drawSeaFloorDetails(c) {
    const fy = ch - 28;
    const rocks = [[.12, 12], [.22, 7], [.42, 10], [.63, 14], [.82, 8], [.92, 12]];
    rocks.forEach(([pct, r], i) => {
      c.fillStyle = i % 2 ? "rgba(126,104,74,.45)" : "rgba(170,138,82,.38)";
      c.beginPath();
      c.ellipse(cw * pct, fy + 8, r * 1.5, r, 0, 0, 6.28);
      c.fill();
    });

    for (let i = 0; i < 12; i++) {
      const sx = cw * (.04 + i * .085);
      const sh = 22 + (i % 4) * 9;
      const sw = Math.sin(t * .7 + i * 1.1) * 8;
      c.save();
      c.beginPath();
      c.moveTo(sx, fy + 2);
      c.quadraticCurveTo(sx + sw, fy + 2 - sh * .55, sx + sw * .5, fy + 2 - sh);
      c.strokeStyle = "rgba(80,200,120," + (.16 + Math.sin(t * .5 + i) * .04) + ")";
      c.lineWidth = 2.4;
      c.lineCap = "round";
      c.stroke();
      c.restore();
    }

    const star = (x, y, r) => {
      c.save();
      c.translate(x, y);
      c.fillStyle = "rgba(255,214,102,.78)";
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const rr = i % 2 ? r * .45 : r;
        c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      c.closePath();
      c.fill();
      c.restore();
    };
    star(cw * .74, fy + 4, 10);
    star(cw * .34, fy + 13, 7);
  }

  // --- Ocean BG ---
  function drawBG(c) {
    const sg = c.createLinearGradient(0, 0, 0, SURFACE_Y);
    sg.addColorStop(0, "#9BE7FF");
    sg.addColorStop(1, "#D7F7FF");
    c.fillStyle = sg;
    c.fillRect(0, 0, cw, SURFACE_Y);

    c.save();
    c.globalAlpha = 0.9;
    c.fillStyle = "#FFD166";
    c.beginPath();
    c.arc(cw - 52, 22, 13, 0, 6.28);
    c.fill();
    c.restore();

    c.save();
    c.globalAlpha = 0.55;
    c.fillStyle = "#FFFFFF";
    [[.16, 22], [.5, 16], [.79, 25]].forEach(([pct, y], i) => {
      const x = cw * pct + Math.sin(t * (0.08 + i * 0.02)) * 10;
      c.beginPath();
      c.ellipse(x, y, 18, 7, 0, 0, 6.28);
      c.ellipse(x + 16, y + 2, 15, 6, 0, 0, 6.28);
      c.ellipse(x - 15, y + 2, 13, 5, 0, 0, 6.28);
      c.fill();
    });
    c.restore();

    c.beginPath();
    c.moveTo(0, SURFACE_Y);
    for (let x = 0; x <= cw; x += 5) {
      c.lineTo(x, SURFACE_Y + Math.sin(x * .025 + t * .8) * 3 + Math.sin(x * .05 + t * .5) * 1.5);
    }
    c.lineTo(cw, ch);
    c.lineTo(0, ch);
    c.closePath();

    const wg = c.createLinearGradient(0, SURFACE_Y, 0, ch);
    wg.addColorStop(0, "#0086C9");
    wg.addColorStop(.32, "#0566A8");
    wg.addColorStop(.68, "#063B78");
    wg.addColorStop(1, "#020024");
    c.fillStyle = wg;
    c.fill();

    c.save();
    c.globalAlpha = .08;
    for (let i = 0; i < 7; i++) {
      const rx = cw * (.08 + i * .14);
      const sw = Math.sin(t * .25 + i * .8) * 18;
      c.beginPath();
      c.moveTo(rx - 10 + sw * .4, SURFACE_Y);
      c.lineTo(rx - 38 + sw, ch * .72);
      c.lineTo(rx + 38 + sw, ch * .72);
      c.lineTo(rx + 10 + sw * .4, SURFACE_Y);
      c.closePath();
      c.fillStyle = "#CAF0F8";
      c.fill();
    }
    c.restore();

    const fy = ch - 28;
    const fg = c.createLinearGradient(0, fy, 0, ch);
    fg.addColorStop(0, "rgba(229,190,124,.36)");
    fg.addColorStop(1, "rgba(120,90,45,.52)");
    c.fillStyle = fg;
    c.beginPath();
    c.moveTo(0, fy);
    for (let x = 0; x <= cw; x += 25) c.lineTo(x, fy + Math.sin(x * .04 + t * .4) * 3.5);
    c.lineTo(cw, ch);
    c.lineTo(0, ch);
    c.closePath();
    c.fill();

    drawSeaFloorDetails(c);
  }

  // --- Canvas Main Loop ---
  function drawCanvasFrame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    drawBG(ctx);
    drawAmb(ctx);
    drawFish(ctx);
    drawSubmarine(ctx);
    drawDiver(ctx);
    drawWishBub(ctx);
    drawSnails(ctx);
    drawShips(ctx);
    drawBirds(ctx);
  }

  function drawCanvasFallback() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, ch);
    g.addColorStop(0, "#0086C9");
    g.addColorStop(1, "#020024");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.font = "800 18px 'Nunito',sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Lautan ucapan sedang dimuat", cw / 2, ch / 2);
  }

  function loop() {
    try {
      drawCanvasFrame();
      t += 0.016;
      af = requestAnimationFrame(loop);
    } catch (err) {
      console.error("Canvas animation error:", err);
      drawCanvasFallback();
    }
  }

  function initCanvas() {
    cancelAnimationFrame(af);
    resize();
    initFish();
    initAmb();
    initSubmarine();
    initDiver();
    initShips();
    initBirds();
    syncSnails();
    try {
      drawCanvasFrame();
    } catch (err) {
      console.error("Canvas initial draw error:", err);
      drawCanvasFallback();
    }
    loop();

    requestAnimationFrame(() => {
      resize();
      syncSnails();
    });
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(af);
    resize();
    initFish();
    initAmb();
    initShips();
    initBirds();
    syncSnails();
    loop();
  });

  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // ==========================================
  // 8. PAGE LOAD INITIALIZATION
  // ==========================================
  async function init() {
    startCountdown();

    // Show a complete fallback scene immediately. Remote Supabase sync must not block loading.
    populateInfo();
    renderAlbum();
    renderPublicWishes();
    prepareBirthdayPhoto();
    renderUploadedOceanAssets();
    dashboardPage.style.display = "block";
    if (!window.USE_REFERENCE_OCEAN_SCENE) initCanvas();
    initScrollReveal();

    // Prepare active playlist metadata UI
    if (playlist.length > 0) {
      musicTitle.textContent = playlist[currentTrackIndex].title;
      musicArtist.textContent = playlist[currentTrackIndex].artist;
    }

    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      setTimeout(() => {
        if (window.confettiRain) confettiRain(3000, 3);
      }, 300);
    }, 700);

    loadAllData()
      .then(() => {
        prepareBirthdayPhoto();
        recordVisitor();
      })
      .catch((err) => {
        console.error("Gagal memuat data remote:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
