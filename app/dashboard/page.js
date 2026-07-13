"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const PLAN_LABELS = { basic: 'Basic', business: 'Business', premium: 'Premium', pro: 'Pro' };
const PLAN_PRICES = { basic: '₹199', business: '₹399', premium: '₹599', pro: '₹999' };

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [planInfo, setPlanInfo] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    async function loadPlan() {
      const { data } = await supabase
        .from('profiles')
        .select('plan, plan_start_date, plan_end_date, username')
        .eq('user_id', session.user.id)
        .single();
      if (data) setPlanInfo(data);
    }
    async function loadCustomerId() {
      const { data } = await supabase
        .from('users')
        .select('customer_id')
        .eq('id', session.user.id)
        .single();
      if (data?.customer_id) setCustomerId(data.customer_id);
    }
    loadPlan();
    loadCustomerId();
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const planKey = planInfo?.plan || 'basic';

  return (
    <div className="min-h-screen bg-gray-100">
            <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Welcome, {session?.user?.name}! 👋
            </h2>
            <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
          </div>
          {customerId && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Customer ID</p>
              <p className="text-sm font-bold text-blue-600">{customerId}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => router.push('/dashboard/edit-profile')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-gray-800">My Profile</p>
            <p className="text-xs text-gray-500 mt-1">Edit your profile</p>
          </div>
        <div onClick={() => router.push('/dashboard/analytics')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">Analytics</p>
            <p className="text-xs text-gray-500 mt-1">View profile stats</p>
          </div>

          {/* My Plan — now shows real plan, price and renewal date, plus an Upgrade CTA */}
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition col-span-2 md:col-span-1">
            <div onClick={() => router.push('/dashboard/edit-profile')} className="cursor-pointer">
              <div className="text-3xl mb-2">💳</div>
              <p className="font-semibold text-gray-800">My Plan</p>
              <p className="text-xs text-orange-500 mt-1 font-semibold">
                {PLAN_LABELS[planKey] || planKey} {PLAN_PRICES[planKey] || ''}
              </p>
              {planInfo?.plan_end_date && (
                <p className="text-[11px] text-gray-400 mt-1">Renews: {formatDate(planInfo.plan_end_date)}</p>
              )}
            </div>
            <button
              onClick={() => router.push('/dashboard/upgrade-plan')}
              className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700"
            >
              🚀 Upgrade Plan
            </button>
          </div>

        <div onClick={() => router.push('/dashboard/testimonials')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
        <div className="text-3xl mb-2">⭐</div>
        <p className="font-semibold text-gray-800">Testimonials</p>
        <p className="text-xs text-gray-500 mt-1">Manage client reviews</p>
      </div>

      <div onClick={() => router.push('/dashboard/my-link')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">🔗</div>
            <p className="font-semibold text-gray-800">My Link</p>
            <p className="text-xs text-gray-500 mt-1">Share profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}