// Music Gate Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Music gate initialized');
    
    // DOM Elements
    const elements = {
        musicGate: document.getElementById('musicGate'),
        spotifyPlayer: document.getElementById('spotifyPlayer'),
        manualContinueBtn: document.getElementById('manualContinueBtn'),
        loadingIndicator: document.getElementById('loadingIndicator')
    };
    
    // State
    let musicStarted = false;
    let detectionTimer = null;
    
    // Initialize
    function initialize() {
        // Show loading indicator after a moment
        setTimeout(() => {
            elements.loadingIndicator.classList.add('visible');
        }, 2000);
        
        // Show manual continue button after 10 seconds
        setTimeout(() => {
            elements.manualContinueBtn.style.display = 'block';
        }, 10000);
        
        // Manual continue button
        elements.manualContinueBtn.addEventListener('click', function() {
            proceedToMainWebsite();
        });
        
        // Start detection attempts
        startDetection();
    }
    
    // Start music detection attempts
    function startDetection() {
        // Since we can't directly detect Spotify playback due to security restrictions,
        // we'll use a combination of approaches
        
        // Approach 1: Listen for any user interaction with the iframe
        setupIframeInteractionDetection();
        
        // Approach 2: Check for visible play indicators
        setupVisualDetection();
        
        // Approach 3: Redirect after manual button click
        setupManualOverride();
        
        // Approach 4: Listen for window focus/blur (music might cause tab to become active)
        setupFocusDetection();
    }
    
    function setupIframeInteractionDetection() {
        // Listen for clicks anywhere on the page
        document.addEventListener('click', function() {
            console.log('User clicked somewhere, assuming music might start');
            // Start a timer to check for music
            startMusicCheckTimer();
        });
        
        // Listen for touches
        document.addEventListener('touchstart', function() {
            console.log('User touched screen, assuming music might start');
            startMusicCheckTimer();
        });
    }
    
    function setupVisualDetection() {
        // Try to detect visual changes in the iframe
        // Note: This is limited due to CORS, but we can try
        try {
            // Add a mutation observer to watch for iframe attribute changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'src') {
                        console.log('Iframe src changed, music might be playing');
                        startMusicCheckTimer();
                    }
                });
            });
            
            observer.observe(elements.spotifyPlayer, { attributes: true });
        } catch (e) {
            console.log('Mutation observer not available');
        }
    }
    
    function setupManualOverride() {
        // Already set up the manual continue button
    }
    
    function setupFocusDetection() {
        // When user returns to tab, they might have started music
        window.addEventListener('blur', function() {
            console.log('Window blurred, user might be interacting with music player');
        });
        
        window.addEventListener('focus', function() {
            console.log('Window focused again, checking for music');
            startMusicCheckTimer();
        });
    }
    
    function startMusicCheckTimer() {
        // Clear any existing timer
        if (detectionTimer) {
            clearTimeout(detectionTimer);
        }
        
        // Start a new timer to proceed after a delay
        detectionTimer = setTimeout(function() {
            // If we haven't already proceeded, assume music started
            if (!musicStarted) {
                console.log('Assuming music started after user interaction');
                proceedToMainWebsite();
            }
        }, 3000); // Wait 3 seconds after interaction
    }
    
    function proceedToMainWebsite() {
        if (musicStarted) return;
        
        musicStarted = true;
        console.log('🎶 Proceeding to main website');
        
        // Show success animation
        showSuccessAnimation();
        
        // Wait for animation, then redirect
        setTimeout(function() {
            // Store in localStorage that music was started
            localStorage.setItem('valentineMusicStarted', 'true');
            localStorage.setItem('valentineMusicTimestamp', Date.now().toString());
            
            // Redirect to main website
            window.location.href = 'main.html';
        }, 2000);
    }
    
    function showSuccessAnimation() {
        // Create success animation overlay
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-animation';
        successOverlay.innerHTML = `
            <div class="success-heart">💜</div>
            <div class="success-text">Music Started!<br>Taking you to the magic...</div>
        `;
        
        document.body.appendChild(successOverlay);
        
        // Show animation
        setTimeout(() => {
            successOverlay.classList.add('visible');
        }, 10);
    }
    
    // Check if user already started music previously
    function checkPreviousSession() {
        const musicStarted = localStorage.getItem('valentineMusicStarted');
        const timestamp = localStorage.getItem('valentineMusicTimestamp');
        
        if (musicStarted === 'true' && timestamp) {
            const timeDiff = Date.now() - parseInt(timestamp);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            // If less than 1 hour ago, skip gate
            if (hoursDiff < 1) {
                console.log('Music started recently, redirecting directly');
                window.location.href = 'main.html';
                return true;
            }
        }
        return false;
    }
    
    // Start everything
    if (!checkPreviousSession()) {
        initialize();
    }
});