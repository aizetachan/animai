import { logEvent } from 'firebase/analytics';
import { initAnalytics } from './firebase';

// Helper to check if cookies are accepted
export function hasConsent(): boolean {
  return localStorage.getItem('animai_cookie_consent') === 'accepted';
}

// Wrapper function to execute analytics call safely if consent exists
async function runSafe(cb: (analytics: any) => void) {
  if (!hasConsent()) return;
  const analytics = await initAnalytics();
  if (analytics) {
    cb(analytics);
  }
}

/**
 * Registra una visita a una ruta específica.
 */
export function logPageView(pagePath: string) {
  runSafe((analytics) => {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: document.title,
    });
  });
}

/**
 * Registra que un efecto se ha visualizado en el viewport (renderizado de preview).
 */
export function logEffectView(effectId: string, effectTitle: string) {
  runSafe((analytics) => {
    logEvent(analytics, 'view_effect', {
      effect_id: effectId,
      effect_title: effectTitle,
    });
  });
}

/**
 * Registra una interacción del usuario con un efecto (play, copiar prompt, ver código, copiar código).
 */
export function logEffectInteraction(
  effectId: string,
  effectTitle: string,
  actionType: 'play_manual' | 'copy_prompt' | 'copy_code' | 'toggle_code'
) {
  runSafe((analytics) => {
    logEvent(analytics, 'interact_effect', {
      effect_id: effectId,
      effect_title: effectTitle,
      action_type: actionType,
    });
  });
}
