// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);

  // Update theme icons (Check if elements exist)
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");
  if (newTheme === "dark") {
    if (themeIcon) themeIcon.className = "fas fa-sun";
    if (themeIconMobile) themeIconMobile.className = "fas fa-sun";
  } else {
    if (themeIcon) themeIcon.className = "fas fa-moon";
    if (themeIconMobile) themeIconMobile.className = "fas fa-moon";
  }
  localStorage.setItem("theme", newTheme);
}

// Load saved theme preference
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
  document.body.setAttribute("data-theme", savedTheme);

  // Update theme icons based on loaded theme
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");
  if (savedTheme === "dark") {
    if (themeIcon) themeIcon.className = "fas fa-sun";
    if (themeIconMobile) themeIconMobile.className = "fas fa-sun";
  } else {
    // Default to moon if light
    if (themeIcon) themeIcon.className = "fas fa-moon";
    if (themeIconMobile) themeIconMobile.className = "fas fa-moon";
  }
}

// Mobile navigation toggle
function toggleMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav) {
    mobileNav.classList.toggle("nav-visible");
    mobileNav.classList.toggle("nav-hidden");
  }
}

// Fullscreen game functionality
function enterFullscreenGame() {
  const gameSection = document.querySelector("#game .game-placeholder");
  const fullscreenGame = document.getElementById("fullscreen-game");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const mainContent = document.querySelector("main");

  // Hide other sections
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";
  if (mainContent) mainContent.style.display = "none";
  if (gameSection) gameSection.style.display = "none";

  // Show fullscreen game
  fullscreenGame.classList.remove("hidden");
  fullscreenGame.classList.add("fullscreen-game");

  // Prevent scrolling
  document.body.style.overflow = "hidden";

  // Add escape key listener
  document.addEventListener("keydown", handleEscapeKey);
}

// Enhanced fullscreen to load the exported RPG Maker MZ game in an iframe
function enterFullscreenGame() {
  const gameSection = document.querySelector("#game .game-placeholder");
  const fullscreenGame = document.getElementById("fullscreen-game");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const mainContent = document.querySelector("main");
  const iframe = document.getElementById("rpg-iframe");
  const iframeWrapper =
    document.getElementById("inpage-iframe-wrapper") ||
    document.getElementById("game-iframe-wrapper");

  // Hide header/footer but keep the main content area visible (so page doesn't blank out completely)
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";

  // Show fullscreen overlay container (used to style/cover page if needed)
  const fullscreenGameContainer = document.getElementById("fullscreen-game");
  if (fullscreenGameContainer) {
    fullscreenGameContainer.classList.remove("hidden");
    fullscreenGameContainer.classList.add("fullscreen-game");
  }

  // Request browser fullscreen on the in-page iframe wrapper so the iframe stays loaded
  try {
    if (iframeWrapper.requestFullscreen) {
      iframeWrapper.requestFullscreen();
    } else if (iframeWrapper.webkitRequestFullscreen) {
      iframeWrapper.webkitRequestFullscreen();
    } else if (iframeWrapper.msRequestFullscreen) {
      iframeWrapper.msRequestFullscreen();
    }
  } catch (e) {
    console.warn("Fullscreen request failed:", e);
  }

  // Prevent scrolling behind the fullscreen element
  document.body.style.overflow = "hidden";

  // Add escape key listener
  document.addEventListener("keydown", handleEscapeKey);
}

