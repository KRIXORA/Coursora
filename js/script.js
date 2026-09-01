// Mobile sidebar drawer
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const menuLines = document.querySelectorAll(".menu-line");
let isMenuOpen = false;

function setMenuIcon(open) {
  if (!menuLines.length) return;
  if (open) {
    menuLines[0].style.transform = "rotate(45deg) translateY(15px)";
    menuLines[1].style.opacity = "0";
    menuLines[2].style.transform = "rotate(-45deg) translateY(-15px)";
  } else {
    menuLines[0].style.transform = "rotate(0) translateY(0)";
    menuLines[1].style.opacity = "1";
    menuLines[2].style.transform = "rotate(0) translateY(0)";
  }
}

function openMobileMenu() {
  if (!mobileMenu) return;
  isMenuOpen = true;
  mobileMenu.classList.remove("hidden");
  mobileBackdrop?.classList.remove("hidden");
  // force reflow then animate
  void mobileMenu.offsetWidth;
  mobileMenu.classList.add("is-open");
  mobileBackdrop?.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileBackdrop?.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open");
  setMenuIcon(true);
}

function closeMobileMenu() {
  if (!mobileMenu || !isMenuOpen) return;
  isMenuOpen = false;
  mobileMenu.classList.remove("is-open");
  mobileBackdrop?.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileBackdrop?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sidebar-open");
  setMenuIcon(false);
  setTimeout(() => {
    if (!isMenuOpen) {
      mobileMenu.classList.add("hidden");
      mobileBackdrop?.classList.add("hidden");
    }
  }, 280);
}

menuToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (isMenuOpen) closeMobileMenu();
  else openMobileMenu();
});

mobileMenuClose?.addEventListener("click", closeMobileMenu);
mobileBackdrop?.addEventListener("click", closeMobileMenu);

// Close on nav link click
mobileMenu?.querySelectorAll("[data-sidebar-link]").forEach((el) => {
  el.addEventListener("click", () => closeMobileMenu());
});

// Sidebar search → command palette
document.getElementById("sidebar-search")?.addEventListener("click", () => {
  closeMobileMenu();
  document.getElementById("open-command-palette")?.click();
  // fallback: dispatch custom or focus palette
  const overlay = document.getElementById("command-palette-overlay");
  const input = document.getElementById("command-palette-input");
  if (overlay && overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    setTimeout(() => input?.focus(), 50);
  }
});

// Favorites shortcut: show favorites filter if available
document.getElementById("sidebar-favorites")?.addEventListener("click", (e) => {
  // Let hash navigation happen; try to trigger favorites view
  const favBtn = document.getElementById("show-favorites") || document.querySelector("[data-filter='favorites']");
  if (favBtn) {
    e.preventDefault();
    closeMobileMenu();
    favBtn.click();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMenuOpen) closeMobileMenu();
});

// Course data ab js/script.js mein hardcode nahi hai — data/courses.json se fetch hota hai.
// Isse file chhoti rehti hai aur naye courses add karna sirf JSON edit karke ho jaata hai.
// Fetch complete hone tak `courses` empty rehta hai; asli load aur page-init neeche
// loadCoursesAndInit() function karta hai.
let courses = [];

let categorySelect = document.getElementById("category");
let typeSelect = document.getElementById("type");
let providerSelect = document.getElementById("provider");
let searchText = document.getElementById("search-text");
let clearBtn = document.getElementById("clear-btn");
let favoritesOnlyBtn = document.getElementById("favorites-only");
let courseList = document.getElementById("course-list");
let resultCount = document.getElementById("result-count");
let showFavoritesOnly = false;

// ye email jaha "Report broken link" click hone par mail jaayegi
const REPORT_EMAIL = "krixora404@gmail.com";

// FAVORITES: koi login nahi chahiye, sirf is browser mein localStorage mein save hote hain
const FAVORITES_KEY = "course_finder_favorites";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isFavorite(courseLink) {
  return getFavorites().includes(courseLink);
}

