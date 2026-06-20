/**
 * main.js — Portfolio interactivity
 * Handles: Navbar, Showreel player, Project grid filters, Modal lightbox,
 *          Skill bars animation, Scroll reveal, Mobile menu
 */

// ─── DOM Ready ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initShowreel();
  initProjectGrid();
  initModal();
  initSkillBars();
  initScrollReveal();
  initMobileMenu();
  initScrollToTop();
  initImageFallback();
  renderProjects();
});

// ─── Navbar scroll behaviour ─────────────────────────────────────────────────
function initNavbar() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("navbar--scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ─── Mobile menu ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.querySelector(".nav-hamburger");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  // Close on link click
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

// ─── Showreel Player ──────────────────────────────────────────────────────────
function initShowreel() {
  const poster = document.querySelector(".showreel-poster");
  const video = document.getElementById("showreel-video");
  const playBtn = document.querySelector(".showreel-play-btn");
  const muteBtn = document.getElementById("ctrl-mute");
  const playPauseBtn = document.getElementById("ctrl-playpause");
  const progressFill = document.querySelector(".ctrl-progress-fill");
  const progressTrack = document.querySelector(".ctrl-progress");
  const timeEl = document.getElementById("ctrl-time");
  const fullscreenBtn = document.getElementById("ctrl-fullscreen");
  const container = document.querySelector(".showreel-video-container");

  if (!video) return;

  // Poster click — start playback
  const startPlay = () => {
    video.play().catch(() => {});
    poster?.classList.add("hidden");
  };
  poster?.addEventListener("click", startPlay);
  playBtn?.addEventListener("click", startPlay);

  // Play/Pause ctrl button
  playPauseBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (video.paused) video.play();
    else video.pause();
  });

  video.addEventListener("play", () => {
    if (playPauseBtn) playPauseBtn.innerHTML = pauseIcon();
  });
  video.addEventListener("pause", () => {
    if (playPauseBtn) playPauseBtn.innerHTML = playIcon();
  });

  // Mute toggle
  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? muteIcon() : volumeIcon();
  });

  // Progress bar
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = pct + "%";
    if (timeEl) timeEl.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
  });

  progressTrack?.addEventListener("click", (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  // Fullscreen — uses native fullscreen API via user gesture (allowed)
  fullscreenBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    try {
      if (document.fullscreenElement) { document.exitFullscreen && document.exitFullscreen(); }
      else if (container && container.requestFullscreen) { container.requestFullscreen(); }
    } catch (_) {}
  });
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function playIcon() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`; }
function pauseIcon() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`; }
function volumeIcon() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`; }
function muteIcon() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`; }
function fullscreenIcon() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`; }

// ─── Project Grid + Filters ───────────────────────────────────────────────────

let activeFilter = "all";

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid || typeof PROJECTS === "undefined") return;
  grid.innerHTML = "";

  PROJECTS.forEach((proj, i) => {
    const hasVideo = proj.media.some(isIframeMedia);
    const badgeClass = categoryBadgeClass(proj.category);
    const card = document.createElement("article");
    card.className = `project-card reveal reveal-delay-${(i % 4) + 1}`;
    card.dataset.category = proj.category;
    card.dataset.id = proj.id;
    card.innerHTML = `
      <div class="project-art-frame">
        <img src="${proj.coverImage}" alt="${proj.title}" loading="lazy">
        <span class="project-badge ${badgeClass}">${categoryLabel(proj.category)}</span>
        ${hasVideo ? `<div class="project-play-icon">${playIcon()}</div>` : ""}
      </div>
      <div class="project-body">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(t => `<span class="project-tag"># ${t}</span>`).join("")}
        </div>
        <div class="project-cta">
          <span>View Project</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openModal(proj));
    
    // Skeleton loading state
    const frame = card.querySelector(".project-art-frame");
    frame.classList.add("skeleton-loading");
    const img = card.querySelector("img");
    if (img.complete) {
      frame.classList.remove("skeleton-loading");
    } else {
      img.addEventListener("load", () => frame.classList.remove("skeleton-loading"));
    }

    grid.appendChild(card);
  });

  // Re-observe for scroll reveal
  observeReveal();
  applyFilter(activeFilter);
}

function categoryLabel(cat) {
  return { "3d-modeling": "3D Modeling", "rigging": "Rigging", "3d-animation": "Animation" }[cat] || cat;
}
function categoryBadgeClass(cat) {
  return { "rigging": "green", "3d-animation": "white" }[cat] || "";
}

function initProjectGrid() {
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      applyFilter(activeFilter);
    });
  });
}

function applyFilter(filter) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const show = filter === "all" || card.dataset.category === filter;
    card.style.display = show ? "" : "none";
  });
}

// ─── Modal Lightbox ───────────────────────────────────────────────────────────

let currentProject = null;
let currentMediaIndex = 0;

function initModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("stage-prev");
  const nextBtn = document.getElementById("stage-next");

  if (!overlay) return;

  // Close on overlay bg click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  closeBtn?.addEventListener("click", closeModal);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") navigateMedia(-1);
    if (e.key === "ArrowRight") navigateMedia(1);
  });

  prevBtn?.addEventListener("click", () => navigateMedia(-1));
  nextBtn?.addEventListener("click", () => navigateMedia(1));
}

