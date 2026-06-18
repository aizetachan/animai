import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8cy26w_59PKtTc-Yw8Ny8jO0jXR6r8Rw",
  authDomain: "animai-gallery-nakama.firebaseapp.com",
  projectId: "animai-gallery-nakama",
  storageBucket: "animai-gallery-nakama.firebasestorage.app",
  messagingSenderId: "767497526083",
  appId: "1:767497526083:web:7106362309a61424052df6",
  // Note: Si activas Google Analytics en la consola de Firebase,
  // puedes añadir aquí tu measurementId (ej. "G-XXXXXXXXXX")
  // para vincularlo directamente si el SDK no lo autodetecta.
  measurementId: "G-86FGQV215W" 
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Firestore: almacena las solicitudes/feedback de los usuarios.
const db = getFirestore(app);

let analytics: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      console.log('[Animai] Google Analytics inicializado correctamente.');
      return analytics;
    }
  } catch (err) {
    console.warn('[Animai] Falló la inicialización de Google Analytics:', err);
  }
  return null;
}

export { app, db, analytics };
export type { Analytics };
