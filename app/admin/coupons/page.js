'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const PLAN_OPTIONS = ['basic', 'business', 'premium', 'pro'];

function emptyForm() {
  return {
    code: '',
    type: 'percentage',
    value: '',
    max_discount_cap: '',
    applicable_product: 'all', // 'all' | 'digital_card' | 'nfc_card'
    applicable_plans: [], // only used when applicable_product = 'digital_card'; empty = all plans
    min_order_value: '',
    usage_type: 'limited',
    max_uses: '',
    per_user_limit: 1,
    valid_from: '',
    valid_until: '',
  };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCoupons(data || []);
    setLoading(false);
  }

  function togglePlan(plan) {
    setForm(prev => {
      const has = prev.applicable_plans.includes(plan);
      return {
        ...prev,
        applicable_plans: has
          ? prev.applicable_plans.filter(p => p !== plan)
          : [...prev.applicable_plans, plan],
      };
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');

    if (!form.code.trim()) return setFormError('Coupon code is required.');
    if (!form.value || Number(form.value) <= 0) return setFormError('Enter a valid discount value.');
    if (form.usage_type === 'limited' && (!form.max_uses || Number(form.max_uses) <= 0)) {
      return setFormError('Enter max uses for a limited coupon.');
    }

    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      max_discount_cap: form.max_discount_cap ? Number(form.max_discount_cap) : null,
      applicable_product: form.applicable_product,
      applicable_plans: form.applicable_product === 'digital_card' && form.applicable_plans.length > 0 ? form.applicable_plans : null,
      min_order_value: form.min_order_value ? Number(form.min_order_value) : 0,
      usage_type: form.usage_type,
      max_uses: form.usage_type === 'limited' ? Number(form.max_uses) : null,
      per_user_limit: Number(form.per_user_limit) || 1,
      // Dates picked in the form are IST calendar dates. Appending the IST offset
      // (+05:30) instead of letting JS default to UTC midnight avoids a ~5.5 hour
      // window right after midnight IST where a "today" coupon would incorrectly
      // show as not-yet-started.
      valid_from: form.valid_from ? new Date(`${form.valid_from}T00:00:00+05:30`).toISOString() : new Date().toISOString(),
      // Valid Until is inclusive of the whole selected day (23:59:59 IST), not its start.
      valid_until: form.valid_until ? new Date(`${form.valid_until}T23:59:59+05:30`).toISOString() : null,
      is_active: true,
    };

    const { error } = await supabase.from('coupons').insert([payload]);
    setSaving(false);

    if (error) {
      setFormError(error.code === '23505' ? 'This coupon code already exists.' : error.message);
      return;
    }

    setForm(emptyForm());
    setShowForm(false);
    fetchCoupons();
  }

  async function toggleActive(coupon) {
    setActionLoading(coupon.id);
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !coupon.is_active })
      .eq('id', coupon.id);
    if (!error) {
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
    }
    setActionLoading(null);
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1',
    fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6, display: 'block' };

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Coupons
            </h1>
            <p style={{ color: '#64748b', margin: '8px 0 0' }}>
              Create and manage discount coupon codes for checkout.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(s => !s); setFormError(''); }}
            style={{ padding: '10px 16px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : '+ New Coupon'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 12, padding: 24, marginTop: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: 18 }}>Create New Coupon</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="WELCOME50"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Discount Type *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="final_price">Final Price (₹) — same price on every plan</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  {form.type === 'percentage' ? 'Discount %' : form.type === 'final_price' ? 'Final Price customer pays (₹)' : 'Discount ₹'} *
                </label>
                <input
                  type="number"
                  placeholder={form.type === 'percentage' ? '10' : form.type === 'final_price' ? '11' : '100'}
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {form.type === 'percentage' && (
                <div>
                  <label style={labelStyle}>Max Discount Cap (₹, optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={form.max_discount_cap}
                    onChange={e => setForm({ ...form, max_discount_cap: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Minimum Order Value (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.min_order_value}
                  onChange={e => setForm({ ...form, min_order_value: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Usage Type *</label>
                <select value={form.usage_type} onChange={e => setForm({ ...form, usage_type: e.target.value })} style={inputStyle}>
                  <option value="single_use">Single Use (one time only, total)</option>
                  <option value="limited">Limited (fixed number of uses)</option>
                  <option value="unlimited">Unlimited (permanent, until deactivated)</option>
                </select>
              </div>

              {form.usage_type === 'limited' && (
                <div>
                  <label style={labelStyle}>Max Total Uses *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={form.max_uses}
                    onChange={e => setForm({ ...form, max_uses: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Per-User Limit</label>
                <input
                  type="number"
                  min="1"
                  value={form.per_user_limit}
                  onChange={e => setForm({ ...form, per_user_limit: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Valid From</label>
                <input
                  type="date"
                  value={form.valid_from}
                  onChange={e => setForm({ ...form, valid_from: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Valid Until (optional)</label>
                <input
                  type="date"
                  value={form.valid_until}
                  onChange={e => setForm({ ...form, valid_until: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={labelStyle}>Applies To *</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { value: 'all', label: '🌐 Entire Site (any checkout)' },
                  { value: 'digital_card', label: '💳 Digital Card Plans' },
                  { value: 'nfc_card', label: '📇 NFC Cards' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8,
                    border: form.applicable_product === opt.value ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                    background: form.applicable_product === opt.value ? '#eff6ff' : 'white',
                    fontSize: 13, fontWeight: 500, color: '#334155', cursor: 'pointer',
                  }}>
                    <input
                      type="radio"
                      name="applicable_product"
                      checked={form.applicable_product === opt.value}
                      onChange={() => setForm({ ...form, applicable_product: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {form.applicable_product === 'digital_card' && (
            <div style={{ marginTop: 18 }}>
              <label style={labelStyle}>Applicable Plans (leave unchecked = applies to all Digital Card plans)</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {PLAN_OPTIONS.map(plan => (
                  <label key={plan} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8,
                    border: form.applicable_plans.includes(plan) ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                    background: form.applicable_plans.includes(plan) ? '#eff6ff' : 'white',
                    fontSize: 13, fontWeight: 500, color: '#334155', cursor: 'pointer', textTransform: 'capitalize',
                  }}>
                    <input
                      type="checkbox"
                      checked={form.applicable_plans.includes(plan)}
                      onChange={() => togglePlan(plan)}
                    />
                    {plan}
                  </label>
                ))}
              </div>
            </div>
            )}

            {formError && (
              <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600, marginTop: 14 }}>{formError}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{ marginTop: 20, padding: '10px 24px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 28 }}>
          {loading ? (
            <p style={{ color: '#64748b' }}>Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              No coupons created yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {coupons.map(c => {
                const isExpired = c.valid_until && new Date(c.valid_until) < new Date();
                const isExhausted = c.usage_type !== 'unlimited' && c.max_uses && c.used_count >= c.max_uses;
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: 0.5 }}>{c.code}</span>
                          <span style={{
                            padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                            background: c.is_active && !isExpired && !isExhausted ? '#dcfce7' : '#fee2e2',
                            color: c.is_active && !isExpired && !isExhausted ? '#16a34a' : '#dc2626',
                          }}>
                            {!c.is_active ? 'Deactivated' : isExpired ? 'Expired' : isExhausted ? 'Exhausted' : 'Active'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 6, fontSize: 13, color: '#475569' }}>
                          <p style={{ margin: 0 }}>
                            <strong>Discount:</strong> {c.type === 'percentage' ? `${c.value}%` : c.type === 'final_price' ? `Final price ₹${c.value}` : `₹${c.value}`}
                            {c.max_discount_cap ? ` (max ₹${c.max_discount_cap})` : ''}
                          </p>
                          <p style={{ margin: 0 }}><strong>Min Order:</strong> {c.min_order_value ? `₹${c.min_order_value}` : 'None'}</p>
                          <p style={{ margin: 0 }}>
                            <strong>Usage:</strong>{' '}
                            {c.usage_type === 'unlimited' ? 'Unlimited' : `${c.used_count || 0} / ${c.max_uses}`}
                          </p>
                          <p style={{ margin: 0 }}><strong>Per User:</strong> {c.per_user_limit}</p>
                          <p style={{ margin: 0 }}>
                            <strong>Applies To:</strong>{' '}
                            {c.applicable_product === 'all' ? 'Entire Site' : c.applicable_product === 'digital_card' ? 'Digital Card' : 'NFC Cards'}
                          </p>
                          {c.applicable_product === 'digital_card' && (
                            <p style={{ margin: 0 }}>
                              <strong>Plans:</strong> {c.applicable_plans ? c.applicable_plans.join(', ') : 'All'}
                            </p>
                          )}
                          <p style={{ margin: 0 }}>
                            <strong>Valid Until:</strong> {c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : 'No expiry'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleActive(c)}
                        disabled={actionLoading === c.id}
                        style={{
                          padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          background: c.is_active ? '#fee2e2' : '#dcfce7',
                          color: c.is_active ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {actionLoading === c.id ? '...' : c.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}