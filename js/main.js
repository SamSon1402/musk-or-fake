/**
 * Main JavaScript Entry Point
 * 
 * Initializes the "Musk or Fake" game and sets up event handlers.
 */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    initializeGame();
    
    // Set up event listeners for interactive elements
    setupEventListeners();
    
    // Check if user has played today
    checkIfPlayedToday();
});

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Contact button in ad banner
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            alert("This would be a contact form in a real app. Only very smart people would see it!");
        });
    }
    
    // Reset button functionality
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetGame();
            
            // Add a fun animation to the button
            this.classList.add('resetting');
            setTimeout(() => {
                this.classList.remove('resetting');
            }, 500);
        });
    }
    
    // Reset button in success message
    const resetButtonSuccess = document.getElementById('resetButtonSuccess');
    if (resetButtonSuccess) {
        resetButtonSuccess.addEventListener('click', function(e) {
            e.preventDefault();
            resetGame();
            
            // Hide success message when resetting
            document.getElementById('successMessage').style.display = 'none';
        });
    }
    
    // Add window beforeunload event to save game state
    window.addEventListener('beforeunload', function() {
        if (gameQuotes.length > 0) {
            saveGameState();
        }
    });
    
    // Handle touch events for mobile devices
    document.querySelectorAll('.quote-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // Share button event is handled directly in the HTML with onclick="handleShare()"
    
    // Add a keyboard shortcut to restart the game (Shift + R)
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'R') {
            resetGame();
        }
    });
}

/**
 * Reset the game with new quotes
 */
function resetGame() {
    // Clear previous game state
    gameWon = false;
    
    // Hide any active elements
    document.getElementById('characterBubble').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    
    // Initialize a new game with fresh quotes
    initializeGame();
    
    // Add cool reset feedback
    const feedbackMessages = [
        "New quotes loaded!",
        "Fresh batch of Musk wisdom!",
        "Let's try again!",
        "New challenge activated!",
        "Game refreshed!",
        "Round two, fight!",
        "New quotes, who dis?"
    ];
    
    // Show a brief feedback toast
    showResetFeedback(getRandomItem(feedbackMessages));
    
    // Scroll to top if needed
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Show a brief feedback message when resetting the game
 * @param {string} message - The message to display
 */
function showResetFeedback(message) {
    // Create a toast element if it doesn't exist
    let toast = document.getElementById('resetToast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'resetToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#5E60CE';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '20px';
        toast.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

// Add a global easter egg for fun
console.log(
    "%c🚀 Welcome to Musk or Fake 🚀", 
    "color: #DB3A34; font-size: 20px; font-weight: bold;"
);
console.log(
    "%cCan you tell which Elon quotes are real and which are fake?", 
    "color: #002868; font-size: 14px;"
);