function openModal(project) {
  currentProject = project;
  currentMediaIndex = 0;
  renderModalContent();
  const overlay = document.getElementById("modal-overlay");
  overlay?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay?.classList.remove("open");
  document.body.style.overflow = "";
  // Stop any iframes playing
  const stage = document.getElementById("modal-stage");
  if (stage) stage.innerHTML = "";
  currentProject = null;
}

function navigateMedia(dir) {
  if (!currentProject) return;
  const total = currentProject.media.length;
  currentMediaIndex = (currentMediaIndex + dir + total) % total;
  renderStage();
  renderThumbs();
}

function renderModalContent() {
  if (!currentProject) return;
  const proj = currentProject;

  // Sidebar
  const badge = document.getElementById("modal-badge");
  const title = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-desc");
  const client = document.getElementById("modal-client");
  const year = document.getElementById("modal-year");
  const tagsWrap = document.getElementById("modal-tags");
  const counter = document.getElementById("modal-counter");

  if (badge) badge.textContent = categoryLabel(proj.category);
  if (title) title.textContent = proj.title;
  if (descEl) descEl.textContent = proj.description;
  if (client) client.textContent = proj.client;
  if (year) year.textContent = proj.year;
  if (tagsWrap) {
    tagsWrap.innerHTML = proj.tags.map(t => `<span class="modal-tag">${t}</span>`).join("");
  }
  if (counter) counter.textContent = `${currentMediaIndex + 1} / ${proj.media.length} assets`;

  renderStage();
  renderThumbs();
}

function renderStage() {
  const stage = document.getElementById("modal-stage");
  const counter = document.getElementById("modal-counter");
  if (!stage || !currentProject) return;

  const mediaUrl = currentProject.media[currentMediaIndex];
  const isVideo = isIframeMedia(mediaUrl);

  // Clear previous content
  stage.innerHTML = "";

  if (isVideo) {
    // Render iframe for video embed
    const iframe = document.createElement("iframe");
    iframe.src = mediaUrl;
    iframe.className = "embed-content";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    stage.appendChild(iframe);
  } else {
    // Render image
    const img = document.createElement("img");
    img.src = mediaUrl;
    img.className = "stage-img";
    img.alt = currentProject.title + " — asset " + (currentMediaIndex + 1);
    img.loading = "eager";
    stage.appendChild(img);
  }

  // Update thumb active state
  document.querySelectorAll(".stage-thumb").forEach((th, i) => {
    th.classList.toggle("active", i === currentMediaIndex);
  });

  if (counter) counter.textContent = `${currentMediaIndex + 1} / ${currentProject.media.length} assets`;

  // Show/hide prev/next if only 1 item
  const prevBtn = document.getElementById("stage-prev");
  const nextBtn = document.getElementById("stage-next");
  const single = currentProject.media.length <= 1;
  if (prevBtn) prevBtn.style.display = single ? "none" : "";
  if (nextBtn) nextBtn.style.display = single ? "none" : "";
}

function renderThumbs() {
  const strip = document.getElementById("stage-thumbs");
  if (!strip || !currentProject) return;
  strip.innerHTML = "";
  if (currentProject.media.length <= 1) return;

  currentProject.media.forEach((url, i) => {
    const isVideo = isIframeMedia(url);
    const th = document.createElement("button");
    th.className = `stage-thumb ${isVideo ? "is-video" : ""} ${i === currentMediaIndex ? "active" : ""}`;
    th.setAttribute("aria-label", `View asset ${i + 1}`);
    if (!isVideo) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "";
      img.loading = "lazy";
      th.appendChild(img);
    }
    th.addEventListener("click", () => {
      currentMediaIndex = i;
      renderStage();
      renderThumbs();
    });
    strip.appendChild(th);
  });
}

// ─── Skill Bars Animation ─────────────────────────────────────────────────────
function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".skill-bar-fill").forEach(bar => {
            bar.classList.add("animated");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll(".skill-card").forEach(card => observer.observe(card));
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function observeReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

function initScrollReveal() {
  observeReveal();
}

// ─── Scroll to Top Button ──────────────────────────────────────────────────────
function initScrollToTop() {
  const btn = document.getElementById("scroll-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── Global Image Fallback Handler ─────────────────────────────────────────────
function initImageFallback() {
  window.addEventListener("error", (e) => {
    if (e.target && e.target.tagName === "IMG") {
      e.target.style.display = "none";
      const fallback = document.createElement("div");
      fallback.className = "img-error-fallback";
      fallback.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px; color: var(--color-text-muted);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Image unavailable</span>
      `;
      fallback.style.display = "flex";
      fallback.style.flexDirection = "column";
      fallback.style.alignItems = "center";
      fallback.style.justifyContent = "center";
      fallback.style.width = "100%";
      fallback.style.height = "100%";
      fallback.style.background = "var(--color-surface-2)";
      fallback.style.border = "1px dashed var(--color-border)";
      fallback.style.borderRadius = "var(--radius-md)";
      e.target.parentNode.appendChild(fallback);
    }
  }, true);
}
