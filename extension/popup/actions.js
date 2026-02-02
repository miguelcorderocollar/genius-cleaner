// Popup actions for interacting with page content

/**
 * Show feedback message to user
 * @param {string} message - Message to display
 * @param {'success' | 'error'} type - Feedback type
 */
function showFeedback(message, type) {
  const feedback = document.getElementById('action-feedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.className = `action-feedback ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      feedback.className = 'action-feedback hidden';
    }, 3000);
  }
}

/**
 * Update button state temporarily
 * @param {HTMLButtonElement} button - Button element
 * @param {'success' | 'error'} state - State to apply
 * @param {string} originalText - Original button text
 */
function setButtonState(button, state, originalText) {
  button.classList.add(state);
  const span = button.querySelector('span');

  if (state === 'success') {
    if (span) span.textContent = 'Done!';
  } else if (state === 'error') {
    if (span) span.textContent = 'Failed';
  }

  setTimeout(() => {
    button.classList.remove(state);
    if (span) span.textContent = originalText;
  }, 2000);
}

/**
 * Get the active tab
 * @returns {Promise<chrome.tabs.Tab | null>}
 */
async function getActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  } catch {
    return null;
  }
}

/**
 * Copy lyrics from the current page to clipboard
 */
async function copyLyrics() {
  const button = document.getElementById('copyLyricsBtn');
  if (!button) return;

  button.disabled = true;

  try {
    const tab = await getActiveTab();
    if (!tab) {
      showFeedback('Could not access current tab', 'error');
      setButtonState(button, 'error', 'Copy Lyrics');
      return;
    }

    // Send message to content script to get lyrics
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getLyrics' });

    if (response && response.success && response.lyrics) {
      await navigator.clipboard.writeText(response.lyrics);
      showFeedback('Lyrics copied to clipboard!', 'success');
      setButtonState(button, 'success', 'Copy Lyrics');
    } else {
      const errorMsg = response?.error || 'No lyrics found on this page';
      showFeedback(errorMsg, 'error');
      setButtonState(button, 'error', 'Copy Lyrics');
    }
  } catch (error) {
    console.error('Failed to copy lyrics:', error);
    showFeedback('Failed to copy lyrics', 'error');
    setButtonState(button, 'error', 'Copy Lyrics');
  } finally {
    button.disabled = false;
  }
}

/**
 * Download artwork from the current page
 */
async function downloadArtwork() {
  const button = document.getElementById('downloadArtworkBtn');
  if (!button) return;

  button.disabled = true;

  try {
    const tab = await getActiveTab();
    if (!tab) {
      showFeedback('Could not access current tab', 'error');
      setButtonState(button, 'error', 'Download Artwork');
      return;
    }

    // Send message to content script to get artwork URL
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getArtwork' });

    if (response && response.success && response.artworkUrl) {
      // Trigger download
      await chrome.downloads.download({
        url: response.artworkUrl,
        filename: response.filename || 'artwork.jpg',
        saveAs: true,
      });
      showFeedback('Artwork download started!', 'success');
      setButtonState(button, 'success', 'Download Artwork');
    } else {
      const errorMsg = response?.error || 'No artwork found on this page';
      showFeedback(errorMsg, 'error');
      setButtonState(button, 'error', 'Download Artwork');
    }
  } catch (error) {
    console.error('Failed to download artwork:', error);
    showFeedback('Failed to download artwork', 'error');
    setButtonState(button, 'error', 'Download Artwork');
  } finally {
    button.disabled = false;
  }
}

/**
 * Initialize action buttons
 */
export function initActions() {
  const copyLyricsBtn = document.getElementById('copyLyricsBtn');
  const downloadArtworkBtn = document.getElementById('downloadArtworkBtn');

  if (copyLyricsBtn) {
    copyLyricsBtn.addEventListener('click', copyLyrics);
  }

  if (downloadArtworkBtn) {
    downloadArtworkBtn.addEventListener('click', downloadArtwork);
  }
}
