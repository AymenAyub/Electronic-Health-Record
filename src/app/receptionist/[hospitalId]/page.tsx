"use client";

import { useEffect, useState } from "react";
import { Hospital } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    activeDoctors: 0,
    totalPatients: 0,
    appointmentsToday: 0,
  });
  const params = useParams();
  const hospitalId = params?.hospitalId; 

  const router = useRouter();
  const token = localStorage.getItem("token");

  const cards = [
    { label: "Active Doctors", value: stats.activeDoctors },
    { label: "Total Patients", value: stats.totalPatients },
    { label: "Appointments Today", value: stats.appointmentsToday },
  ];

  useEffect(() => {

    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false); // token hai to page render hoga
    }
  }, [router]);

 

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
          activeDoctors: data2.activeDoctors ?? 0,
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
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[90px] border border-gray-50 hover:text-blue-700 hover:bg-blue-50"
          >
            <span className="text-xl font-bold">{value}</span>
            <span className="text-sm text-gray-400 font-bold mt-1 hover:text-blue-700">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Activities Table */}
      <section className="mb-8 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Doctor</th>
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
    </>
  );
}
