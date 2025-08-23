// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    
    // Update theme icons
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    if (newTheme === 'dark') {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeIconMobile) themeIconMobile.className = 'fas fa-sun';
    } else {
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (themeIconMobile) themeIconMobile.className = 'fas fa-moon';
    }
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme icons
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    if (savedTheme === 'dark') {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeIconMobile) themeIconMobile.className = 'fas fa-sun';
    }
}

// Mobile navigation toggle
function toggleMobileNav() {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.classList.toggle('nav-visible');
    mobileNav.classList.toggle('nav-hidden');
}

// Fullscreen game functionality
function enterFullscreenGame() {
    const gameSection = document.querySelector('#game .game-placeholder');
    const fullscreenGame = document.getElementById('fullscreen-game');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainContent = document.querySelector('main');
    
    // Hide other sections
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (gameSection) gameSection.style.display = 'none';
    
    // Show fullscreen game
    fullscreenGame.classList.remove('hidden');
    fullscreenGame.classList.add('fullscreen-game');
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

function exitFullscreenGame() {
    const gameSection = document.querySelector('#game .game-placeholder');
    const fullscreenGame = document.getElementById('fullscreen-game');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainContent = document.querySelector('main');
    
    // Show all sections
    if (header) header.style.display = 'block';
    if (footer) footer.style.display = 'block';
    if (mainContent) mainContent.style.display = 'block';
    if (gameSection) gameSection.style.display = 'flex';
    
    // Hide fullscreen game
    fullscreenGame.classList.add('hidden');
    fullscreenGame.classList.remove('fullscreen-game');
    
    // Enable scrolling
    document.body.style.overflow = 'auto';
    
    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        // Show warning that game must be exited through in-game options
        alert('Please use the "EXIT GAME" button to exit properly. Progress may be lost if you force quit.');
        event.preventDefault();
    }
}

// Close mobile nav when clicking outside
document.addEventListener('click', function(event) {
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (mobileNav && mobileNav.classList.contains('nav-visible') && 
        !mobileNav.contains(event.target) && 
        hamburger && !hamburger.contains(event.target)) {
        mobileNav.classList.remove('nav-visible');
        mobileNav.classList.add('nav-hidden');
    }
});

// Responsive design adjustments
function handleResize() {
    const mobileNav = document.querySelector('.mobile-nav');
    if (window.innerWidth > 768 && mobileNav) {
        mobileNav.classList.remove('nav-visible');
        mobileNav.classList.add('nav-hidden');
    }
}

window.addEventListener('resize', handleResize);

// Image upload functionality
let uploadedImage = null;

function initializeImageUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const imageInput = document.getElementById('image-input');
    const uploadedImageDiv = document.getElementById('uploaded-image');
    const previewImage = document.getElementById('preview-image');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        imageInput.click();
    });

    // File input change
    imageInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    const uploadZone = document.getElementById('upload-zone');
    uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    const uploadZone = document.getElementById('upload-zone');
    uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    const uploadZone = document.getElementById('upload-zone');
    uploadZone.classList.remove('drag-over');
    
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
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB.');
        return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = file;
        showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function showImagePreview(src) {
    const uploadZone = document.getElementById('upload-zone');
    const uploadedImageDiv = document.getElementById('uploaded-image');
    const previewImage = document.getElementById('preview-image');

    previewImage.src = src;
    uploadZone.classList.add('hidden');
    uploadedImageDiv.classList.remove('hidden');
}

function removeImage() {
    uploadedImage = null;
    const uploadZone = document.getElementById('upload-zone');
    const uploadedImageDiv = document.getElementById('uploaded-image');
    const imageInput = document.getElementById('image-input');

    uploadZone.classList.remove('hidden');
    uploadedImageDiv.classList.add('hidden');
    imageInput.value = '';
}

function showError(message) {
    const results = document.getElementById('results-display');
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
function verifyClaim() {
    const input = document.getElementById('fact-check-input');
    const results = document.getElementById('results-display');
    
    if (!input.value.trim() && !uploadedImage) {
        showError('Please provide a text claim or upload an image to verify.');
        return;
    }
    
    results.innerHTML = `
        <p class="text-center text-[#BC2231]">🔍 ANALYZING...</p>
        <p class="text-center text-[#057087] text-xs mt-2">
            ${uploadedImage ? 'Processing image and checking against databases...' : 'Checking against trusted databases...'}
        </p>
    `;
    
    // Simulate fact-checking process
    setTimeout(() => {
        const isFake = Math.random() > 0.5;
        const topic = input.value.trim() || 'Uploaded Image';
        
        if (isFake) {
            results.innerHTML = `
                <p class="text-center text-[#BC2231]">🚨 POTENTIAL MISINFORMATION DETECTED</p>
                <p class="text-center text-[#057087] text-xs mt-2">
                    ${uploadedImage ? 'This image appears to contain unreliable information' : 'This claim appears unreliable based on our verification'}
                </p>
                ${uploadedImage ? '<p class="text-center text-[#BC2231] text-xs mt-2">⚠️ Image may be manipulated or from unreliable source</p>' : ''}
            `;
        } else {
            results.innerHTML = `
                <p class="text-center text-[#54B0BF]">✅ VERIFIED</p>
                <p class="text-center text-[#057087] text-xs mt-2">
                    ${uploadedImage ? 'This image appears to contain accurate information' : 'This appears to be accurate information'}
                </p>
                ${uploadedImage ? '<p class="text-center text-[#54B0BF] text-xs mt-2">🔍 Image analysis completed successfully</p>' : ''}
            `;
        }
        
        // Show research prompt after results
        showResearchPrompt(topic);
    }, 2000);
}

// Show research prompt
function showResearchPrompt(topic) {
    const researchPrompt = document.getElementById('research-prompt');
    const currentTopic = document.getElementById('current-topic');
    
    if (researchPrompt && currentTopic) {
        currentTopic.textContent = topic;
        researchPrompt.style.display = 'block';
    }
}

// Open research panel
function openResearchPanel(type) {
    const researchPanel = document.getElementById('research-panel');
    const panelTitle = document.getElementById('research-panel-title');
    
    if (researchPanel && panelTitle) {
        // Set panel title based on type
        const titles = {
            'sources': 'Deep Dive: Find More Sources',
            'questions': 'Deep Dive: Ask Related Questions',
            'cases': 'Deep Dive: See Similar Cases'
        };
        
        panelTitle.textContent = titles[type] || 'Deep Dive Panel';
        researchPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Redirect to research page
function redirectToResearch(type) {
    const currentTopic = document.getElementById('current-topic')?.textContent || 'Current Topic';
    const encodedTopic = encodeURIComponent(currentTopic);
    
    // Redirect to research page with topic parameter
    window.location.href = `research.html?topic=${encodedTopic}&type=${type}`;
}

// Close research panel
function closeResearchPanel() {
    const researchPanel = document.getElementById('research-panel');
    
    if (researchPanel) {
        researchPanel.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close research panel when clicking outside
document.addEventListener('click', function(event) {
    const researchPanel = document.getElementById('research-panel');
    const researchPanelContent = document.querySelector('.research-panel-content');
    
    if (researchPanel && researchPanel.classList.contains('active') && 
        !researchPanelContent.contains(event.target)) {
        closeResearchPanel();
    }
});

// Initialize image upload when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImageUpload();
});

// Initialize
loadTheme();
handleResize();
