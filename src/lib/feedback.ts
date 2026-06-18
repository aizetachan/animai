import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type FeedbackType = 'animation' | 'bug' | 'other';

export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  email?: string;
}

// EmailJS — credenciales (públicas, pensadas para uso en cliente).
// Rellena estos valores en un archivo .env (ver .env.example):
//   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
};

const TYPE_LABELS: Record<FeedbackType, string> = {
  animation: 'Propuesta de animación',
  bug: 'Reporte de bug',
  other: 'Otro',
};

/**
 * Reenvía la solicitud por email vía la API REST de EmailJS.
 * Es "best-effort": si no está configurado o falla, no rompe el flujo
 * (la fuente de verdad es Firestore).
 */
async function sendEmail(payload: FeedbackPayload): Promise<void> {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) {
    console.info('[Animai] EmailJS no configurado; se omite el reenvío por correo.');
    return;
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.serviceId,
      template_id: EMAILJS.templateId,
      user_id: EMAILJS.publicKey,
      template_params: {
        type: TYPE_LABELS[payload.type],
        message: payload.message,
        email: payload.email || 'No proporcionado',
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`EmailJS respondió ${res.status}`);
  }
}

/**
 * Guarda la solicitud en Firestore y la reenvía por email.
 * Firestore es la fuente de verdad; el email es best-effort.
 */
export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  await addDoc(collection(db, 'feedback'), {
    type: payload.type,
    message: payload.message,
    email: payload.email || null,
    lang: document.documentElement.lang || 'es',
    userAgent: navigator.userAgent,
    path: window.location.pathname,
    createdAt: serverTimestamp(),
  });

  // No bloqueamos el éxito en el email: si falla, lo registramos pero
  // la solicitud ya quedó guardada.
  try {
    await sendEmail(payload);
  } catch (err) {
    console.warn('[Animai] No se pudo reenviar el feedback por email:', err);
  }
}
