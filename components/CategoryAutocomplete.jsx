'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// Type-ahead category picker: as the user types, matching categories from
// the shared taxonomy (see lib/slugify.js + the `categories` table) show up
// in a dropdown list below the input, grouped by category group. Clicking
// a suggestion fills the field. Free text is still allowed if nothing
// matches — this never blocks submission, it's a helper, not a strict
// enum — so a business type not yet in the taxonomy doesn't get stuck.
export default function CategoryAutocomplete({ value, onChange, placeholder, inputClassName, inputStyle }) {
  const [allCategories, setAllCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('category_name, group_name, sort_order')
        .order('sort_order', { ascending: true });
      setAllCategories(data || []);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = (value || '').trim().toLowerCase();
  const matches = query
    ? allCategories.filter(
        (c) =>
          c.category_name.toLowerCase().includes(query) ||
          c.group_name.toLowerCase().includes(query)
      ).slice(0, 8)
    : [];

  // Group the visible matches under their group_name so results read like
  // "Home Services: Electrician, Plumber" rather than a flat list.
  const groupedMatches = matches.reduce((acc, c) => {
    (acc[c.group_name] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || 'Start typing e.g. Electrician'}
        className={inputClassName}
        style={inputStyle}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            maxHeight: 260,
            overflowY: 'auto',
            zIndex: 30,
          }}
        >
          {Object.entries(groupedMatches).map(([group, items]) => (
            <div key={group}>
              <div style={{ padding: '6px 12px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc' }}>
                {group}
              </div>
              {items.map((c) => (
                <div
                  key={c.category_name}
                  onClick={() => {
                    onChange(c.category_name);
                    setOpen(false);
                  }}
                  style={{ padding: '9px 12px', fontSize: 13, color: '#1e293b', cursor: 'pointer' }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  {c.category_name}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}