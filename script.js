// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);

  // Update theme icons
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");

  if (newTheme === "dark") {
    if (themeIcon) themeIcon.className = "fas fa-sun";
    if (themeIconMobile) themeIconMobile.className = "fas fa-sun";
  } else {
    if (themeIcon) themeIcon.className = "fas fa-moon";
    if (themeIconMobile) themeIconMobile.className = "fas fa-moon";
  }

  // Save theme preference
  localStorage.setItem("theme", newTheme);
}

// Load saved theme preference
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);

  // Update theme icons
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");

  if (savedTheme === "dark") {
    if (themeIcon) themeIcon.className = "fas fa-sun";
    if (themeIconMobile) themeIconMobile.className = "fas fa-sun";
  }
}

// Mobile navigation toggle
function toggleMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  mobileNav.classList.toggle("nav-visible");
  mobileNav.classList.toggle("nav-hidden");
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

function exitFullscreenGame() {
  const gameSection = document.querySelector("#game .game-placeholder");
  const fullscreenGame = document.getElementById("fullscreen-game");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const mainContent = document.querySelector("main");

  // Show all sections
  if (header) header.style.display = "block";
  if (footer) footer.style.display = "block";
  if (mainContent) mainContent.style.display = "block";
  if (gameSection) gameSection.style.display = "flex";

  // Hide fullscreen game
  fullscreenGame.classList.add("hidden");
  fullscreenGame.classList.remove("fullscreen-game");

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
  if (window.innerWidth > 768 && mobileNav) {
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
  results.innerHTML = `
        <p class="text-center text-[#BC2231]">❌ ERROR</p>
        <p class="text-center text-[#057087] text-xs mt-2">${message}</p>
    `;

  setTimeout(() => {
    results.innerHTML = `
            <p class="text-center text-[#057087]">Verification results will appear here...</p>
        `;
  }, 3000);
}

// Fact checker functionality
// function verifyClaim() // Updated fact checker functionality that connects to your backend
async function verifyClaim() {
  const input = document.getElementById("fact-check-input");
  const results = document.getElementById("results-display");

  if (!input.value.trim() && !uploadedImage) {
    showError("Please provide a text claim or upload an image to verify.");
    return;
  }

  const claim = input.value.trim();

  // Show loading state
  results.innerHTML = `
    <div class="text-center">
      <div class="loading-spinner"></div>
      <p class="text-[#BC2231] mt-2">🔍 ANALYZING...</p>
      <p class="text-[#057087] text-xs mt-2">
        ${
          uploadedImage
            ? "Processing image and checking against databases..."
            : "Checking against trusted databases..."
        }
      </p>
    </div>
  `;

  try {
    // Prepare the message for the chatbot
    let message;
    if (uploadedImage && claim) {
      message = `Please fact-check this claim with image context: "${claim}". Provide a detailed analysis including: 1) Verification status (True/False/Partially True/Unverifiable), 2) Evidence and sources, 3) Context and background, 4) Any misinformation patterns detected.`;
    } else if (uploadedImage) {
      message = `Please analyze this uploaded image for potential misinformation. Check for: 1) Image authenticity, 2) Content accuracy, 3) Source verification, 4) Any manipulation signs.`;
    } else {
      message = `Please fact-check this claim: "${claim}". Provide a detailed analysis including: 1) Verification status (True/False/Partially True/Unverifiable), 2) Evidence and sources, 3) Context and background, 4) Any misinformation patterns detected.`;
    }

    // Send to your backend
    const response = await fetch("http://localhost:5000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.reply || "Unable to verify this claim at the moment.";

    // Display the results from your AI chatbot
    results.innerHTML = `
      <div class="fact-check-result">
        <div class="result-header mb-4">
          <h3 class="text-lg font-bold text-[#057087] mb-2">🔍 AI Fact-Check Results</h3>
          ${
            claim
              ? `
            <div class="claim-box p-3 bg-gray-100 border-l-4 border-[#54B0BF] mb-3">
              <p class="text-sm text-gray-700"><strong>Claim:</strong> "${claim}"</p>
            </div>
          `
              : ""
          }
          ${
            uploadedImage
              ? `
            <div class="image-box p-3 bg-blue-50 border-l-4 border-[#54B0BF] mb-3">
              <p class="text-sm text-blue-700">📸 <strong>Image Analysis:</strong> Uploaded image processed</p>
            </div>
          `
              : ""
          }
        </div>
        
        <div class="analysis-result p-4 bg-white border-2 border-[#54B0BF] rounded">
          <div class="whitespace-pre-wrap text-sm text-[#057087] leading-relaxed">${botReply}</div>
        </div>
        
        <div class="result-footer mt-4 text-center">
          <p class="text-xs text-gray-600">
            🤖 AI-powered analysis • ⚠️ Always cross-reference with multiple trusted sources
          </p>
        </div>
      </div>
    `;

    // Show research prompt after results
    const topic = claim || "Uploaded Image Analysis";
    showResearchPrompt(topic);
  } catch (error) {
    console.error("Fact-check error:", error);
    results.innerHTML = `
      <div class="error-result p-4 bg-red-50 border-2 border-red-200 rounded">
        <p class="text-red-700 font-bold mb-2">❌ Verification Error</p>
        <p class="text-red-600 text-sm">
          Unable to connect to fact-checking service. Please check your internet connection and try again.
        </p>
        <p class="text-xs text-red-500 mt-2">
          Error: ${error.message}
        </p>
        <div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p class="text-yellow-800 text-xs">
            💡 <strong>Tip:</strong> Make sure your server is running on http://localhost:5000
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
    currentTopic.textContent = topic;
    researchPrompt.style.display = "block";
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
  const currentTopic =
    document.getElementById("current-topic")?.textContent || "Current Topic";
  const encodedTopic = encodeURIComponent(currentTopic);

  // Redirect to research page with topic parameter
  window.location.href = `research.html?topic=${encodedTopic}&type=${type}`;
}

// Close research panel
function closeResearchPanel() {
  const researchPanel = document.getElementById("research-panel");

  if (researchPanel) {
    researchPanel.classList.remove("active");
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
  // Inject page-specific CSS file based on current page
  try {
    const head = document.head;
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const map = {
      '': 'home.css',
      'index.html': 'home.css',
      'research.html': 'research.css',
      'fact-check.html': 'fact-check.css',
      'game.html': 'game.css',
      'resources.html': 'resources.css'
    };
    const cssFile = map[file] || null;
    if (cssFile) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssFile;
      head.appendChild(link);
    }
  } catch (e) {
    console.warn('Page CSS injection failed:', e);
  }

  initializeImageUpload();
});

// Initialize
loadTheme();
handleResize();

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
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

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
