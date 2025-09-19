// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { CalendarCheck, User, Stethoscope, PlusCircle, Hospital } from "lucide-react";

// export default function DashboardPage() {
//   const router = useRouter();
//   const params = useParams();
//   const hospitalId = params?.hospitalId;

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<any>({
//     activeDoctors: 0,
//     registeredStaff: 0,
//     totalPatients: 0,
//     appointmentsToday: 0,
//     revenueCollected: 0,
//   });
//   const [hospitals, setHospitals] = useState<any[]>([]);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

//   // Token check
//   useEffect(() => {
//     if (!token) {
//       router.push("/Login");
//     } else {
//       setLoading(false);
//     }
//   }, [router, token]);

//   // Load hospitals from localStorage
//   useEffect(() => {
//     const storedHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
//     setHospitals(storedHospitals);
//   }, []);

//   // Fetch stats
//   useEffect(() => {
//     if (!hospitalId || !token || hospitals.length === 0) return;

//     const fetchData = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/dashboard/stats/${hospitalId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) alert("Failed to fetch dashboard stats");

//         const data = await res.json();
//         setStats({
//           activeDoctors: data.activeDoctors ?? 0,
//           registeredStaff: data.registeredStaff ?? 0,
//           totalPatients: data.totalPatients ?? 0,
//           appointmentsToday: data.appointmentsToday ?? 0,
//           revenueCollected: data.revenueCollected ?? 0,
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [hospitalId, token, hospitals.length]);

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

//   // Show Add Hospital prompt if no hospitals
//   if (hospitals.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-8">
//         <Hospital className="w-16 h-16 text-blue-500 mb-4" />
//         <h2 className="text-2xl font-bold text-blue-600 mb-2">
//           You don’t have any hospitals yet
//         </h2>
//         <p className="text-gray-600 mb-4 text-center">
//           Add a hospital to start managing your doctors, staff, and patients.
//         </p>
//         <button
//           onClick={() => router.push("/AddHospital")}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
//         >
//           <PlusCircle size={18} />
//           Add Hospital
//         </button>
//       </div>
//     );
//   }

//   // Role-based dashboard config
//   const dashboardConfig: Record<string, any[]> = {
//     admin: [
//       { label: "Active Doctors", value: stats.activeDoctors, icon: <Stethoscope className="text-blue-500" size={28} /> },
//       { label: "Registered Staff", value: stats.registeredStaff, icon: <User className="text-purple-500" size={28} /> },
//       { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
//       { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-yellow-500" size={28} /> },
//       // { label: "Revenue Collected", value: `Rs. ${stats.revenueCollected}`, icon: <CalendarCheck className="text-orange-500" size={28} /> },
//     ],
//     doctor: [
//       { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-blue-500" size={28} /> },
//       { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
//     ],
//     staff: [
//       { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-blue-500" size={28} /> },
//       { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
//       { label: "Active Doctors", value: stats.activeDoctors, icon: <Stethoscope className="text-yellow-500" size={28} /> },
//     ],
//   };

//   const cards = dashboardConfig[role || "receptionist"] || [];

//   return (
//     <div className="min-h-screen">
//       {/* Welcome Card */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-10 px-6 mb-8 shadow-lg flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
//           <p className="mt-1 text-sm opacity-90">Here's your daily summary</p>
//         </div>
//         <Stethoscope size={40} className="opacity-90" />
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {cards.map(({ label, value, icon }) => (
//           <div
//             key={label}
//             className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:bg-blue-50 transition-colors cursor-pointer"
//           >
//             {icon}
//             <div className="flex flex-col">
//               <span className="text-lg font-bold text-gray-900">{value}</span>
//               <span className="text-sm text-gray-500">{label}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     {/* Recent Activities Table */}
//   <section className="mb-8 max-w-6xl mx-auto">
//        <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Activities</h3>
//        <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
//       <table className="w-full text-sm text-left text-gray-600">
//              <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
//                <tr>
//                  <th className="px-4 py-3">Time</th>
//                 <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Doctor</th>
//               <th className="px-4 py-3">Patient</th>
//               <th className="px-4 py-3">Notes</th>
//             </tr>
//           </thead>
//          <tbody>
//             {/* Empty for now */}
//     </tbody>
//         </table>
//       </div>
//      </section>
//   </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarCheck, User, Stethoscope, PlusCircle, Hospital, FileText, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const hospitalId = params?.hospitalId; 

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    activeDoctors: 0,
    registeredStaff: 0,
    totalPatients: 0,
    appointmentsToday: 0,
    revenueCollected: 0,
  });
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    const storedHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
    setHospitals(storedHospitals);
  }, []);

  console.log(hospitals);
  

  useEffect(() => {
    if (!hospitalId || !token || hospitals.length === 0) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dashboard/stats/${hospitalId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) alert("Failed to fetch dashboard stats");

        const data = await res.json();
        setStats({
          activeDoctors: data.activeDoctors ?? 0,
          registeredStaff: data.registeredStaff ?? 0,
          totalPatients: data.totalPatients ?? 0,
          appointmentsToday: data.appointmentsToday ?? 0,
          revenueCollected: data.revenueCollected ?? 0,
        });

        // Placeholder chart data
        setChartData([
          { name: "Mon", Appointments: 5 },
          { name: "Tue", Appointments: 8 },
          { name: "Wed", Appointments: 4 },
          { name: "Thu", Appointments: 10 },
          { name: "Fri", Appointments: 7 },
          { name: "Sat", Appointments: 3 },
          { name: "Sun", Appointments: 6 },
        ]);

        setPieData([
          { name: "Cardiology", value: 10 },
          { name: "Neurology", value: 6 },
          { name: "Orthopedics", value: 4 },
          { name: "General", value: 8 },
        ]);

        // Placeholder recent activities
       

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId, token, hospitals.length]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  console.log('hos length',hospitals.length);
  
  // Show Add Hospital prompt if no hospitals
  if (hospitals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-8">
        <Hospital className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-blue-600 mb-2">
          You don’t have any hospitals yet
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          Add a hospital to start managing your doctors, staff, and patients.
        </p>
        <button
          onClick={() => router.push("/AddHospital")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <PlusCircle size={18} />
          Add Hospital
        </button>
      </div>
    );
  }

  // Role-based dashboard config
  const dashboardConfig: Record<string, any[]> = {
    Owner: [
      { label: "Active Doctors", value: stats.activeDoctors, icon: <Stethoscope className="text-blue-500" size={28} /> },
      { label: "Registered Staff", value: stats.registeredStaff, icon: <User className="text-purple-500" size={28} /> },
      { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
      { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-yellow-500" size={28} /> },
      { label: "Revenue Collected", value: `Rs. ${stats.revenueCollected}`, icon: <DollarSign className="text-orange-500" size={28} /> },
    ],
    doctor: [
      { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-blue-500" size={28} /> },
      { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
    ],
    staff: [
      { label: "Appointments Today", value: stats.appointmentsToday, icon: <CalendarCheck className="text-blue-500" size={28} /> },
      { label: "Total Patients", value: stats.totalPatients, icon: <User className="text-green-500" size={28} /> },
      { label: "Active Doctors", value: stats.activeDoctors, icon: <Stethoscope className="text-yellow-500" size={28} /> },
    ],
  };

  const cards = dashboardConfig[role || "receptionist"] || [];

  const chartColors = ["#3B82F6", "#9333EA", "#F59E0B", "#10B981"];

  return (
    <div className="min-h-screen">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-10 px-6 mb-8 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <p className="mt-1 text-sm opacity-90">Here's your daily summary</p>
        </div>
        <Stethoscope size={40} className="opacity-90" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {icon}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          </div>
        ))}
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Appointments This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Appointments" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Patients per Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities Table */}
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
              {recentActivities.map((act, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">{act.time}</td>
                  <td className="px-4 py-3">{act.type}</td>
                  <td className="px-4 py-3">{act.doctor}</td>
                  <td className="px-4 py-3">{act.patient}</td>
                  <td className="px-4 py-3">{act.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