function exitFullscreenGame() {
  const gameSection = document.querySelector("#game .game-placeholder");
  const fullscreenGame = document.getElementById("fullscreen-game");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const mainContent = document.querySelector("main");
  const iframe = document.getElementById("rpg-iframe");
  const iframeWrapper = document.getElementById("game-iframe-wrapper");

  // Exit browser fullscreen if active
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    }
  } catch (e) {
    console.warn("Exit fullscreen failed:", e);
  }

  // Show header/footer again
  if (header) header.style.display = "block";
  if (footer) footer.style.display = "block";

  // Hide fullscreen overlay container but keep iframe loaded and visible in-page
  const fullscreenGameContainer = document.getElementById("fullscreen-game");
  if (fullscreenGameContainer) {
    fullscreenGameContainer.classList.add("hidden");
    fullscreenGameContainer.classList.remove("fullscreen-game");
  }

  // Ensure the in-page iframe remains visible (progress preserved)
  if (iframe) {
    iframe.style.display = "block";
  }

  // Enable scrolling
  document.body.style.overflow = "auto";

  // Remove escape key listener
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    // Show warning that game must be exited through in-game options
    alert(
      'Please use the "EXIT GAME" button to exit properly. Progress may be lost if you force quit.'
    );
    event.preventDefault();
  }
}

// Close mobile nav when clicking outside
document.addEventListener("click", function (event) {
  const mobileNav = document.querySelector(".mobile-nav");
  const hamburger = document.querySelector(".hamburger-menu");
  // Ensure elements exist before checking contains
  if (
    mobileNav &&
    mobileNav.classList.contains("nav-visible") &&
    !mobileNav.contains(event.target) &&
    hamburger &&
    !hamburger.contains(event.target)
  ) {
    mobileNav.classList.remove("nav-visible");
    mobileNav.classList.add("nav-hidden");
  }
});

// Responsive design adjustments
function handleResize() {
  const mobileNav = document.querySelector(".mobile-nav");
  if (
    window.innerWidth > 768 &&
    mobileNav &&
    mobileNav.classList.contains("nav-visible")
  ) {
    mobileNav.classList.remove("nav-visible");
    mobileNav.classList.add("nav-hidden");
  }
}
window.addEventListener("resize", handleResize);

// Image upload functionality
let uploadedImage = null;