function toggleFavorite(courseLink) {
  let favorites = getFavorites();
  if (favorites.includes(courseLink)) {
    favorites = favorites.filter((link) => link !== courseLink);
  } else {
    favorites.push(courseLink);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Provider dropdown ko courses array se dynamically populate karo
// taaki naya provider add karne pe HTML edit na karna pade
function populateProviders() {
  const providers = [...new Set(courses.map((c) => c.provider))].sort();
  providers.forEach((provider) => {
    const option = document.createElement("option");
    option.value = provider;
    option.textContent = provider;
    providerSelect.appendChild(option);
  });
}

// Category dropdown bhi courses array se hi dynamically populate hota hai
// taaki nayi category add karne pe HTML edit na karna pade
function populateCategories() {
  const categories = [...new Set(courses.map((c) => c.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Course thumbnails alag-alag external sites se aate hain (bina compress/resize kiye)
// ye function unhe ek free proxy (images.weserv.nl) se WebP mein convert + resize karva deta hai
// isse scroll lag kam hota hai kyunki images chhoti aur lightweight ho jaati hain
/* Provider → domain map for reliable lightweight logos */
const PROVIDER_DOMAINS = {
  "udemy": "udemy.com",
  "coursera": "coursera.org",
  "edx": "edx.org",
  "futurelearn": "futurelearn.com",
  "freecodecamp": "freecodecamp.org",
  "the odin project": "theodinproject.com",
  "codecademy": "codecademy.com",
  "scrimba": "scrimba.com",
  "kaggle": "kaggle.com",
  "geeksforgeeks": "geeksforgeeks.org",
  "hack the box": "hackthebox.com",
  "tryhackme": "tryhackme.com",
  "microsoft": "microsoft.com",
  "google": "google.com",
  "aws": "aws.amazon.com",
  "meta": "meta.com",
  "ibm": "ibm.com",
  "harvard": "harvard.edu",
  "mit": "mit.edu",
  "stanford": "stanford.edu",
  "codeyogi": "codeyogi.org",
  "code.org": "code.org",
  "khan academy": "khanacademy.org",
  "duolingo": "duolingo.com",
  "babbel": "babbel.com",
  "skillshare": "skillshare.com",
  "udacity": "udacity.com",
  "linkedin learning": "linkedin.com",
  "pluralsight": "pluralsight.com",
  "datacamp": "datacamp.com",
  "fast.ai": "fast.ai",
  "elements of ai": "elementsofai.com",
  "university of helsinki": "helsinki.fi",
  "javascript.info": "javascript.info",
  "designcourse": "designcourse.com",
  "adorama": "adorama.com",
  "domestika": "domestika.org",
  "unacademy": "unacademy.com",
  "testbook": "testbook.com",
  "byju": "byjus.com",
  "italki": "italki.com",
  "busuu": "busuu.com",
};

const PROVIDER_COLORS = [
  "#1673e6", "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#6366f1", "#14b8a6", "#f97316",
];

function providerKey(provider) {
  return (provider || "").toLowerCase().trim();
}

function getProviderDomain(provider) {
  const key = providerKey(provider);
  if (PROVIDER_DOMAINS[key]) return PROVIDER_DOMAINS[key];
  // fuzzy match
  for (const [k, domain] of Object.entries(PROVIDER_DOMAINS)) {
    if (key.includes(k) || k.includes(key)) return domain;
  }
  // try extracting from common patterns
  const cleaned = key.replace(/[^a-z0-9]+/g, "");
  if (cleaned.length > 2) return cleaned + ".com";
  return null;
}

function monogramDataUri(provider) {
  const letter = ((provider || "?").trim()[0] || "?").toUpperCase();
  let hash = 0;
  for (let i = 0; i < (provider || "").length; i++) hash = (hash * 31 + provider.charCodeAt(i)) | 0;
  const color = PROVIDER_COLORS[Math.abs(hash) % PROVIDER_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="24" fill="${color}"/>
    <text x="64" y="64" dy="0.35em" text-anchor="middle" fill="#fff" font-family="system-ui,Segoe UI,sans-serif" font-size="56" font-weight="700">${letter}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Lightweight provider logo — Google favicon CDN (~1–2KB) with SVG monogram fallback */
function getCourseImage(course) {
  const domain = getProviderDomain(course.provider);
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }
  return monogramDataUri(course.provider);
}

function optimizeImageUrl(url, width = 128) {
  // data URIs and google favicons — no proxy needed
  if (!url || url.startsWith("data:") || url.includes("google.com/s2/favicons")) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=75`;
}

let hasRevealedOnce = false;

function displayCourses(filteredCourses) {
  courseList.innerHTML = "";
  
  if (filteredCourses.length === 0) {
    courseList.innerHTML = `
      <div class="empty-state col-span-full" data-reveal>
        <div class="empty-state__icon"><i class="fas fa-compass"></i></div>
        <p class="empty-state__title">No courses match</p>
        <p class="empty-state__sub">Try a different keyword, or clear filters to see the full catalog.</p>
        <button type="button" class="empty-state__btn" id="empty-clear-filters">
          <i class="fas fa-rotate-left"></i> Clear filters
        </button>
      </div>
    `;
    document.getElementById("empty-clear-filters")?.addEventListener("click", () => {
      document.getElementById("clear-btn")?.click();
    });
    resultCount.innerText = "";
    if (typeof initScrollReveal === "function") initScrollReveal();
    return;
  }
  
  const freeN = filteredCourses.filter((c) => c.type === "Free").length;
  const paidN = filteredCourses.length - freeN;
  resultCount.innerHTML = `<span class="result-stats"><strong>${filteredCourses.length}</strong> shown · <span class="text-emerald-600 dark:text-emerald-400">${freeN} free</span> · <span class="text-amber-600 dark:text-amber-400">${paidN} paid</span></span>`;
  
  filteredCourses.forEach((course, cardIndex) => {
    let saved = isFavorite(course.link);
    let reportSubject = encodeURIComponent(`Broken link report: ${course.name}`);
    let reportBody = encodeURIComponent(
      `Course: ${course.name}\nProvider: ${course.provider}\nLink: ${course.link}\n\nIssue: `
    );
    const stagger = hasRevealedOnce ? `style="--card-i:${Math.min(cardIndex, 12)}"` : "";
    let courseCard = `
      <div class="course-card ${hasRevealedOnce ? "card-enter" : ""}" data-link="${course.link}" ${hasRevealedOnce ? "" : "data-reveal"} ${stagger}>
        <div class="img-wrap">
          <img src="${optimizeImageUrl(getCourseImage(course))}" alt="${course.provider} logo" loading="lazy" decoding="async" width="128" height="128" onerror="this.onerror=null;this.src='${monogramDataUri(course.provider)}'">
          <button class="favorite-btn ${saved ? "saved" : ""}" data-link="${course.link}" aria-label="Save course" title="${saved ? "Remove from saved" : "Save for later"}">
            <i class="${saved ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>
        <div class="details">
          <span class="category-tag">${course.category}</span>
          <h3>${course.name}</h3>
          <p class="course-description">${course.description}</p>
          <p><i class="fas fa-building-columns"></i> <strong>Provider:</strong> ${course.provider}</p>
          <p><i class="far fa-clock"></i> <strong>Duration:</strong> ${course.duration}</p>
          <span class="course-type ${
            course.type === "Free" ? "free" : "paid"
          }">${course.type}</span>
          <span class="grow"></span>
          <div class="card-actions">
            <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="btn-view" data-track-view="${course.link}">
              <i class="fas fa-arrow-up-right-from-square"></i> View Course
            </a>
            <button type="button" class="btn-details" data-link="${course.link}">
              <i class="fas fa-circle-info"></i> Details
            </button>
          </div>
          <a href="mailto:${REPORT_EMAIL}?subject=${reportSubject}&body=${reportBody}" class="report-link">
            <i class="fas fa-flag"></i> Report broken link
          </a>
        </div>
      </div>
    `;
    courseList.innerHTML += courseCard;
  });
  
  hasRevealedOnce = true;

  // Cards abhi render hue hain (pehli baar async fetch ke baad, ya baad mein filter se) —
  // reveal.js ke IntersectionObserver ko dobara chalao taaki naye [data-reveal] cards bhi
  // dikhein. DOMContentLoaded pe sirf ek baar chalne se ye cards miss ho jaate the agar
  // wo us waqt tak DOM mein nahi aaye the (jaise ab, jab courses.json fetch se aata hai).
  if (typeof initScrollReveal === "function") initScrollReveal();
}

function applyFilters() {
  let selectedCategory = categorySelect.value;
  let selectedType = typeSelect.value;
  let selectedProvider = providerSelect.value;
  let query = searchText.value.trim().toLowerCase();
  let tokens = query ? query.split(/\s+/).filter(Boolean) : [];
  let onlyFavorites = showFavoritesOnly;
  let favorites = getFavorites();
  const sortEl = document.getElementById("sort-select");
  const sortMode = sortEl ? sortEl.value : "relevance";

  let filteredCourses = courses.filter((course) => {
    let matchesCategory = selectedCategory === "" || course.category === selectedCategory;
    let matchesType = selectedType === "" || course.type === selectedType;
    let matchesProvider = selectedProvider === "" || course.provider === selectedProvider;
    const hay = `${course.name} ${course.provider} ${course.category} ${course.description || ""}`.toLowerCase();
    let matchesQuery = tokens.length === 0 || tokens.every((t) => hay.includes(t));
    let matchesFavorites = !onlyFavorites || favorites.includes(course.link);
    return matchesCategory && matchesType && matchesProvider && matchesQuery && matchesFavorites;
  });

  if (sortMode === "name-asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === "name-desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortMode === "provider") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
  } else if (sortMode === "free-first") {
    filteredCourses = [...filteredCourses].sort((a, b) => (a.type === "Free" ? 0 : 1) - (b.type === "Free" ? 0 : 1) || a.name.localeCompare(b.name));
  } else if (sortMode === "paid-first") {
    filteredCourses = [...filteredCourses].sort((a, b) => (a.type === "Paid" ? 0 : 1) - (b.type === "Paid" ? 0 : 1) || a.name.localeCompare(b.name));
  }

  displayCourses(filteredCourses);
  updateURLFromFilters();
  if (typeof window.__cmOnFiltersApplied === "function") {
    window.__cmOnFiltersApplied(filteredCourses, { query, selectedCategory, selectedType, selectedProvider, onlyFavorites });
  }
}

// Current filters ko URL query params mein reflect karta hai (bina page reload ke)
// taaki koi filtered view ka link WhatsApp/kahin bhi share kar sake
function updateURLFromFilters() {
  const params = new URLSearchParams();
  if (categorySelect.value) params.set("category", categorySelect.value);
  if (typeSelect.value) params.set("type", typeSelect.value);
  if (providerSelect.value) params.set("provider", providerSelect.value);
  if (searchText.value.trim()) params.set("q", searchText.value.trim());
  if (showFavoritesOnly) params.set("saved", "1");

  const query = params.toString();
  const newURL = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  history.replaceState(null, "", newURL);
}

// Page load pe URL mein already koi filters ho (shared link se aaye ho) to unhe load karta hai
function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return false;

  if (params.has("category")) categorySelect.value = params.get("category");
  if (params.has("type")) typeSelect.value = params.get("type");
  if (params.has("provider")) providerSelect.value = params.get("provider");
  if (params.has("q")) searchText.value = params.get("q");
  if (params.get("saved") === "1") {
    showFavoritesOnly = true;
    updateFavoritesButtonUI();
  }
  return true;
}

// data/courses.json fetch karke courses array bharta hai, phir page ka baaki init chalata hai
// (dropdowns populate, URL se shared filters apply, ya saare courses dikhao)
async function loadCoursesAndInit() {
  try {
    const res = await fetch("data/courses.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    courses = await res.json();
  } catch (err) {
    console.error("[Coursora] Failed to load course data:", err);
    courseList.innerHTML = `
      <div class="col-span-full text-center py-16 text-gray-500 dark:text-gray-400">
        <i class="fas fa-triangle-exclamation text-2xl mb-3"></i>
        <p>Courses load nahi ho paaye. Apna internet check karke page reload karein.</p>
      </div>
    `;
    return;
  }

  populateProviders();
  populateCategories();
  renderLearningPaths(); // yahan move kiya — pehle ye courses load hone se pehle hi chal jaata tha,
                          // isliye har learning path mein "0 courses" dikhta (courses abhi empty tha)
  const hadURLFilters = loadFiltersFromURL();
  if (hadURLFilters) {
    applyFilters();
  } else {
    displayCourses(courses);
  }
}

loadCoursesAndInit();

// Enter dabane par bhi search ho jaye
searchText.addEventListener("keyup", (e) => {
  if (e.key === "Enter") applyFilters();
});

// Live filtering: typing/selecting turant results update kar deta hai
searchText.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
typeSelect.addEventListener("change", applyFilters);
providerSelect.addEventListener("change", applyFilters);

// "Saved" filter button ek toggle hai (checkbox nahi), click pe on/off hota hai
function updateFavoritesButtonUI() {
  const icon = favoritesOnlyBtn.querySelector("i");
  favoritesOnlyBtn.setAttribute("aria-pressed", String(showFavoritesOnly));
  if (showFavoritesOnly) {
    icon.className = "fas fa-heart";
    favoritesOnlyBtn.classList.add("bg-red-50", "dark:bg-red-900/20", "border-red-300", "dark:border-red-800", "text-red-500");
  } else {
    icon.className = "far fa-heart";
    favoritesOnlyBtn.classList.remove("bg-red-50", "dark:bg-red-900/20", "border-red-300", "dark:border-red-800", "text-red-500");
  }
}

favoritesOnlyBtn.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  updateFavoritesButtonUI();
  applyFilters();
});

clearBtn.addEventListener("click", () => {
  categorySelect.value = "";
  typeSelect.value = "";
  providerSelect.value = "";
  searchText.value = "";
  showFavoritesOnly = false;
  updateFavoritesButtonUI();
  displayCourses(courses);
  history.replaceState(null, "", window.location.pathname);
});

// Copy Link button: current filtered search ka shareable URL clipboard mein copy karta hai
const copyLinkBtn = document.getElementById("copy-link-btn");
copyLinkBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (e) {
    // Clipboard API fail ho (permissions/unsupported), to bhi UI feedback dikha do
  }
  const icon = copyLinkBtn.querySelector("i");
  icon.className = "fas fa-check text-sm text-green-500";
  copyLinkBtn.title = "Link copied!";
  setTimeout(() => {
    icon.className = "fas fa-link text-sm";
    copyLinkBtn.title = "Copy shareable link for this search";
  }, 1500);
});

// PWA Install: nav buttons + floating banner (browser-eligible hone par)
let deferredInstallPrompt = null;
const installBtn = document.getElementById("install-app-btn");
const installBtnMobile = document.getElementById("install-app-btn-mobile");
const installBanner = document.getElementById("install-banner");
const installBannerBtn = document.getElementById("install-banner-btn");
const installBannerDismiss = document.getElementById("install-banner-dismiss");
const INSTALL_DISMISS_KEY = "coursora_install_dismissed";

function showInstallButtons() {
  installBtn?.classList.remove("hidden");
  installBtn?.classList.add("inline-flex");
  installBtnMobile?.classList.remove("hidden");
  installBtnMobile?.classList.add("flex");
  // Floating banner — skip if user dismissed this session/week
  if (installBanner && !sessionStorage.getItem(INSTALL_DISMISS_KEY)) {
    installBanner.classList.remove("hidden");
  }
}

function hideInstallButtons() {
  installBtn?.classList.add("hidden");
  installBtn?.classList.remove("inline-flex");
  installBtnMobile?.classList.add("hidden");
  installBtnMobile?.classList.remove("flex");
  installBanner?.classList.add("hidden");
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallButtons();
});

async function triggerInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  hideInstallButtons();
}

installBtn?.addEventListener("click", triggerInstall);
installBtnMobile?.addEventListener("click", () => {
  closeMobileMenu();
  triggerInstall();
});
installBannerBtn?.addEventListener("click", triggerInstall);
installBannerDismiss?.addEventListener("click", () => {
  installBanner?.classList.add("hidden");
  sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
});

window.addEventListener("appinstalled", hideInstallButtons);

// Heart button click ko event delegation se handle karo
// kyunki cards baar baar dobara render hote hain
courseList.addEventListener("click", (e) => {
  const btn = e.target.closest(".favorite-btn");
  if (!btn) return;
  btn.classList.remove("heart-pop");
  void btn.offsetWidth;
  btn.classList.add("heart-pop");
  toggleFavorite(btn.dataset.link);
  applyFilters();
});
// =========================================================
// COMMAND PALETTE (⌘K search) — kahin se bhi instantly koi bhi
// course search karke naya tab mein khol sakte ho, bina scroll kiye
// =========================================================
const paletteOverlay = document.getElementById("command-palette-overlay");
const paletteInput = document.getElementById("command-palette-input");
const paletteResults = document.getElementById("command-palette-results");
let paletteSelectedIndex = 0;
let paletteMatches = [];

function openPalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.remove("hidden");
  paletteInput.value = "";
  paletteInput.focus();
  renderPaletteResults("");
  document.body.style.overflow = "hidden";
}

function closePalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderPaletteResults(query) {
  const q = query.trim().toLowerCase();
  paletteMatches =
    q === ""
      ? courses.slice(0, 8)
      : courses
          .filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.provider.toLowerCase().includes(q) ||
              c.category.toLowerCase().includes(q)
          )
          .slice(0, 8);
  paletteSelectedIndex = 0;

  if (paletteMatches.length === 0) {
    paletteResults.innerHTML = `<p class="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No courses found</p>`;
    return;
  }

  paletteResults.innerHTML = paletteMatches
    .map(
      (c, i) => `
    <div class="palette-item ${i === 0 ? "active" : ""}" data-index="${i}" data-link="${c.link}">
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-800 dark:text-gray-100 truncate">${c.name}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 truncate">${c.provider} · ${c.category}</p>
      </div>
      <span class="text-xs px-2 py-0.5 rounded-full shrink-0 ${
        c.type === "Free"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }">${c.type}</span>
    </div>
  `
    )
    .join("");
}

function updatePaletteActive() {
  paletteResults.querySelectorAll(".palette-item").forEach((el, i) => {
    el.classList.toggle("active", i === paletteSelectedIndex);
  });
  const activeEl = paletteResults.querySelector(".palette-item.active");
  if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
}

paletteInput?.addEventListener("input", (e) => renderPaletteResults(e.target.value));

paletteResults?.addEventListener("click", (e) => {
  const item = e.target.closest(".palette-item");
  if (item) window.open(item.dataset.link, "_blank", "noopener,noreferrer");
});

paletteOverlay?.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});

document.getElementById("open-command-palette")?.addEventListener("click", openPalette);
document.getElementById("open-command-palette-mobile")?.addEventListener("click", () => {
  if (typeof closeMobileMenu === "function") closeMobileMenu(); else mobileMenu?.classList.add("hidden");
  openPalette();
});

document.addEventListener("keydown", (e) => {
  // Cmd+K (Mac) ya Ctrl+K (Windows/Linux) — kahin se bhi palette open/close ho jaaye
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (!paletteOverlay) return;
    paletteOverlay.classList.contains("hidden") ? openPalette() : closePalette();
    return;
  }

  if (paletteOverlay && !paletteOverlay.classList.contains("hidden")) {
    if (e.key === "Escape") {
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      paletteSelectedIndex = Math.min(paletteSelectedIndex + 1, paletteMatches.length - 1);
      updatePaletteActive();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      paletteSelectedIndex = Math.max(paletteSelectedIndex - 1, 0);
      updatePaletteActive();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const match = paletteMatches[paletteSelectedIndex];
      if (match) window.open(match.link, "_blank", "noopener,noreferrer");
      return;
    }
  }
});

// =========================================================
// CURATED LEARNING PATHS — existing courses ko sahi order mein
// chain karke ek step-by-step roadmap banata hai (sirf list nahi,
// ek guided path deta hai kisi bhi field mein shuru karne ke liye)
// =========================================================
const learningPaths = [
  {
    title: "Become a Web Developer",
    icon: "fa-code",
    level: "Beginner → Job Ready",
    description: "Go from zero to a portfolio-ready front-end developer.",
    courseNames: [
      "Responsive Web Design + Full Curriculum",
      "JavaScript.info",
      "Full Stack Open",
      "Front-End Developer Professional Certificate (Meta)",
    ],
  },
  {
    title: "Data Analyst Career Path",
    icon: "fa-chart-line",
    level: "Beginner → Job Ready",
    description: "Learn to work with data using Python, SQL, and real analytics tools.",
    courseNames: [
      "Python for Everybody Specialization",
      "Learn SQL",
      "Google Data Analytics Professional Certificate",
      "Kaggle Learn (Pandas, SQL, ML micro-courses)",
    ],
  },
  {
    title: "Cybersecurity Beginner to Job-Ready",
    icon: "fa-shield-alt",
    level: "Beginner → Intermediate",
    description: "Build practical security skills, from fundamentals to ethical hacking.",
    courseNames: [
      "Introduction to Cyber Security",
      "CompTIA Security+ Prep",
      "Practical Ethical Hacking",
      "Google Cybersecurity Professional Certificate",
    ],
  },
  {
    title: "AI & Machine Learning Foundations",
    icon: "fa-robot",
    level: "Beginner → Intermediate",
    description: "Understand AI concepts, then build real machine learning models.",
    courseNames: [
      "Elements of AI",
      "Python for Everybody Specialization",
      "Machine Learning Specialization (Andrew Ng)",
      "Deep Learning Specialization",
    ],
  },
  {
    title: "UI/UX Designer Path",
    icon: "fa-pencil-ruler",
    level: "Beginner → Job Ready",
    description: "Learn design principles, then master Figma and the full UX process.",
    courseNames: [
      "Intro to UI Design Fundamentals",
      "Meta Principles of UX/UI Design",
      "Figma UI/UX Design Essentials",
      "Google UX Design Professional Certificate",
    ],
  },
  {
    title: "Digital Marketing Career Path",
    icon: "fa-bullhorn",
    level: "Beginner → Job Ready",
    description: "Master the fundamentals, then specialize in SEO, ads, and strategy.",
    courseNames: [
      "Fundamentals of Digital Marketing",
      "Digital Marketing Specialization (UIUC)",
      "SEO / Google Ads / Analytics Certifications",
      "Google Digital Marketing & E-commerce Certificate",
    ],
  },
];

function renderLearningPaths() {
  const grid = document.getElementById("learning-paths-grid");
  if (!grid) return;

  grid.innerHTML = learningPaths
    .map((path) => {
      const steps = path.courseNames
        .map((name) => courses.find((c) => c.name === name))
        .filter(Boolean);

      return `
        <div class="learning-path-card" data-reveal>
          <button class="path-header" type="button">
            <span class="path-icon"><i class="fas ${path.icon}"></i></span>
            <span class="flex-1 text-left min-w-0">
              <span class="block font-semibold text-gray-800 dark:text-gray-100 text-sm">${path.title}</span>
              <span class="block text-xs text-gray-400">${path.level} · ${steps.length} courses</span>
            </span>
            <i class="fas fa-chevron-down path-chevron"></i>
          </button>
          <p class="path-description">${path.description}</p>
          <ol class="path-steps hidden">
            ${steps
              .map(
                (s, i) => `
              <li>
                <span class="step-num">${i + 1}</span>
                <a href="${s.link}" target="_blank" rel="noopener noreferrer">
                  <span class="step-name">${s.name}</span>
                  <span class="step-meta">${s.provider} · ${s.duration}</span>
                </a>
              </li>
            `
              )
              .join("")}
          </ol>
        </div>
      `;
    })
    .join("");

  // Har path card apne aap accordion ki tarah expand/collapse ho
  grid.querySelectorAll(".path-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".learning-path-card");
      card.querySelector(".path-steps").classList.toggle("hidden");
      card.querySelector(".path-chevron").classList.toggle("rotate-180");
    });
  });
}

