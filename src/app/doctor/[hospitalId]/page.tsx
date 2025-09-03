"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarCheck, User, Stethoscope, Clock } from "lucide-react";

export default function DoctorDashboard() {
  const router = useRouter();
  const params = useParams();
  const hospitalId = params?.hospitalId;

  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState<string>("Hospital");  const [stats, setStats] = useState({
    appointmentsToday: 0,
    totalPatients: 0
  });

  const token = localStorage.getItem("token");

  // Token check
  useEffect(() => {
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false);
    }
  }, [router, token]);
  

  // Fetch stats (mocked for now, replace with API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res2 = await fetch(`http://localhost:5000/api/dashboard/stats/${hospitalId}`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res2.ok) alert("Failed to fetch dashboard stats");

        const data2 = await res2.json();
        setStats({
          totalPatients: data2.totalPatients ?? 0,
          appointmentsToday: data2.appointmentsToday ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 mb-8 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <p className="mt-1 text-sm opacity-90">Here's your daily summary</p>
        </div>
        <Stethoscope size={40} className="opacity-90" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow flex items-center gap-4 border border-gray-200">
          <CalendarCheck className="text-blue-500" size={28} />
          <div>
            <p className="text-lg font-bold">{stats.appointmentsToday}</p>
            <p className="text-sm text-gray-500">Appointments Today</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow flex items-center gap-4 border border-gray-200">
          <User className="text-green-500" size={28} />
          <div>
            <p className="text-lg font-bold">{stats.totalPatients}</p>
            <p className="text-sm text-gray-500">Total Patients</p>
          </div>
        </div>

       </div>

      <section className="mb-8 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Activities</h3>
        <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty for now */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
