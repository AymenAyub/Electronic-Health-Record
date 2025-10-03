"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
      <XCircle className="text-red-600" size={60} />
      <h1 className="text-3xl font-bold text-red-700 mt-4">Access Denied</h1>
      <p className="text-gray-700 mt-2 text-center">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
