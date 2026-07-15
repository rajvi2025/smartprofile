'use client';
import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  new: { bg: '#dbeafe', text: '#1d4ed8' },
  contacted: { bg: '#fef3c7', text: '#92400e' },
  converted: { bg: '#dcfce7', text: '#166534' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch('/api/admin/leads-list');
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    }
    setLoading(false);
  }

  async function updateStatus(lead, status) {
    setActionLoading(lead.id);
    const res = await fetch('/api/admin/leads-update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id, status }),
    });
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
    }
    setActionLoading(null);
  }

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const selectStyle = {
    padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1',
    fontSize: 13, color: '#0f172a', outline: 'none', cursor: 'pointer', background: 'white',
  };

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Leads (CRM)
            </h1>
            <p style={{ color: '#64748b', margin: '8px 0 0' }}>
              Visitors captured by the SmartProfile chatbot and other lead sources.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, color: '#64748b' }}>Filter:</label>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}>
              <option value="all">All ({leads.length})</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading leads…</div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', background: 'white', borderRadius: 12, marginTop: 20 }}>
            No leads yet. They'll show up here as soon as someone chats with the website assistant and leaves their contact info.
          </div>
        ) : (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredLeads.map(lead => {
              const colors = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
              return (
                <div key={lead.id} style={{ background: 'white', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{lead.name || 'Unnamed visitor'}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: colors.text, background: colors.bg, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>{lead.status || 'new'}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 14, color: '#334155', fontWeight: 600 }}>{lead.contact}</p>
                    {lead.message && <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>{lead.message}</p>}
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Source: {lead.source} · {formatDate(lead.created_at)}</p>
                  </div>
                  <div>
                    <select
                      value={lead.status || 'new'}
                      disabled={actionLoading === lead.id}
                      onChange={e => updateStatus(lead, e.target.value)}
                      style={selectStyle}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}