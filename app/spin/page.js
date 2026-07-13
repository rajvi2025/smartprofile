'use client';
import { useState } from 'react';

export default function SpinPage() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form'); // form | spinning | result
  const [error, setError] = useState('');
  const [win, setWin] = useState(false);
  const [code, setCode] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [alreadySpun, setAlreadySpun] = useState(false);

  const segments = [
    { label: '🎉 You Won!', win: true },
    { label: 'Try Again', win: false },
    { label: '🎉 You Won!', win: true },
    { label: 'So Close!', win: false },
    { label: '🎉 You Won!', win: true },
    { label: 'Try Again', win: false },
  ];

  const handleSpin = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setStep('spinning');

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setStep('form');
        return;
      }

      // Pick a segment on the wheel that matches the server's win/lose
      // decision, purely for the visual spin — the server already decided
      // the real outcome, this just makes the wheel land somewhere sensible.
      const matchingIndices = segments
        .map((s, i) => (s.win === data.win ? i : -1))
        .filter(i => i !== -1);
      const idx = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
      const segAngle = 360 / segments.length;
      const targetCenter = idx * segAngle + segAngle / 2;
      const extraSpins = 5 * 360;
      const finalRotation = rotation + extraSpins + (360 - targetCenter);
      setRotation(finalRotation);

      setTimeout(() => {
        setWin(data.win);
        setCode(data.code);
        setAlreadySpun(!!data.alreadySpun);
        if (data.win && data.code) {
          try { localStorage.setItem('smartprofile_spin_coupon', data.code); } catch (e) {}
        }
        setStep('result');
      }, 5100);
    } catch (e) {
      setError('Network error. Please try again.');
      setStep('form');
    }
  };

  const copyCode = () => {
    if (code) navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Real SmartProfile homepage as a dimmed backdrop, purely visual */}
      <iframe
        src="/"
        title="SmartProfile"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full border-0 pointer-events-none select-none"
        style={{ filter: 'blur(1px)' }}
      />
      <div className="absolute inset-0 bg-blue-950/80" />

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">🎡 Spin & Win</h1>
          <p className="text-gray-500 text-sm mb-3">SmartProfile Digital Business Card</p>

          {/* Offer banner — make the deal unmistakably clear */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-300 rounded-2xl px-4 py-3 mb-5">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Limited Time — First 100 only</p>
            <p className="text-gray-800 text-sm">
              <span className="line-through text-gray-400 mr-2">₹999</span>
              <span className="font-extrabold text-green-600 text-lg">Only ₹11</span>
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Spin the wheel to unlock your discount code</p>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-5">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-500 drop-shadow" />
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full rounded-full border-[6px] border-amber-500 shadow-[0_0_0_4px_white,0_10px_30px_rgba(0,0,0,0.25)]"
              style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.17,0.67,0.12,0.99)' }}
            >
              <path d="M100,100 L100,0 A100,100 0 0,1 186.6,50 Z" fill="#ef4444" />
              <path d="M100,100 L186.6,50 A100,100 0 0,1 186.6,150 Z" fill="#f59e0b" />
              <path d="M100,100 L186.6,150 A100,100 0 0,1 100,200 Z" fill="#22c55e" />
              <path d="M100,100 L100,200 A100,100 0 0,1 13.4,150 Z" fill="#3b82f6" />
              <path d="M100,100 L13.4,150 A100,100 0 0,1 13.4,50 Z" fill="#a855f7" />
              <path d="M100,100 L13.4,50 A100,100 0 0,1 100,0 Z" fill="#ec4899" />
              <g fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                <text x="140" y="35" transform="rotate(30 140 35)">You Won!</text>
                <text x="165" y="90" transform="rotate(90 165 90)">Try Again</text>
                <text x="150" y="160" transform="rotate(150 150 160)">You Won!</text>
                <text x="70" y="175" transform="rotate(210 70 175)">So Close!</text>
                <text x="35" y="110" transform="rotate(270 35 110)">You Won!</text>
                <text x="55" y="35" transform="rotate(330 55 35)">Try Again</text>
              </g>
            </svg>
          </div>

          {step === 'form' && (
            <>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Your 10-digit phone number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button
                onClick={handleSpin}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-full shadow-lg"
              >
                🎯 Spin Now
              </button>
              <p className="text-[11px] text-gray-400 mt-3">One spin per phone number.</p>
            </>
          )}

          {step === 'spinning' && (
            <p className="text-gray-500 font-semibold animate-pulse">Spinning...</p>
          )}

          {step === 'result' && (
            <div>
              {alreadySpun && (
                <p className="text-xs text-amber-600 mb-2">You've already spun before — here's your result:</p>
              )}
              {win ? (
                <>
                  <p className="text-lg font-bold text-green-600 mb-2">🎉 Congratulations, you won!</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Get your SmartProfile card for <span className="line-through text-gray-400">₹999</span>{' '}
                    <span className="font-bold text-green-600">just ₹11</span>
                  </p>
                  <div className="inline-block bg-green-50 border-2 border-dashed border-green-400 text-green-700 px-5 py-2.5 rounded-xl font-extrabold tracking-wide mb-4">
                    {code}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <button onClick={copyCode} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl text-sm">
                      📋 Copy Code
                    </button>
                  </div>
                  <a
                    href="/register"
                    className="block w-full bg-blue-600 text-white font-bold py-3.5 rounded-full shadow-lg"
                  >
                    🚀 Continue to Create Your Profile
                  </a>
                  <p className="text-[11px] text-gray-400 mt-3">Your discount code will be applied automatically at checkout.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-700 mb-2">😅 Better luck next time!</p>
                  <p className="text-sm text-gray-500 mb-4">You can still create your SmartProfile business card today.</p>
                  <a
                    href="/register"
                    className="block w-full bg-blue-600 text-white font-bold py-3.5 rounded-full shadow-lg"
                  >
                    Create Your Profile →
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}