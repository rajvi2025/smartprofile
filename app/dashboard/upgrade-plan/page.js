'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const PLANS = [
  { id: 'basic', name: 'Basic', price: 199, color: 'bg-green-500' },
  { id: 'business', name: 'Business', price: 399, color: 'bg-blue-600' },
  { id: 'premium', name: 'Premium', price: 599, color: 'bg-orange-500' },
  { id: 'pro', name: 'Pro', price: 999, color: 'bg-purple-600' },
];
const PLAN_ORDER = ['basic', 'business', 'premium', 'pro'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function UpgradePlanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loadingData, setLoadingData] = useState(true);
  const [current, setCurrent] = useState(null); // { plan, amount_paid, plan_start_date, username }
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // ---- Coupon state ----
  const [couponCode, setCouponCode] = useState('');
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { id, code, discountAmount }

  useEffect(() => {
    if (status !== 'authenticated') return;
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('plan, amount_paid, plan_start_date, username, full_name, business_name, phone, email')
        .eq('user_id', session.user.id)
        .single();
      setCurrent(data);
      setLoadingData(false);
    }
    load();
  }, [status, session]);

  if (status === 'loading' || loadingData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-blue-600 text-lg font-semibold animate-pulse">Loading...</div>
    </div>
  );
  if (status === 'unauthenticated') { router.push('/login'); return null; }
  if (!current) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-700">No profile found</h1>
        <a href="/dashboard" className="text-blue-600 text-sm mt-2 inline-block">← Back to Dashboard</a>
      </div>
    </div>
  );

  const currentIndex = PLAN_ORDER.indexOf(current.plan);
  const upgradablePlans = PLANS.filter(p => PLAN_ORDER.indexOf(p.id) > currentIndex);

  // ---- Proration calculation ----
  const amountPaid = Number(current.amount_paid) || 0;
  const startDate = current.plan_start_date ? new Date(current.plan_start_date) : new Date();
  const daysUsed = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyRate = amountPaid / 365;
  const amountUsed = Math.min(amountPaid, dailyRate * daysUsed);
  const balance = Math.max(0, amountPaid - amountUsed);

  const newPlanPrice = selectedPlan ? PLANS.find(p => p.id === selectedPlan)?.price || 0 : 0;
  const upgradeCost = Math.max(0, Math.round((newPlanPrice - balance) * 100) / 100);

  // Final payable amount after coupon discount (never below ₹1, Razorpay doesn't allow ₹0 orders)
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = Math.max(1, Math.round((upgradeCost - discountAmount) * 100) / 100);

  // Reset any applied coupon if the selected plan changes — discount rules depend on plan
  function selectPlan(planId) {
    setSelectedPlan(planId);
    setAppliedCoupon(null);
    setCouponError('');
    setCouponCode('');
  }

  async function handleApplyCoupon() {
    setCouponError('');
    setAppliedCoupon(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    if (!selectedPlan) { setCouponError('Please select a plan first.'); return; }

    setCouponChecking(true);
    try {
      const { data: coupon, error: fetchErr } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();

      if (fetchErr || !coupon) { setCouponError('This coupon code is not valid.'); setCouponChecking(false); return; }
      if (!coupon.is_active) { setCouponError('This coupon is not active.'); setCouponChecking(false); return; }

      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) { setCouponError('This coupon is not active yet.'); setCouponChecking(false); return; }
      if (coupon.valid_until && new Date(coupon.valid_until) < now) { setCouponError('This coupon has expired.'); setCouponChecking(false); return; }

      if (coupon.applicable_product && coupon.applicable_product !== 'all' && coupon.applicable_product !== 'digital_card') {
        setCouponError('This coupon is not valid for Digital Card plans.'); setCouponChecking(false); return;
      }
      if (coupon.applicable_plans && coupon.applicable_plans.length > 0 && !coupon.applicable_plans.includes(selectedPlan)) {
        setCouponError('This coupon is not valid for this plan.'); setCouponChecking(false); return;
      }
      if (coupon.min_order_value && upgradeCost < Number(coupon.min_order_value)) {
        setCouponError(`A minimum order of ₹${coupon.min_order_value} is required for this coupon.`); setCouponChecking(false); return;
      }

      // Usage limit checks
      if (coupon.usage_type === 'single_use' && (coupon.used_count || 0) >= 1) {
        setCouponError('This coupon has already been fully used.'); setCouponChecking(false); return;
      }
      if (coupon.usage_type === 'limited' && coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
        setCouponError('This coupon has reached its usage limit.'); setCouponChecking(false); return;
      }

      // Per-user limit check
      const { count: userUseCount } = await supabase
        .from('coupon_redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('email', current.email);

      if (coupon.per_user_limit && (userUseCount || 0) >= coupon.per_user_limit) {
        setCouponError('You have already used this coupon.'); setCouponChecking(false); return;
      }

      // Calculate discount
      let discount = coupon.type === 'percentage'
        ? (Number(coupon.value) / 100) * upgradeCost
        : Number(coupon.value);
      if (coupon.max_discount_cap && discount > Number(coupon.max_discount_cap)) {
        discount = Number(coupon.max_discount_cap);
      }
      discount = Math.min(discount, upgradeCost); // never discount more than the order itself
      discount = Math.round(discount * 100) / 100;

      setAppliedCoupon({ id: coupon.id, code: coupon.code, discountAmount: discount });
    } catch {
      setCouponError('Something went wrong. Please try again.');
    }
    setCouponChecking(false);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    setProcessing(true); setError('');
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { setError('Payment gateway failed to load.'); setProcessing(false); return; }

      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, planId: selectedPlan, username: current.username }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        setError('Failed to start payment.'); setProcessing(false); return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'SmartProfile.in',
        description: `Upgrade to ${selectedPlan} — ${current.business_name || ''}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              const upgradeRes = await fetch('/api/profile/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPlan: selectedPlan }),
              });
              if (upgradeRes.ok) {
                // Record coupon redemption + bump used_count — only after payment + upgrade succeeded
                if (appliedCoupon) {
                  try {
                    await supabase.from('coupon_redemptions').insert([{
                      coupon_id: appliedCoupon.id,
                      profile_id: current.id || null,
                      email: current.email,
                      order_amount: upgradeCost,
                      discount_amount: appliedCoupon.discountAmount,
                      final_amount: finalAmount,
                      razorpay_order_id: response.razorpay_order_id,
                    }]);
                    await supabase.rpc('increment_coupon_usage', { coupon_id_input: appliedCoupon.id });
                  } catch {
                    // Non-critical — payment already succeeded, don't block the user for this
                  }
                }
                router.push('/dashboard');
              } else {
                setError('Payment succeeded, but the plan update failed. Please contact support.');
                setProcessing(false);
              }
            } else {
              setError('Payment verification failed. If money was deducted, please contact support.');
              setProcessing(false);
            }
          } catch {
            setError('Payment verify karte waqt error aaya.');
            setProcessing(false);
          }
        },
        prefill: { name: current.full_name, email: current.email, contact: current.phone },
        theme: { color: '#3b82f6' },
        modal: { ondismiss: function () { setProcessing(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError('Payment failed: ' + (response.error?.description || 'Try again.'));
        setProcessing(false);
      });
      rzp.open();
    } catch {
      setError('Something went wrong.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-bold text-gray-800">🚀 Upgrade Plan</h1>
        <a href="/dashboard" className="text-sm text-blue-600">← Back to Dashboard</a>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        {error && <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-3 text-sm">{error}</div>}

        {/* Current plan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">Your Current Plan</h2>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1.5 rounded-full">
              {PLANS.find(p => p.id === current.plan)?.name || current.plan} — ₹{amountPaid}/year
            </span>
            <span className="text-xs text-gray-500">Started: {formatDate(current.plan_start_date)}</span>
          </div>
        </div>

        {upgradablePlans.length === 0 ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center text-sm text-gray-500">
            🎉 You're already on our highest plan!
          </div>
        ) : (
          <>
            {/* Plan choices */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">Choose New Plan</h2>
              <div className="grid grid-cols-2 gap-3">
                {upgradablePlans.map(p => (
                  <button key={p.id} onClick={() => selectPlan(p.id)}
                    className={`rounded-xl p-3 border-2 transition-all text-center ${selectedPlan === p.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <div className={`${p.color} text-white text-xs font-bold px-2 py-1 rounded-lg mb-2`}>{p.name}</div>
                    <div className="font-bold text-gray-800">₹{p.price}</div>
                    <div className="text-xs text-gray-400">/year</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon code */}
            {selectedPlan && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">🏷️ Have a Coupon?</h2>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <span className="text-green-700 font-bold text-sm">{appliedCoupon.code}</span>
                      <span className="text-green-600 text-xs ml-2">applied — you saved ₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-red-500 text-xs font-semibold">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponChecking}
                        className="bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60"
                      >
                        {couponChecking ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Proration breakdown */}
            {selectedPlan && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">💰 Price Breakdown</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>New plan price</span><span>₹{newPlanPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Days used on current plan</span><span>{daysUsed} days</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Unused balance (credit)</span><span>− ₹{balance.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({appliedCoupon.code})</span><span>− ₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                    <span>You Pay</span><span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Upgrading resets your billing cycle — a fresh 365-day period starts today at the new plan's full price.</p>

                <button onClick={handleUpgrade} disabled={processing}
                  className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-2xl hover:opacity-90 shadow-lg disabled:opacity-60">
                  {processing ? '⏳ Processing...' : `✅ Pay ₹${finalAmount.toFixed(2)} & Upgrade`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}