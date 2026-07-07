'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const DISPLAY_PLANS = ['business', 'premium', 'pro', 'ultimate'];

export default function TestimonialsViewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.email) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [session, status]);

  async function fetchData() {
    setLoading(true);
    const userResult = await supabase.from('users').select('id').eq('email', session.user.email).single();
    const userRow = userResult.data;
    if (!userRow) { setLoading(false); return; }

    const profileResult = await supabase.from('profiles').select('*').eq('user_id', userRow.id).single();
    const profileRow = profileResult.data;
    if (!profileRow) { setLoading(false); return; }
    setProfile(profileRow);

    const tResult = await supabase.from('testimonials').select('*').eq('profile_id', profileRow.id).order('sort_order', { ascending: true });
    setTestimonials(tResult.data || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading...</div>;
  }

  if (!profile) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Profile not found. Please complete your profile first.</div>;
  }

  const willDisplay = DISPLAY_PLANS.indexOf(profile.plan) !== -1;
  const reviewUrl = "https://smartprofile.in/" + profile.username + "/review";
  const waMessage = "Hi! I would love it if you could share a quick review of your experience with us: " + reviewUrl;
  const waLink = "https://wa.me/?text=" + encodeURIComponent(waMessage);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <button onClick={() => router.push('/dashboard')} style={{ marginBottom: 16, background: 'none', border: 'none', color: '#3b82f6', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Back to Dashboard
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>My Reviews</h1>
        <p style={{ color: '#64748b', marginBottom: 8 }}>{testimonials.length} reviews collected</p>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1e40af' }}>
          Reviews are submitted directly by your customers and cannot be added, edited or deleted from here.
        </div>

        {willDisplay ? null : (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
            Your current plan collects reviews but does not display them publicly. Upgrade to Business, Premium or Pro to showcase reviews.
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, margin: 0 }}>Ask a customer for a review</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Send them your review link on WhatsApp</p>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 18px', background: '#22c55e', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Send Review Request
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {testimonials.map(function(t) {
            return (
              <div key={t.id} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{t.name}</div>
                <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 2 }}>{'*'.repeat(t.rating)}{'.'.repeat(5 - t.rating)}</div>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{t.review}</p>
              </div>
            );
          })}
          {testimonials.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No reviews yet. Share your profile link with customers so they can leave a review.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}