'use client';
import { useState, useEffect, useCallback } from 'react';

function emptyForm() {
  return { id: null, title: '', slug: '', excerpt: '', content: '', cover_image: '', meta_description: '', author: 'SmartProfile Team', status: 'draft' };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function slugPreview(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function CmsClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'edit'
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/blog-posts');
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function startCreate() {
    setForm(emptyForm());
    setError('');
    setView('edit');
  }

  function startEdit(post) {
    setForm({
      id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt || '',
      content: post.content, cover_image: post.cover_image || '', meta_description: post.meta_description || '',
      author: post.author, status: post.status,
    });
    setError('');
    setView('edit');
  }

  async function handleSave(publishNow) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog-posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publishNow ? 'published' : form.status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save post.');
        setSaving(false);
        return;
      }
      await fetchPosts();
      setView('list');
    } catch (e) {
      setError('Failed to save post.');
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/blog-posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
      else alert('Failed to delete post.');
    } catch (e) {
      alert('Failed to delete post.');
    }
    setDeleting(null);
  }

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, marginBottom: 14 };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block' };

  if (view === 'edit') {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>{form.id ? 'Edit Post' : 'New Post'}</h1>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>← Back to list</button>
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <label style={labelStyle}>Title</label>
        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />

        <label style={labelStyle}>Slug (URL) {form.title && !form.slug && <span style={{ color: '#94a3b8', fontWeight: 400 }}>— will use: /blog/{slugPreview(form.title)}</span>}</label>
        <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder={slugPreview(form.title)} style={inputStyle} />

        <label style={labelStyle}>Excerpt (shown on blog listing card)</label>
        <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} style={inputStyle} />

        <label style={labelStyle}>Cover Image URL</label>
        <input type="text" value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." style={inputStyle} />

        <label style={labelStyle}>Content</label>
        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={14} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }} />
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: -10, marginBottom: 14 }}>Separate paragraphs with a blank line — no special formatting needed.</p>

        <label style={labelStyle}>Meta Description (for SEO / Google)</label>
        <textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} rows={2} style={inputStyle} />

        <label style={labelStyle}>Author</label>
        <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={inputStyle} />

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Save as Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#005DFF', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>CMS — Blog Posts</h1>
        <button onClick={startCreate} style={{ padding: '10px 18px', background: '#005DFF', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          + New Post
        </button>
      </div>

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
      </div>

      {!loading && posts.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          No blog posts yet. Click "New Post" to write your first one.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                <span style={{ fontWeight: 700, color: p.status === 'published' ? '#166534' : '#b45309' }}>{p.status === 'published' ? 'Published' : 'Draft'}</span>
                {' · '}{formatDate(p.status === 'published' ? p.published_at : p.created_at)}
                {' · by '}{p.author}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {p.status === 'published' && (
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  View
                </a>
              )}
              <button onClick={() => startEdit(p)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {deleting === p.id ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}