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
      setLoading(false); // token hai to page render hoga
    }
  }, [router]);

  

  useEffect(() => {
    // login ke response me stored hospitals
    const storedHospitals = localStorage.getItem("hospitals");
    if (storedHospitals) {
      setHospitals(JSON.parse(storedHospitals));
    }

  }, [router]);

  console.log("stored hospitals", hospitals)
  // useEffect(() => {
  //   const fetchHospitals = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return router.push("/Login");
  
  //     try {
  //       const res = await fetch("http://localhost:5000/api/hospital/check", {
  //         method: "GET",
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.ok) alert("Failed to fetch hospitals");
  
  //       const data = await res.json();
  //       setHospitals(data.hospitals || []);
  //       localStorage.setItem("hospitals", JSON.stringify(data.hospitals || []));
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  
  //   fetchHospitals();
  // }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`flex flex-col justify-between bg-white border-r border-gray-300 transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            {sidebarOpen && <h1 className="text-lg font-bold">Admin Panel</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {sidebarOpen ? <X size={20} /> : <LayoutDashboard size={20} />}
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-3 text-gray-600 text-sm font-semibold">
            <button
              onClick={() => router.push("/AddHospital")}
              className="flex items-center gap-2 hover:text-blue-800 transition-colors"
            >
              <PlusCircle size={18} /> {sidebarOpen && "Add Hospital"}
            </button>
            <button
              onClick={() => router.push("/Settings")}
              className="flex items-center gap-2 hover:text-gray-900 transition-colors"
            >
              <Settings size={18} /> {sidebarOpen && "Settings"}
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              // localStorage.removeItem("hospitals");
              router.push("/Login");
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
          >
            <LogOut size={18} /> {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Select Hospital</h2>
          <button
            onClick={() => router.push("/AddHospital")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <PlusCircle size={18} />
            Add Hospital
          </button>
        </header>

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
      </main>
    </div>
  );
}