function initializeImageUpload() {
  const uploadZone = document.getElementById("upload-zone");
  const imageInput = document.getElementById("image-input");
  const uploadedImageDiv = document.getElementById("uploaded-image");
  const previewImage = document.getElementById("preview-image");

  // Click to upload
  uploadZone.addEventListener("click", () => {
    imageInput.click();
  });

  // File input change
  imageInput.addEventListener("change", handleFileSelect);

  // Drag and drop events
  uploadZone.addEventListener("dragover", handleDragOver);
  uploadZone.addEventListener("dragleave", handleDragLeave);
  uploadZone.addEventListener("drop", handleDrop);

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDragOver(e) {
  const uploadZone = document.getElementById("upload-zone");
  uploadZone.classList.add("drag-over");
}

function handleDragLeave(e) {
  const uploadZone = document.getElementById("upload-zone");
  uploadZone.classList.remove("drag-over");
}

function handleDrop(e) {
  const uploadZone = document.getElementById("upload-zone");
  uploadZone.classList.remove("drag-over");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
}

function handleFile(file) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    showError("Please select a valid image file.");
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showError("Image size must be less than 5MB.");
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedImage = file;
    showImagePreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(src) {
  const uploadZone = document.getElementById("upload-zone");
  const uploadedImageDiv = document.getElementById("uploaded-image");
  const previewImage = document.getElementById("preview-image");

  previewImage.src = src;
  uploadZone.classList.add("hidden");
  uploadedImageDiv.classList.remove("hidden");
}

function removeImage() {
  uploadedImage = null;
  const uploadZone = document.getElementById("upload-zone");
  const uploadedImageDiv = document.getElementById("uploaded-image");
  const imageInput = document.getElementById("image-input");

  uploadZone.classList.remove("hidden");
  uploadedImageDiv.classList.add("hidden");
  imageInput.value = "";
}

function showError(message) {
  const results = document.getElementById("results-display");
  if (results) {
    results.innerHTML = `
          <p class="text-center text-[#BC2231]" style="color: var(--accent-danger);">❌ ERROR</p>
          <p class="text-center text-[#057087] text-xs mt-2" style="color: var(--brand-primary);">${message}</p>
      `;
    // Clear the error after a few seconds
    setTimeout(() => {
      if (results.innerHTML.includes("❌ ERROR")) {
        // Avoid clearing successful results
        results.innerHTML = `
                 <p class="text-center text-[#057087]" style="color: var(--brand-primary);">Verification results will appear here...</p>
             `;
      }
    }, 4000); // Increased timeout
  }
}
// Fact checker functionality
// function verifyClaim() // Updated fact checker functionality that connects to your backend
async function verifyClaim() {
  const input = document.getElementById("fact-check-input");
  const results = document.getElementById("results-display");
  const researchPrompt = document.getElementById("research-prompt"); // Get the research prompt div

  // Basic validation
  if (!input || !results) {
    console.error("Fact check input or results display element not found.");
    return;
  }
  const claim = input.value.trim();
  if (!claim) {
    showError("Please paste a suspicious claim into the box."); // Use showError for consistency
    return;
  }

  // 1. Show loading state in results display
  results.innerHTML = `
    <div class="text-center">
      <div class="loading-spinner"></div>
      <p class="text-[#BC2231] mt-2" style="color: var(--accent-danger);">🔍 ANALYZING...</p>
      <p class="text-[#057087] text-xs mt-2" style="color: var(--brand-primary);">
        Checking claim against web sources...
      </p>
    </div>
  `;

  // 2. Hide "More Research" prompt if it's already visible
  if (researchPrompt) {
    researchPrompt.style.display = "none";
  }

  try {
    // 3. Send claim to your backend API
    const response = await fetch(
      "https://misinfo-mau4.onrender.com/api/check",
      {
        // Use correct port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: claim }), // Backend expects 'query'
      }
    );

    // Handle HTTP errors (like 404, 500)
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Server returned an invalid response" }));
      throw new Error(
        `Server error (${response.status}): ${
          errorData.error || response.statusText
        }`
      );
    }

    const data = await response.json(); // Expects { conclusion, summary, sources }

    // Validate response structure (basic check)
    if (
      !data ||
      typeof data.conclusion === "undefined" ||
      typeof data.summary === "undefined" ||
      !Array.isArray(data.sources)
    ) {
      console.error("Invalid response structure received from server:", data);
      throw new Error("Received an invalid response format from the server.");
    }

    // 4. Build the HTML for the results
    //    Use lowercase and replace spaces with hyphens for the CSS class
    const conclusionText = data.conclusion || "Analysis"; // Fallback text
    const conclusionClass = `result-badge-${conclusionText
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Generate HTML list for sources
    const sourcesHTML =
      data.sources.length > 0
        ? data.sources
            .map(
              (url) => `
          <li class="result-source-item">
            <i class="fas fa-link source-icon"></i>
            <a href="${url}" target="_blank" rel="noopener noreferrer" title="Visit source: ${url}">${url}</a>
          </li>
        `
            )
            .join("")
        : '<li style="font-family: sans-serif; color: var(--text-secondary);">No specific sources cited for this summary.</li>'; // Message when no sources

    // Escape single quotes in the claim for use in the 'More Research' button's onclick
    const escapedClaim = claim.replace(/'/g, "\\'");

    // 5. Display the formatted results
    results.innerHTML = `
      <div class="fact-check-result">

        <div class="result-badge ${conclusionClass}">
          ${conclusionText}
        </div>

        <div class="claim-box p-3 bg-gray-100 border-l-4 border-[#54B0BF] mb-4" style="background-color: var(--bg-secondary); border-color: var(--brand-secondary);">
          <p class="text-sm text-gray-700" style="font-family: sans-serif; color: var(--text-secondary);">
            <strong>Claim:</strong> "${claim}"
          </p>
        </div>

        <h4 class="result-section-title">Summary:</h4>
        <p class="result-summary">${data.summary.trim()}</p>

        <h4 class="result-section-title">Sources:</h4>
        <ul class="result-sources-list">
          ${sourcesHTML}
        </ul>

        <div class="text-center mt-6">
          <button class="research-button" onclick="showResearchPrompt('${escapedClaim}')">
            <i class="fas fa-search-plus"></i> More Research
          </button>
        </div>

        <div class="result-footer mt-6 text-center">
          <p class="text-xs text-gray-600" style="color: var(--text-secondary);">
            🤖 AI-powered analysis • ⚠️ Always cross-reference multiple trusted sources
          </p>
        </div>
      </div>
    `;

    // 6. Show the "More Research" prompt after displaying results
    //    (The button click will call showResearchPrompt)
  } catch (error) {
    console.error("Fact-check fetch error:", error);
    // Display a user-friendly error message
    results.innerHTML = `
      <div class="error-result p-4 bg-red-50 border-2 border-red-200 rounded" style="background-color: rgba(188, 34, 49, 0.1); border-color: var(--accent-danger);">
        <p class="text-red-700 font-bold mb-2" style="color: var(--accent-danger);">❌ VERIFICATION ERROR</p>
        <p class="text-red-600 text-sm" style="color: var(--accent-danger); font-family: sans-serif;">
          Oops! Something went wrong while trying to verify the claim.
        </p>
        <p class="text-xs text-red-500 mt-2" style="color: var(--accent-danger); font-family: sans-serif;">
          <strong>Details:</strong> ${error.message}
        </p>
        <div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded" style="background-color: rgba(243, 136, 51, 0.1); border-color: var(--accent-warning);">
          <p class="text-yellow-800 text-xs" style="color: var(--accent-warning); font-family: sans-serif;">
            💡 <strong>Tip:</strong> Ensure the backend server is running at https://misinfo-mau4.onrender.com and check the server's console logs for more specific errors.
          </p>
        </div>
      </div>
    `;
  }
}

// Show research prompt
function showResearchPrompt(topic) {
  const researchPrompt = document.getElementById("research-prompt");
  const currentTopic = document.getElementById("current-topic");
  if (researchPrompt && currentTopic) {
    currentTopic.textContent = topic; // Update the topic display
    researchPrompt.style.display = "block"; // Show the prompt section
  } else {
    console.error("Research prompt elements not found.");
  }
}

// Open research panel
function openResearchPanel(type) {
  const researchPanel = document.getElementById("research-panel");
  const panelTitle = document.getElementById("research-panel-title");

  if (researchPanel && panelTitle) {
    // Set panel title based on type
    const titles = {
      sources: "Deep Dive: Find More Sources",
      questions: "Deep Dive: Ask Related Questions",
      cases: "Deep Dive: See Similar Cases",
    };

    panelTitle.textContent = titles[type] || "Deep Dive Panel";
    researchPanel.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Redirect to research page
function redirectToResearch(type) {
  const currentTopicElement = document.getElementById("current-topic");
  const currentTopic = currentTopicElement
    ? currentTopicElement.textContent
    : "Unknown Topic";
  const encodedTopic = encodeURIComponent(currentTopic);
  // Make sure you have a 'research.html' page to handle these parameters
  console.log(
    `Redirecting to research page for topic: ${currentTopic}, type: ${type}`
  );
  window.location.href = `research.html?topic=${encodedTopic}&type=${type}`;
}

// Close research panel
function closeResearchPanel() {
  const researchPanel = document.getElementById("research-panel"); // Assuming you have a panel element
  if (researchPanel) {
    researchPanel.classList.remove("active"); // Example class
    document.body.style.overflow = "auto";
  }
}

// Close research panel when clicking outside
document.addEventListener("click", function (event) {
  const researchPanel = document.getElementById("research-panel");
  const researchPanelContent = document.querySelector(
    ".research-panel-content"
  );

  if (
    researchPanel &&
    researchPanel.classList.contains("active") &&
    !researchPanelContent.contains(event.target)
  ) {
    closeResearchPanel();
  }
});

// Initialize image upload when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load theme and set initial responsive state first
  loadTheme();
  handleResize();

  // Initialize image upload only if relevant elements exist on the page
  // (Removed as per previous step, but kept structure in case you add it back)
  // if (document.getElementById("upload-zone")) {
  //   initializeImageUpload();
  // }

  // Inject page-specific CSS dynamically
  try {
    const head = document.head;
    const path = window.location.pathname;
    // Handle root path ('/') correctly
    const pageName =
      path === "/" ? "index.html" : path.substring(path.lastIndexOf("/") + 1);
    const file = pageName || "index.html"; // Default to index.html if empty
    const map = {
      "index.html": "home.css",
      "research.html": "research.css",
      "fact-check.html": "fact-check.css",
      "game.html": "game.css",
      "resources.html": "resources.css",
    };
    const cssFile = map[file.toLowerCase()];
    if (cssFile) {
      // Check if the link already exists
      if (!document.querySelector(`link[href="${cssFile}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssFile; // Assuming CSS files are in the same directory
        head.appendChild(link);
        console.log(`Loaded page-specific CSS: ${cssFile}`);
      }
    }
  } catch (e) {
    console.warn("Page CSS injection failed:", e);
  }
});

