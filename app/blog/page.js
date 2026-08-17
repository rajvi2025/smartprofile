import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Blog | SmartProfile",
  description: "Tips and guides on digital business cards, local SEO, and growing your business online with SmartProfile.",
  alternates: { canonical: "https://www.smartprofile.in/blog" },
  openGraph: {
    title: "Blog | SmartProfile",
    description: "Tips and guides on digital business cards, local SEO, and growing your business online with SmartProfile.",
    url: "https://www.smartprofile.in/blog",
    siteName: "SmartProfile",
    type: "website",
    images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
  },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_image, author, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div style={{ padding: '48px 24px', maxWidth: 900, margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#001144', margin: '0 0 8px' }}>SmartProfile Blog</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 36 }}>Tips and guides on growing your business online.</p>

      {(!posts || posts.length === 0) && (
        <p style={{ color: '#94a3b8' }}>No posts yet — check back soon!</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {(posts || []).map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'flex', gap: 20, textDecoration: 'none', color: 'inherit', border: '1px solid #f1f5f9', borderRadius: 14, padding: 18, background: 'white' }}>
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
            )}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{post.title}</h2>
              {post.excerpt && <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 8px' }}>{post.excerpt}</p>}
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{post.author} · {formatDate(post.published_at)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}