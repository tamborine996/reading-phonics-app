/**
 * Authentication UI components
 */

import { authService } from '@/services/auth.service';
import { logger } from '@/utils/logger';

/**
 * Initialize auth UI
 */
export function initAuthUI(): void {
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const skipAuthBtn = document.getElementById('skipAuthBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const signInBtn = document.getElementById('signInBtn');

  if (googleSignInBtn) {
    googleSignInBtn.onclick = handleGoogleSignIn;
  }

  if (skipAuthBtn) {
    skipAuthBtn.onclick = skipAuth;
  }

  if (signOutBtn) {
    signOutBtn.onclick = handleSignOut;
  }

  if (signInBtn) {
    signInBtn.onclick = handleGoogleSignIn;
  }
}

/**
 * Check if user should see auth screen
 */
export function shouldShowAuthScreen(): boolean {
  // Check if user has explicitly skipped auth
  const hasSkipped = localStorage.getItem('auth_skipped');
  if (hasSkipped === 'true') {
    return false;
  }

  // If not authenticated, show auth screen
  return !authService.isAuthenticated();
}

/**
 * Show auth screen or home screen
 */
export function showInitialScreen(): void {
  const authScreen = document.getElementById('authScreen');
  const homeScreen = document.getElementById('homeScreen');

  if (shouldShowAuthScreen()) {
    authScreen?.classList.remove('hidden');
    homeScreen?.classList.add('hidden');
  } else {
    authScreen?.classList.add('hidden');
    homeScreen?.classList.remove('hidden');
    updateUserBar();
  }
}

/**
 * Handle Google sign in
 */
async function handleGoogleSignIn(): Promise<void> {
  try {
    logger.info('Starting Google sign in...');

    const { supabaseService } = await import('@/services/supabase.service');

    if (!supabaseService.isInitialized()) {
      alert('Authentication is not configured. Please check your setup.');
      return;
    }

    // Start Google OAuth flow
    await supabaseService.signInWithGoogle();

    // OAuth redirect will handle the rest
    logger.info('Redirecting to Google...');
  } catch (error) {
    logger.error('Google sign in failed', error);
    alert('Failed to sign in with Google. Please try again.');
  }
}

/**
 * Skip authentication
 */
function skipAuth(): void {
  localStorage.setItem('auth_skipped', 'true');
  logger.info('User skipped authentication');

  const authScreen = document.getElementById('authScreen');
  const homeScreen = document.getElementById('homeScreen');

  authScreen?.classList.add('hidden');
  homeScreen?.classList.remove('hidden');

  // Update user bar to show sign-in option
  updateUserBar();

  // Trigger home screen rendering
  const event = new Event('auth-skipped');
  window.dispatchEvent(event);
}

/**
 * Handle sign out
 */
async function handleSignOut(): Promise<void> {
  try {
    await authService.signOut();
    localStorage.removeItem('auth_skipped');

    logger.info('User signed out');

    // Show auth screen again
    const authScreen = document.getElementById('authScreen');
    const homeScreen = document.getElementById('homeScreen');

    authScreen?.classList.remove('hidden');
    homeScreen?.classList.add('hidden');
  } catch (error) {
    logger.error('Sign out failed', error);
    alert('Failed to sign out. Please try again.');
  }
}

/**
 * Update user bar with current user info
 */
export function updateUserBar(): void {
  const userBar = document.getElementById('userBar');
  const userEmail = document.getElementById('userEmail');
  const signInBar = document.getElementById('signInBar');

  const currentUser = authService.getCurrentUser();

  if (currentUser && userBar && userEmail) {
    // User is authenticated - show user bar, hide sign-in bar
    userEmail.textContent = currentUser.email;
    userBar.style.display = 'flex';
    if (signInBar) {
      signInBar.style.display = 'none';
    }
  } else {
    // User is not authenticated - hide user bar, show sign-in bar
    if (userBar) {
      userBar.style.display = 'none';
    }
    if (signInBar) {
      signInBar.style.display = 'flex';
    }
  }
}

/**
 * Handle OAuth callback after redirect
 * Returns true if callback was processed
 */
export async function handleOAuthCallback(): Promise<boolean> {
  // Check if we're returning from OAuth
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');

  if (accessToken) {
    logger.info('OAuth callback detected');

    // Clear auth_skipped since user signed in
    localStorage.removeItem('auth_skipped');

    // Supabase has already processed the OAuth tokens automatically during initialization
    // No need to wait or do anything else here
    return true;
  }

  return false;
}
