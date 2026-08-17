// Fires a best-effort analytics event (view / qr_scan / whatsapp_click /
// call_click) for a business profile. Uses a per-tab session id so a
// single visitor browsing around doesn't inflate view counts — the
// server-side dedup (same profile+type+session within a day) is the real
// guard, this id is just what makes that possible.
function getSessionId() {
  if (typeof window === 'undefined') return null;
  let id = sessionStorage.getItem('sp_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('sp_session_id', id);
  }
  return id;
}

export function trackEvent(profileId, eventType) {
  if (!profileId || typeof window === 'undefined') return;
  const sessionId = getSessionId();
  try {
    fetch('/api/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, event_type: eventType, session_id: sessionId }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    // Analytics should never break the page — swallow silently.
  }
}