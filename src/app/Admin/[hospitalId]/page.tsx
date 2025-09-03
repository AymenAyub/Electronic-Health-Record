"use client";

import { useEffect, useState, } from "react";
import { CalendarCheck, Hospital , User, Stethoscope} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  // const [hasHospital, setHasHospital] = useState(false);
  const [stats, setStats] = useState<any>({
    activeDoctors: 0,
    registeredStaff: 0,
    totalPatients: 0,
    appointmentsToday: 0,
    revenueCollected: 0,
  });
  const params = useParams();
  const hospitalId = params?.hospitalId; 

  const router = useRouter();
  const token = localStorage.getItem("token");
  // console.log("token", token); 
  useEffect(() => {
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false); 
    }
  }, [router]);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        // const res1 = await fetch(`http://localhost:5000/api/hospital/check/${hospitalId}`, {
        //   method: "GET", 
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
  
        // if (!res1.ok) alert("Unauthorized or failed to fetch hospital");
  
        // const data1 = await res1.json();
        // setHasHospital(data1.hasHospital);
  
        // if (data1.hasHospital) {
          const res2 = await fetch(`http://localhost:5000/api/dashboard/stats/${hospitalId}`, {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!res2.ok) 
            alert("Failed to fetch dashboard stats");
  
          const data2 = await res2.json();
          setStats({
            activeDoctors: data2.activeDoctors ?? 0,
            registeredStaff: data2.registeredStaff ?? 0,
            totalPatients: data2.totalPatients ?? 0,
            appointmentsToday: data2.appointmentsToday ?? 0,
            revenueCollected: data2.revenueCollected ?? 0,
          });
        }
      catch (err) {
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

  // if (!hasHospital) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[80vh] bg-blue-50 rounded-xl p-8 text-center">
  //       <Hospital className="w-16 h-16 text-blue-500 mb-4" />
  //       <h2 className="text-2xl font-bold text-blue-600 mb-2">
  //         You haven’t added your hospital yet!
  //       </h2>
  //       <p className="text-blue-600 font-semibold mb-4">
  //         Add your hospital to start managing your data.
  //       </p>
  //       <button
  //         onClick={() => router.push("/AddHospital")}
  //         className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
  //       >
  //         Add Hospital
  //       </button>
  //     </div>
  //   );
  // }

  // const cards = [
  //   { label: "Active Doctors", value: stats.activeDoctors },
  //   { label: "Registered Staff", value: stats.registeredStaff },
  //   { label: "Total Patients", value: stats.totalPatients },
  //   { label: "Appointments Today", value: stats.appointmentsToday },
  //   { label: "Revenue Collected", value: `${stats.revenueCollected}` },
  // ];

//   return (
//     <>
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//         {cards.map(({ label, value }) => (
//           <div
//             key={label}
//             className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[90px] border border-gray-50 hover:text-blue-700 hover:bg-blue-50"
//           >
//             <span className="text-xl font-bold">{value}</span>
//             <span className="text-sm text-gray-400 font-bold mt-1 hover:text-blue-700">
//               {label}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Recent Activities Table (empty for now) */}
//       <section className="mb-8 max-w-6xl mx-auto">
//         <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
//         <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
//           <table className="w-full text-sm text-left text-gray-600">
//             <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
//               <tr>
//                 <th className="px-4 py-3">Time</th>
//                 <th className="px-4 py-3">Type</th>
//                 <th className="px-4 py-3">Doctor</th>
//                 <th className="px-4 py-3">Patient</th>
//                 <th className="px-4 py-3">Notes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Empty for now */}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </>
//   );
// }
return (
  <>
    {/* Welcome Card */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 mb-8 shadow-lg flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        <p className="mt-1 text-sm opacity-90">Here's your daily summary</p>
      </div>
      <Stethoscope size={40} className="opacity-90" />
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Active Doctors */}
      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer">
        <Stethoscope className="text-blue-500" size={28} />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">{stats.activeDoctors}</span>
          <span className="text-sm text-gray-500">Active Doctors</span>
        </div>
      </div>

      {/* Total Patients */}
      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer">
        <User className="text-green-500" size={28} />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">{stats.totalPatients}</span>
          <span className="text-sm text-gray-500">Total Patients</span>
        </div>
      </div>

      {/* Appointments Today */}
      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer">
        <CalendarCheck className="text-yellow-500" size={28} />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">{stats.appointmentsToday}</span>
          <span className="text-sm text-gray-500">Appointments Today</span>
        </div>
      </div>
    </div>

    {/* Recent Activities Table (empty for now) */}
    <section className="mb-8 max-w-6xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Activities</h3>
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