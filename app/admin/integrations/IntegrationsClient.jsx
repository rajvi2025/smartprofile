'use client';

const INTEGRATIONS = [
  { name: 'Razorpay', purpose: 'Payment processing for signups, upgrades, renewals, and NFC orders.', status: 'Live', color: '#166534', bg: '#dcfce7' },
  { name: 'Supabase', purpose: 'Database, authentication backend, and file storage (profile images, NFC designs, banners).', status: 'Live', color: '#166534', bg: '#dcfce7' },
  { name: 'OpenAI', purpose: 'Powers the site-wide AI chatbot that answers visitor questions and captures leads.', status: 'Live', color: '#166534', bg: '#dcfce7' },
  { name: 'Resend', purpose: 'Transactional email — lead notifications and NFC order alerts.', status: 'Live', color: '#166534', bg: '#dcfce7' },
  { name: 'NextAuth', purpose: 'Handles business owner and admin/staff login sessions.', status: 'Live', color: '#166534', bg: '#dcfce7' },
  { name: 'Ahrefs', purpose: 'SEO monitoring and site audit — external tool, not connected in-app.', status: 'External', color: '#475569', bg: '#f1f5f9' },
];

export default function IntegrationsClient() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 8px' }}>Integrations</h1>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
        Third-party services SmartProfile relies on. This is a reference view — connections are configured via environment variables in Vercel, not from here.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {INTEGRATIONS.map(i => (
          <div key={i.name} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{i.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{i.purpose}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: i.bg, color: i.color, whiteSpace: 'nowrap' }}>
              {i.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}