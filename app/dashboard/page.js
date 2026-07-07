"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
            <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Welcome, {session?.user?.name}! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => router.push('/dashboard/create-profile')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-gray-800">My Profile</p>
            <p className="text-xs text-gray-500 mt-1">Edit your profile</p>
          </div>
        <div onClick={() => router.push('/dashboard/analytics')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">Analytics</p>
            <p className="text-xs text-gray-500 mt-1">View profile stats</p>
          </div>
        <div onClick={() => router.push('/pricing')} className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-2">💳</div>
            <p className="font-semibold text-gray-800">My Plan</p>
            <p className="text-xs text-orange-500 mt-1 font-semibold">Basic ₹199</p>
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



