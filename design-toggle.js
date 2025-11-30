/**
 * Design Toggle - Switch between Original and Warm Educational themes
 *
 * Usage: Include this script in your HTML after the main app script
 * A floating toggle button will appear in the top-left corner
 */

(function() {
    'use strict';

    const ORIGINAL_STYLESHEET = 'style.css';
    const ALTERNATE_STYLESHEET = 'style-alternate.css';
    const STORAGE_KEY = 'word-practice-theme';

    // Create the toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'design-toggle-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="10" cy="10" r="4"/>
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"/>
            </svg>
            <span class="toggle-label">Original</span>
        `;

        // Styles for the toggle button
        button.style.cssText = `
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: white;
            border: 2px solid #E5E5EA;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.16)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        });

        button.addEventListener('click', toggleDesign);

        document.body.appendChild(button);
        return button;
    }

    // Get the current stylesheet link element
    function getStylesheetLink() {
        return document.querySelector('link[href*="style"]');
    }

    // Check which theme is currently active
    function getCurrentTheme() {
        const link = getStylesheetLink();
        if (!link) return 'original';
        return link.href.includes('style-alternate') ? 'alternate' : 'original';
    }

    // Update the toggle button appearance
    function updateButtonAppearance(theme) {
        const button = document.getElementById('design-toggle-btn');
        if (!button) return;

        const label = button.querySelector('.toggle-label');

        if (theme === 'alternate') {
            button.style.background = 'linear-gradient(135deg, #FF8F6B 0%, #E5724D 100%)';
            button.style.color = 'white';
            button.style.borderColor = 'transparent';
            label.textContent = 'Warm Theme';
        } else {
            button.style.background = 'white';
            button.style.color = '#333';
            button.style.borderColor = '#E5E5EA';
            label.textContent = 'Original';
        }
    }

    // Toggle between designs
    function toggleDesign() {
        const link = getStylesheetLink();
        if (!link) {
            console.error('No stylesheet link found');
            return;
        }

        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'original' ? 'alternate' : 'original';
        const newStylesheet = newTheme === 'alternate' ? ALTERNATE_STYLESHEET : ORIGINAL_STYLESHEET;

        // Fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            // Switch stylesheet
            link.href = newStylesheet;

            // Save preference
            localStorage.setItem(STORAGE_KEY, newTheme);

            // Update button
            updateButtonAppearance(newTheme);

            // Fade back in
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }, 200);
    }

    // Initialize on DOM ready
    function init() {
        // Create toggle button
        createToggleButton();

        // Check for saved preference
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'alternate') {
            const link = getStylesheetLink();
            if (link) {
                link.href = ALTERNATE_STYLESHEET;
            }
        }

        // Update button to match current state
        updateButtonAppearance(getCurrentTheme());

        console.log('Design toggle initialized. Click the button in the top-left to switch themes.');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
