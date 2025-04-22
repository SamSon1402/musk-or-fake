/**
 * Game Logic
 * 
 * Contains the core game mechanics for the "Musk or Fake" game,
 * including initialization, quote selection, and game state management.
 */

// Game state variables
let gameQuotes = [];
let correctIndex = null;
let gameWon = false;

/**
 * Initialize a new game
 * Sets up a new game with random quotes and resets the game state
 */
function initializeGame() {
    // Reset state
    gameWon = false;
    document.getElementById('characterBubble').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    
    // Choose one real quote
    const randomRealIndex = Math.floor(Math.random() * realQuotes.length);
    const selectedRealQuote = realQuotes[randomRealIndex];
    
    // Choose four fake quotes
    const selectedFakeQuotes = [];
    const usedIndexes = new Set();
    
    while (selectedFakeQuotes.length < 4) {
        const index = Math.floor(Math.random() * fakeQuotes.length);
        if (!usedIndexes.has(index)) {
            usedIndexes.add(index);
            selectedFakeQuotes.push(fakeQuotes[index]);
        }
    }
    
    // Combine and shuffle quotes
    gameQuotes = [...selectedFakeQuotes, selectedRealQuote];
    gameQuotes = shuffleArray(gameQuotes);
    
    correctIndex = gameQuotes.indexOf(selectedRealQuote);
    
    // Render quote cards
    renderQuoteCards();
}

/**
 * Render the quote cards to the DOM
 */
function renderQuoteCards() {
    const quotesContainer = document.getElementById('quotesContainer');
    quotesContainer.innerHTML = '';
    
    gameQuotes.forEach((quote, index) => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        quoteCard.onclick = () => handleQuoteClick(index);
        
        const quotationCircle = document.createElement('div');
        quotationCircle.className = 'quotation-circle';
        quotationCircle.textContent = '"';
        
        const quoteText = document.createElement('div');
        quoteText.className = 'quote-text';
        quoteText.textContent = quote;
        
        quoteCard.appendChild(quotationCircle);
        quoteCard.appendChild(quoteText);
        
        quotesContainer.appendChild(quoteCard);
    });
}

/**
 * Handle a click on a quote card
 * @param {number} index - The index of the clicked quote
 */
function handleQuoteClick(index) {
    if (gameWon) return;
    
    const quoteCards = document.querySelectorAll('.quote-card');
    
    if (index === correctIndex) {
        // Correct quote selected
        gameWon = true;
        quoteCards[index].classList.add('correct');
        
        showCharacterBubble("SMART. VERY SMART. ONLY THE BEST PEOPLE KNOW THIS!", true);
        
        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        
        // Fade out incorrect quotes
        quoteCards.forEach((card, i) => {
            if (i !== correctIndex) {
                card.classList.add('disabled');
            }
        });
        
        // Save game state
        saveGameState();
    } else {
        // Incorrect quote selected
        quoteCards[index].classList.add('incorrect');
        showCharacterBubble("WRONG! TOTALLY FAKE. YOU ARE FIRED!", false);
    }
}

/**
 * Show the character speech bubble with a message
 * @param {string} message - The message to display in the speech bubble
 * @param {boolean} isCorrect - Whether the selected quote was correct
 */
function showCharacterBubble(message, isCorrect) {
    const characterBubble = document.getElementById('characterBubble');
    const speechText = document.getElementById('speechText');
    
    // Remove existing classes and add appropriate class
    characterBubble.classList.remove('correct', 'incorrect');
    characterBubble.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    speechText.textContent = message;
    characterBubble.style.display = 'block';
    
    // Scroll to character bubble if it's not in view
    if (!isElementInViewport(characterBubble)) {
        scrollToElement(characterBubble);
    }
}

/**
 * Handle the share button click
 * Copies the current URL to clipboard
 */
function handleShare() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            alert("Link copied to clipboard!");
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            // Fallback for browsers that don't support clipboard API
            promptCopyFallback(window.location.href);
        });
}

/**
 * Fallback for clipboard copy when the Clipboard API is not available
 * @param {string} text - The text to copy
 */
function promptCopyFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("Link copied to clipboard!");
        } else {
            alert("Copy failed. Please copy the URL manually: " + text);
        }
    } catch (err) {
        alert("Copy failed. Please copy the URL manually: " + text);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Check if the user has already played today
 * Used to maintain daily game state
 */
function checkIfPlayedToday() {
    const today = new Date().toISOString().split('T')[0];
    const lastPlayed = localStorage.getItem('lastPlayed');
    
    if (lastPlayed === today) {
        // Already played today, check if won
        if (localStorage.getItem('gameWon') === 'true') {
            // Show last game result
            gameWon = true;
            gameQuotes = JSON.parse(localStorage.getItem('gameQuotes') || '[]');
            correctIndex = parseInt(localStorage.getItem('correctIndex') || '0');
            
            renderQuoteCards();
            
            // Update UI to show won state
            const quoteCards = document.querySelectorAll('.quote-card');
            quoteCards[correctIndex].classList.add('correct');
            
            quoteCards.forEach((card, i) => {
                if (i !== correctIndex) {
                    card.classList.add('disabled');
                }
            });
            
            showCharacterBubble("SMART. VERY SMART. ONLY THE BEST PEOPLE KNOW THIS!", true);
            document.getElementById('successMessage').style.display = 'block';
        } else {
            // Continue the game
            gameQuotes = JSON.parse(localStorage.getItem('gameQuotes') || '[]');
            correctIndex = parseInt(localStorage.getItem('correctIndex') || '0');
            renderQuoteCards();
        }
    } else {
        // New day, new game
        localStorage.setItem('lastPlayed', today);
        localStorage.setItem('gameWon', 'false');
        initializeGame();
    }
}

/**
 * Save the current game state to localStorage
 */
function saveGameState() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastPlayed', today);
    
    if (gameWon) {
        localStorage.setItem('gameWon', 'true');
    }
    
    localStorage.setItem('gameQuotes', JSON.stringify(gameQuotes));
    localStorage.setItem('correctIndex', correctIndex.toString());
}