// Initialize
loadTheme();
handleResize();

// --- Hexagon background overlay logic ---
(function initHexagonBackground() {
  const canvas = document.getElementById("hexagon-canvas");
  const container = document.getElementById("hexagon-bg");
  if (!canvas || !container) return;

  const ctx = canvas.getContext("2d");
  let DPR = window.devicePixelRatio || 1;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.round(rect.width * DPR);
    canvas.height = Math.round((window.innerHeight - rect.top) * DPR);
    canvas.style.width = rect.width + "px";
    canvas.style.height = window.innerHeight - rect.top + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    draw();
  }

  // hexagon grid parameters (similar to animate-ui defaults)
  const hexSize = 50; // base size (px)
  const hexMargin = 6; // spacing
  const strokeColor = "rgba(255,255,255,0.08)";
  const hoverColor = "rgba(243,136,51,0.95)";

  let pointer = { x: -9999, y: -9999 };

  function hexToPixel(col, row, size) {
    const w = Math.sqrt(3) * size;
    const h = 2 * size;
    const x = col * (w + hexMargin) + (row % 2) * (w / 2);
    const y = row * ((3 / 4) * h + hexMargin);
    return { x, y };
  }

  function draw() {
    const w = canvas.width / DPR;
    const h = canvas.height / DPR;
    ctx.clearRect(0, 0, w, h);

    const size = hexSize;
    const hexW = Math.sqrt(3) * size;
    const hexH = 2 * size;

    const cols = Math.ceil(w / (hexW + hexMargin)) + 2;
    const rows = Math.ceil(h / (0.75 * hexH + hexMargin)) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const p = hexToPixel(c, r, size);
        const centerX = p.x;
        const centerY = p.y;
        // distance to pointer
        const dx = centerX - pointer.x;
        const dy = centerY - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // line alpha falls off with distance
        const alpha = Math.max(0, 0.6 - dist / 200);
        const lineAlpha = Math.min(0.12, alpha * 0.2) + 0.02;

        // draw hex
        drawHexagon(
          ctx,
          centerX,
          centerY,
          size - 6,
          `rgba(255,255,255,${lineAlpha})`
        );

        // if close to pointer, draw glow
        if (dist < 120) {
          const t = 1 - dist / 120;
          ctx.beginPath();
          drawHexagon(
            ctx,
            centerX,
            centerY,
            size * (0.4 + 0.6 * t),
            hoverColor.replace("0.95", String(0.4 * t))
          );
        }
      }
    }
  }

  function drawHexagon(ctx, cx, cy, size, strokeStyle) {
    const s = size;
    const a = Math.PI / 3; // 60deg
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const x = cx + s * Math.cos(a * i + Math.PI / 6);
      const y = cy + s * Math.sin(a * i + Math.PI / 6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = strokeStyle || strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // pointer events: only enable when user moves over top area below navbar
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointer.x = x;
    pointer.y = y;
    container.classList.add("hexagon-visible");
    container.classList.remove("hexagon-hidden");
    container.classList.add("hover-active");
    draw();
  }

  function onPointerLeave() {
    pointer.x = -9999;
    pointer.y = -9999;
    container.classList.remove("hover-active");
    container.classList.remove("hexagon-visible");
    container.classList.add("hexagon-hidden");
    draw();
  }

  // activate when mouse enters main content area (below header)
  function parseAlpha(colorStr) {
    if (!colorStr) return 1;
    const rgba = colorStr.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i
    );
    if (rgba) return rgba[4] !== undefined ? parseFloat(rgba[4]) : 1;
    // unknown formats assume opaque
    return 1;
  }

  function isPointOverTransparent(clientX, clientY) {
    let el = document.elementFromPoint(clientX, clientY);
    if (!el) return true;
    // If pointer is over the hexagon canvas itself or its container, allow effect
    if (el.id === "hexagon-canvas" || el.closest("#hexagon-bg")) return true;
    // If pointer is over an iframe (game) treat as opaque
    if (el.tagName === "IFRAME" || el.closest("iframe")) return false;

    // Walk up parents; if any visible ancestor has a background-image or opaque background color or reduced opacity -> opaque
    while (el && el !== document.documentElement) {
      const cs = window.getComputedStyle(el);
      if (!cs) break;
      if (cs.display === "none" || cs.visibility === "hidden") {
        el = el.parentElement;
        continue;
      }
      const bgImage = cs.backgroundImage;
      if (bgImage && bgImage !== "none") return false;
      const bgColor = cs.backgroundColor;
      const alpha = parseAlpha(bgColor);
      if (alpha > 0) return false; // non-transparent background
      const opacity = parseFloat(cs.opacity || "1");
      if (!isNaN(opacity) && opacity < 1) return false; // semi-transparent element (consider as non-transparent area)
      el = el.parentElement;
    }
    return true;
  }

  window.addEventListener("mousemove", function (e) {
    const header = document.querySelector("header");
    const headerBottom = header ? header.getBoundingClientRect().bottom : 64;
    if (
      e.clientY > headerBottom &&
      isPointOverTransparent(e.clientX, e.clientY)
    ) {
      onPointerMove(e);
    } else {
      // if pointer is over header or over an opaque element, hide overlay
      onPointerLeave();
    }
  });

  window.addEventListener("mouseleave", onPointerLeave);
  window.addEventListener("resize", resize);
  // initial
  resize();
})();

const button = document.getElementById("chatbot-button");
const windowEl = document.getElementById("chat-window");
const input = document.getElementById("chat-input");
const body = document.getElementById("chat-body");

// Toggle chatbot window
button.onclick = () => {
  windowEl.classList.toggle("hidden");
};

// Send message when pressing Enter
input.addEventListener("keypress", async function (e) {
  if (e.key === "Enter" && input.value.trim()) {
    let msg = input.value.trim();

    // Append user message
    body.innerHTML += `<div><b>You:</b> ${msg}</div>`;
    input.value = "";
    body.scrollTop = body.scrollHeight;

    // Send message to backend
    try {
      const response = await fetch(
        "https://misinfo-mau4.onrender.com/api/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg }),
        }
      );

      const data = await response.json();
      const botReply = data.reply || "⚠️ Sorry, I couldn't process that.";

      body.innerHTML += `<div><b>Bot:</b> ${botReply}</div>`;
      body.scrollTop = body.scrollHeight;
    } catch (error) {
      console.error("Chatbot error:", error);
      body.innerHTML += `<div><b>Bot:</b> ❌ Error connecting to server.</div>`;
      body.scrollTop = body.scrollHeight;
    }
  }
});