// renderLearningPaths() ab loadCoursesAndInit() ke andar call hota hai (upar) —
// courses load hone ke baad, taaki path ke andar course count sahi dikhe

/* ═══════════════════════════════════════════════════════════════════
   Advanced Disclaimer Ticker
   - Continuous scroll via rAF
   - Pointer-drag (mouse + touch) with live scrub
   - Inertia + friction after release
   - Hover: smooth velocity decay → pause, resume with ease
   - Edge-aware: never hard-clips (CSS fades)
   ═══════════════════════════════════════════════════════════════════ */
(function initAdvancedTicker() {
  const root = document.querySelector(".disclaimer-ticker");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const track = root.querySelector(".disclaimer-ticker__track");
  if (!track) return;

  // Wait one frame so layout is measured
  requestAnimationFrame(() => {
    let half = track.scrollWidth / 2;
    if (half < 10) return;

    // State
    let x = 0;
    let velocity = -0.45;          // px per frame @ 60fps baseline (right → left)
    const baseSpeed = -0.45;
    let targetVelocity = baseSpeed;
    let dragging = false;
    let lastPointerX = 0;
    let lastTime = performance.now();
    let pointerSamples = [];       // for velocity estimation on release

    const FRICTION = 0.94;         // inertia decay
    const HOVER_DECAY = 0.88;      // how fast velocity eases toward 0 on hover
    const RESUME_EASE = 0.06;      // how fast velocity eases back to baseSpeed
    const MAX_INERTIA = 18;

    function wrap() {
      // Seamless loop: content is duplicated, so wrap at half width
      if (x <= -half) x += half;
      if (x > 0) x -= half;
    }

    function apply() {
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    function onPointerDown(e) {
      dragging = true;
      root.classList.add("is-dragging");
      root.classList.remove("is-paused-hover");
      lastPointerX = e.clientX;
      pointerSamples = [{ t: performance.now(), x: e.clientX }];
      velocity = 0;
      targetVelocity = 0;
      root.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      x += dx;
      wrap();
      apply();

      const now = performance.now();
      pointerSamples.push({ t: now, x: e.clientX });
      // keep last ~100ms of samples
      pointerSamples = pointerSamples.filter((s) => now - s.t < 100);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");

      // Estimate release velocity from samples
      if (pointerSamples.length >= 2) {
        const first = pointerSamples[0];
        const last = pointerSamples[pointerSamples.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.01) {
          const vx = (last.x - first.x) / dt / 60; // → px per frame-ish
          velocity = Math.max(-MAX_INERTIA, Math.min(MAX_INERTIA, vx));
        }
      }
      pointerSamples = [];

      // After inertia dies, resume base scroll
      targetVelocity = baseSpeed;
    }

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("lostpointercapture", onPointerUp);

    // Hover: intentional soft pause (desktop)
    root.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      if (dragging) return;
      root.classList.add("is-paused-hover");
      targetVelocity = 0;
    });
    root.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "touch") return;
      root.classList.remove("is-paused-hover");
      if (!dragging) targetVelocity = baseSpeed;
    });

    // Recalculate half-width on resize
    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    ro.observe(track);

    // Main loop
    function tick(now) {
      const dt = Math.min(32, now - lastTime) / 16.67; // normalize to ~60fps units
      lastTime = now;

      if (!dragging) {
        // Ease velocity toward target
        if (Math.abs(targetVelocity) < 0.01) {
          // approaching pause
          velocity *= HOVER_DECAY;
          if (Math.abs(velocity) < 0.02) velocity = 0;
        } else if (Math.abs(velocity) > Math.abs(baseSpeed) * 1.15) {
          // residual inertia — friction then ease back
          velocity *= FRICTION;
          if (Math.abs(velocity) < Math.abs(baseSpeed) * 1.05) {
            velocity += (targetVelocity - velocity) * RESUME_EASE * dt;
          }
        } else {
          // blend toward target (resume or continue)
          velocity += (targetVelocity - velocity) * RESUME_EASE * dt;
          // residual inertia damping when overshooting
          if (Math.abs(velocity) > Math.abs(baseSpeed) * 1.2) {
            velocity *= FRICTION;
          }
        }

        x += velocity * dt;
        wrap();
        apply();
      }

      requestAnimationFrame(tick);
    }

    apply();
    requestAnimationFrame(tick);
  });
})();
