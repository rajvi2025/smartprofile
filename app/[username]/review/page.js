'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { supabase } from '@/lib/supabase';

export default function PublicReviewPage({ params }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    setLoading(true);
    const result = await supabase.from('profiles').select('id, business_name, full_name, logo_url, username').eq('username', username).single();
    setProfile(result.data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!review.trim()) {
      setError('Please write a short review.');
      return;
    }

    setSubmitting(true);

    const maxResult = await supabase.from('testimonials').select('sort_order').eq('profile_id', profile.id).order('sort_order', { ascending: false }).limit(1);
    const maxRow = maxResult.data && maxResult.data[0];
    const nextOrder = maxRow ? maxRow.sort_order + 1 : 0;

    const insertResult = await supabase.from('testimonials').insert({
      profile_id: profile.id,
      name: name.trim(),
      review: review.trim(),
      rating: rating,
      sort_order: nextOrder
    });

    setSubmitting(false);

    if (insertResult.error) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading...</div>;
  }

  if (!profile) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Business not found.</div>;
  }

  const displayName = profile.business_name || profile.full_name || profile.username;

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Thank you!</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Your review for {displayName} has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={displayName} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Review {displayName}</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Share your experience</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Rating</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(function(star) {
                const filled = star <= (hoverRating || rating);
                return (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ fontSize: 32, cursor: 'pointer', color: filled ? '#f59e0b' : '#e2e8f0', lineHeight: 1 }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={5}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 8, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />

            {error ? (
              <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '12px', background: submitting ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer', marginTop: 8 }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}