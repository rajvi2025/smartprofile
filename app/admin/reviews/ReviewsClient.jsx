'use client';
import { useState, useEffect, useCallback } from 'react';

function Stars({ rating }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 13 }}>
      {'★'.repeat(rating || 0)}{'☆'.repeat(5 - (rating || 0))}
    </span>
  );
}

export default function ReviewsClient() {
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) { setError('Failed to load reviews.'); setLoading(false); return; }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
      setError('Failed to load reviews.');
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchReviews, 300);
    return () => clearTimeout(t);
  }, [fetchReviews]);

  async function handleDelete(id) {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete review.');
      }
    } catch (e) {
      alert('Failed to delete review.');
    }
    setDeleting(null);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 8px' }}>Reviews</h1>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
        Testimonials businesses have added to their own profiles — remove spam or fake ones here.
      </p>

      <input
        type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search reviewer name, business, or review text..."
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, marginBottom: 16 }}
      />

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
      </div>

      {!loading && reviews.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          No reviews found.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 6px' }}>on {r.business_name}</div>
                <Stars rating={r.rating} />
                <p style={{ fontSize: 13, color: '#334155', margin: '8px 0 0' }}>{r.review}</p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deleting === r.id}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: deleting === r.id ? 'default' : 'pointer' }}
              >
                {deleting === r.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}