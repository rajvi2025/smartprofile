import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

async function getPost(slug) {
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | SmartProfile", robots: { index: false, follow: false } };

  const description = post.meta_description || post.excerpt || post.content.slice(0, 155);
  const canonicalUrl = `https://www.smartprofile.in/blog/${slug}`;

  return {
    title: `${post.title} | SmartProfile Blog`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile",
      type: "article",
      images: [{ url: post.cover_image || "https://www.smartprofile.in/logo-icon.png", width: post.cover_image ? 1200 : 512, height: post.cover_image ? 630 : 512 }],
    },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <article style={{ padding: '48px 24px', maxWidth: 720, margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: '#001144', margin: '0 0 10px', lineHeight: 1.25 }}>{post.title}</h1>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>{post.author} · {formatDate(post.published_at)}</div>

      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} style={{ width: '100%', borderRadius: 14, marginBottom: 28 }} />
      )}

      <div style={{ fontSize: 16, color: '#334155', lineHeight: 1.8 }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ margin: '0 0 18px' }}>{para}</p>
        ))}
      </div>
    </article>
  );
}