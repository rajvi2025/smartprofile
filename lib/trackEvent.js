// Fires a best-effort analytics event (view / qr_scan / whatsapp_click /
// call_click / etc.) for a business profile.
//
// Uses a PERSISTENT (localStorage, not sessionStorage) visitor id so the
// server can tell new visitors from returning ones — this only recognizes
// the same browser on the same device (no cross-device identity, same
// limitation every cookie-less analytics tool has), which is good enough
// for "have I seen this visitor before" without needing real accounts.
function getVisitorId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('sp_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('sp_visitor_id', id);
  }
  return id;
}

function getDeviceType() {
  if (typeof navigator === 'undefined') return 'unknown';
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

// Buckets document.referrer into a handful of meaningful sources instead of
// raw URLs — enough to tell "where did this visit come from" without
// needing a real analytics service.
function getSource() {
  if (typeof document === 'undefined' || !document.referrer) return 'direct';
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    if (host.includes('google.')) return 'google';
    if (host.includes('wa.me') || host.includes('whatsapp.')) return 'whatsapp';
    if (host.includes('instagram.')) return 'instagram';
    if (host.includes('facebook.') || host.includes('fb.')) return 'facebook';
    if (host === window.location.hostname) return 'internal';
    return 'other';
  } catch (e) {
    return 'other';
  }
}

export function trackEvent(profileId, eventType) {
  if (!profileId || typeof window === 'undefined') return;
  try {
    fetch('/api/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_id: profileId,
        event_type: eventType,
        session_id: getVisitorId(),
        device_type: getDeviceType(),
        source: getSource(),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    // Analytics should never break the page — swallow silently.
  }
}