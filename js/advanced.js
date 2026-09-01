/**
 * Coursora — advanced layer
 * Quick chips, active filters, sort UI, density, recent viewed,
 * detail drawer, export saved, keyboard shortcuts.
 * Relies on globals from script.js: courses, applyFilters, getFavorites, etc.
 */
(function () {
  const RECENT_KEY = "coursora_recent";
  const DENSITY_KEY = "coursora_density";
  const MAX_RECENT = 8;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function getRecent() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch {
      return [];
    }
  }

  function pushRecent(course) {
    if (!course?.link) return;
    let list = getRecent().filter((c) => c.link !== course.link);
    list.unshift({
      name: course.name,
      link: course.link,
      provider: course.provider,
      type: course.type,
    });
    list = list.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    renderRecent();
  }

  function findCourse(link) {
    return (typeof courses !== "undefined" ? courses : []).find((c) => c.link === link);
  }

  /* ── Active filter chips ─────────────────────────────────────── */
  function renderActiveChips(meta = {}) {
    const box = $("#active-chips");
    if (!box) return;
    const chips = [];
    if (meta.query) chips.push({ key: "q", label: `“${meta.query}”` });
    if (meta.selectedCategory) chips.push({ key: "category", label: meta.selectedCategory });
    if (meta.selectedType) chips.push({ key: "type", label: meta.selectedType });
    if (meta.selectedProvider) chips.push({ key: "provider", label: meta.selectedProvider });
    if (meta.onlyFavorites) chips.push({ key: "saved", label: "Saved only" });

    if (!chips.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = chips
      .map(
        (c) =>
          `<button type="button" class="active-chip" data-clear="${c.key}"><span>${c.label}</span><i class="fas fa-xmark"></i></button>`
      )
      .join("");
  }

  window.__cmOnFiltersApplied = function (_list, meta) {
    renderActiveChips(meta);
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-clear]");
    if (!btn) return;
    const key = btn.getAttribute("data-clear");
    if (key === "q" && searchText) searchText.value = "";
    if (key === "category" && categorySelect) categorySelect.value = "";
    if (key === "type" && typeSelect) typeSelect.value = "";
    if (key === "provider" && providerSelect) providerSelect.value = "";
    if (key === "saved" && typeof showFavoritesOnly !== "undefined") {
      showFavoritesOnly = false;
      if (typeof updateFavoritesButtonUI === "function") updateFavoritesButtonUI();
    }
    applyFilters();
  });

  /* ── Quick chips ─────────────────────────────────────────────── */
  $("#quick-chips")?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-quick]");
    if (!chip || !typeSelect) return;
    const v = chip.getAttribute("data-quick");
    if (v === "type:Free") typeSelect.value = "Free";
    else if (v === "type:Paid") typeSelect.value = "Paid";
    else if (v === "clear-type") typeSelect.value = "";
    applyFilters();
    $$("#quick-chips .chip").forEach((c) => c.classList.toggle("is-on", c === chip && v !== "clear-type"));
  });

  /* ── Sort ────────────────────────────────────────────────────── */
  $("#sort-select")?.addEventListener("change", () => applyFilters());

  /* ── Density ─────────────────────────────────────────────────── */
  function applyDensity(compact) {
    document.documentElement.classList.toggle("density-compact", compact);
    const btn = $("#density-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(compact));
      btn.title = compact ? "Comfortable view" : "Compact view";
    }
    localStorage.setItem(DENSITY_KEY, compact ? "1" : "0");
  }
  applyDensity(localStorage.getItem(DENSITY_KEY) === "1");
  $("#density-toggle")?.addEventListener("click", () => {
    applyDensity(!document.documentElement.classList.contains("density-compact"));
  });

  /* ── Recent viewed ───────────────────────────────────────────── */
  function renderRecent() {
    const strip = $("#recent-strip");
    const list = $("#recent-list");
    if (!strip || !list) return;
    const items = getRecent();
    if (!items.length) {
      strip.hidden = true;
      return;
    }
    strip.hidden = false;
    list.innerHTML = items
      .map(
        (c) =>
          `<button type="button" class="recent-item" data-open-details="${c.link}" title="${c.name}">
            <span class="recent-item__type ${c.type === "Free" ? "free" : "paid"}">${c.type}</span>
            <span class="recent-item__name">${c.name}</span>
            <span class="recent-item__prov">${c.provider}</span>
          </button>`
      )
      .join("");
  }
  $("#clear-recent")?.addEventListener("click", () => {
    localStorage.removeItem(RECENT_KEY);
    renderRecent();
  });
  renderRecent();

  /* ── Drawer ──────────────────────────────────────────────────── */
  const drawer = $("#course-drawer");
  const drawerBody = $("#drawer-body");

  function openDrawer(link) {
    const course = findCourse(link);
    if (!course || !drawer || !drawerBody) return;
    pushRecent(course);
    const related = courses
      .filter((c) => c.link !== course.link && (c.category === course.category || c.provider === course.provider))
      .slice(0, 3);
    drawerBody.innerHTML = `
      <p class="drawer-kicker">${course.category} · ${course.provider}</p>
      <h2 id="drawer-title" class="drawer-title">${course.name}</h2>
      <div class="drawer-badges">
        <span class="course-type ${course.type === "Free" ? "free" : "paid"}">${course.type}</span>
        <span class="drawer-duration"><i class="far fa-clock"></i> ${course.duration}</span>
      </div>
      <p class="drawer-desc">${course.description || ""}</p>
      <div class="drawer-actions">
        <a class="drawer-primary" href="${course.link}" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-arrow-up-right-from-square"></i> Open on ${course.provider}
        </a>
        <button type="button" class="drawer-secondary favorite-btn-drawer" data-fav-link="${course.link}">
          <i class="${isFavorite(course.link) ? "fas" : "far"} fa-heart"></i>
          ${isFavorite(course.link) ? "Saved" : "Save"}
        </button>
      </div>
      ${
        related.length
          ? `<h3 class="drawer-related-title">Related</h3>
             <ul class="drawer-related">${related
               .map(
                 (r) =>
                   `<li><button type="button" data-open-details="${r.link}">${r.name}</button> <span>${r.provider}</span></li>`
               )
               .join("")}</ul>`
          : ""
      }
    `;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-drawer]")) closeDrawer();

    const detailsBtn = e.target.closest(".btn-details, [data-open-details]");
    if (detailsBtn) {
      const link = detailsBtn.getAttribute("data-link") || detailsBtn.getAttribute("data-open-details");
      if (link) openDrawer(link);
    }

    const view = e.target.closest("[data-track-view]");
    if (view) {
      const link = view.getAttribute("data-track-view");
      const c = findCourse(link);
      if (c) pushRecent(c);
    }

    const favBtn = e.target.closest(".favorite-btn-drawer");
    if (favBtn) {
      const link = favBtn.getAttribute("data-fav-link");
      toggleFavorite(link);
      openDrawer(link); // refresh
      applyFilters();
    }
  });

  /* ── Export saved ────────────────────────────────────────────── */
  $("#export-saved")?.addEventListener("click", () => {
    const favs = getFavorites();
    const rows = courses.filter((c) => favs.includes(c.link));
    if (!rows.length) {
      alert("No saved courses yet. Tap the heart on a course first.");
      return;
    }
    const md = [
      "# Coursora — Saved courses",
      "",
      ...rows.map((c) => `- **${c.name}** (${c.type}) — ${c.provider} — ${c.link}`),
      "",
      `_Exported ${new Date().toISOString().slice(0, 10)}_`,
    ].join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coursora-saved.md";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ── Shortcuts modal ─────────────────────────────────────────── */
  const shortcuts = $("#shortcuts-modal");
  function openShortcuts() {
    if (!shortcuts) return;
    shortcuts.hidden = false;
  }
  function closeShortcuts() {
    if (!shortcuts) return;
    shortcuts.hidden = true;
  }
  $("#shortcuts-btn")?.addEventListener("click", openShortcuts);
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-shortcuts]")) closeShortcuts();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeShortcuts();
    }
    // / focuses search when not typing in input
    if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      searchText?.focus();
    }
    if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      e.preventDefault();
      openShortcuts();
    }
  });

  // provider chips removed — Category/Provider dropdowns already cover this

  // Initial chips

  // Initial chips state
  if (typeof applyFilters === "function") {
    // don't re-filter if already done; just sync chips from current controls
    window.__cmOnFiltersApplied?.([], {
      query: searchText?.value.trim().toLowerCase() || "",
      selectedCategory: categorySelect?.value || "",
      selectedType: typeSelect?.value || "",
      selectedProvider: providerSelect?.value || "",
      onlyFavorites: typeof showFavoritesOnly !== "undefined" && showFavoritesOnly,
    });
  }
})();
