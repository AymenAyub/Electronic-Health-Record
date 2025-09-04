"use client";

import { useEffect, useState } from "react";
import { Hospital, PlusCircle, Settings, LogOut, X, LayoutDashboard } from "lucide-react";
import { useRouter, redirect } from "next/navigation";

export default function SelectHospitalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false);
    }
  }, [router]);

  

  useEffect(() => {
    const storedHospitals = localStorage.getItem("hospitals");
    if (storedHospitals) {
      setHospitals(JSON.parse(storedHospitals));
    }

  }, [router]);

  console.log("stored hospitals", hospitals)
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
        {hospitals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-blue-50 rounded-xl shadow-md p-10">
            <Hospital className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              You don’t have any hospitals yet
            </h2>
            <p className="text-gray-600 mb-4">
              Add one to start managing your doctors, staff and patients.
            </p>
            <button
              onClick={() => router.push("/AddHospital")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <PlusCircle size={18} />
              Add Hospital
            </button>
          </div>
        ) : (
            <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              Your Hospitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <div
                  key={hospital.hospital.id}
                  className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition transform cursor-pointer flex flex-col justify-between"
                >
                  <div>    
                    <h3 className="text-lg font-bold text-blue-700 mb-2">
                      {hospital?.hospital?.name || "No name available"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {hospital?.hospital?.address || "No address provided"}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/Admin/${hospital.hospital.id}`)}
                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ))}
            </div>
          </div>
          
        )}
    </div>
  );
}
