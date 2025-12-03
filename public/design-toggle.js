/**
 * Design Toggle - Switch between Original and Warm Educational themes
 * Works with Vite by adding alternate stylesheet as an override
 */

(function() {
    'use strict';

    const ALTERNATE_STYLESHEET_ID = 'alternate-theme-stylesheet';
    const STORAGE_KEY = 'word-practice-theme';

    // Get the base path (for GitHub Pages)
    function getBasePath() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.includes('design-toggle')) {
                const url = new URL(script.src);
                return url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
            }
        }
        // Fallback - detect from current URL
        const path = window.location.pathname;
        if (path.includes('/reading-phonics-app/')) {
            return '/reading-phonics-app/';
        }
        return '/';
    }

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

    // Check if alternate theme is active
    function isAlternateActive() {
        return !!document.getElementById(ALTERNATE_STYLESHEET_ID);
    }

    // Enable alternate theme
    function enableAlternateTheme() {
        if (document.getElementById(ALTERNATE_STYLESHEET_ID)) return;

        const link = document.createElement('link');
        link.id = ALTERNATE_STYLESHEET_ID;
        link.rel = 'stylesheet';
        link.href = getBasePath() + 'style-alternate.css';
        document.head.appendChild(link);
    }

    // Disable alternate theme
    function disableAlternateTheme() {
        const link = document.getElementById(ALTERNATE_STYLESHEET_ID);
        if (link) {
            link.remove();
        }
    }

    // Update the toggle button appearance
    function updateButtonAppearance(isAlternate) {
        const button = document.getElementById('design-toggle-btn');
        if (!button) return;

        const label = button.querySelector('.toggle-label');

        if (isAlternate) {
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
        const isAlternate = isAlternateActive();

        // Fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            if (isAlternate) {
                disableAlternateTheme();
                localStorage.setItem(STORAGE_KEY, 'original');
                updateButtonAppearance(false);
            } else {
                enableAlternateTheme();
                localStorage.setItem(STORAGE_KEY, 'alternate');
                updateButtonAppearance(true);
            }

            // Fade back in
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }, 200);
    }

    // Initialize
    function init() {
        createToggleButton();

        // Check for saved preference
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'alternate') {
            enableAlternateTheme();
            updateButtonAppearance(true);
        } else {
            updateButtonAppearance(false);
        }

        console.log('Design toggle initialized. Click the button in the top-left to switch themes.');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
