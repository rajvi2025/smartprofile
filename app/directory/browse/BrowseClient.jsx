'use client';
import { useState } from 'react';
import Link from 'next/link';
import { slugifyCity, slugifyCategory, slugifyState } from '@/lib/slugify';

export default function BrowseClient({ profiles }) {
  const [search, setSearch] = useState('');

  const uniqueCities = [...new Set(profiles.map(p => p.city).filter(Boolean))].sort();
  const uniqueCategories = [...new Set(profiles.map(p => p.category).filter(Boolean))].sort();
  const uniqueStates = [...new Set(profiles.map(p => p.state).filter(Boolean))].sort();
  const cityCategoryPairs = [...new Set(
    profiles.filter(p => p.city && p.category).map(p => `${p.city}|||${p.category}`)
  )].map(pair => {
    const [city, category] = pair.split('|||');
    return { city, category };
  }).sort((a, b) => (a.city + a.category).localeCompare(b.city + b.category));

  const q = search.trim().toLowerCase();
  const filteredCities = q ? uniqueCities.filter(c => c.toLowerCase().includes(q)) : uniqueCities;
  const filteredCategories = q ? uniqueCategories.filter(c => c.toLowerCase().includes(q)) : uniqueCategories;
  const filteredPairs = q
    ? cityCategoryPairs.filter(p => `${p.category} in ${p.city}`.toLowerCase().includes(q))
    : cityCategoryPairs;
  const filteredStates = q ? uniqueStates.filter(s => s.toLowerCase().includes(q)) : uniqueStates;

  const pillStyle = {
    fontSize: 13, color: '#334155', background: 'white', border: '1px solid #e2e8f0',
    padding: '6px 14px', borderRadius: 999, textDecoration: 'none', display: 'inline-block',
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh', padding: '32px 24px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: 13, marginBottom: 16 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px', color: '#cbd5e1' }}>/</span>
          <Link href="/directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
          <span style={{ margin: '0 6px', color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#0f172a' }}>Browse All</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Browse All Cities &amp; Categories</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
          Every city, category, and location covered by SmartProfile Directory.
        </p>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cities or categories..."
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 28, outline: 'none' }}
        />

        {filteredCities.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>Cities</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredCities.map(city => (
                <Link key={city} href={`/directory/${slugifyCity(city)}`} style={pillStyle}>{city}</Link>
              ))}
            </div>
          </section>
        )}

        {filteredCategories.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>Categories</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredCategories.map(cat => (
                <Link key={cat} href={`/directory/category/${slugifyCategory(cat)}`} style={pillStyle}>{cat}</Link>
              ))}
            </div>
          </section>
        )}

        {filteredPairs.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>City &amp; Category</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredPairs.map(({ city, category }) => (
                <Link key={`${city}-${category}`} href={`/directory/${slugifyCity(city)}/category/${slugifyCategory(category)}`} style={pillStyle}>
                  {category} in {city}
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredStates.length > 0 && (
          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>States</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredStates.map(state => (
                <Link key={state} href={`/directory/state/${slugifyState(state)}`} style={pillStyle}>{state}</Link>
              ))}
            </div>
          </section>
        )}

        {q && filteredCities.length === 0 && filteredCategories.length === 0 && filteredPairs.length === 0 && filteredStates.length === 0 && (
          <p style={{ color: '#94a3b8', fontSize: 14 }}>No matches for "{search}".</p>
        )}
      </div>
    </div>
  );
}