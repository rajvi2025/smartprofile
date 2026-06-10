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
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Smart<span className="text-orange-500">Profile</span>.in
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-red-500 font-medium"
        >
          Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Welcome, {session?.user?.name}! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-gray-800">My Profile</p>
            <p className="text-xs text-gray-500 mt-1">Edit your profile</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">Analytics</p>
            <p className="text-xs text-gray-500 mt-1">View profile stats</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">💳</div>
            <p className="font-semibold text-gray-800">My Plan</p>
            <p className="text-xs text-orange-500 mt-1 font-semibold">Basic ₹199</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">🔗</div>
            <p className="font-semibold text-gray-800">My Link</p>
            <p className="text-xs text-gray-500 mt-1">Share profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}