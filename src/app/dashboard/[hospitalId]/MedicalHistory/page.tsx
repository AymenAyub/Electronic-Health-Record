"use client";

import { useState, useEffect } from "react";
import { FileText, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function MedicalHistoryPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;


  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!storedToken || !storedRole) {
      router.push("/Login");
      return;
    }

    setToken(storedToken);
    setRole(storedRole);
    setAuthorized(true);
  }
}, [router]);

  
  const fetchPatients = async () => {
     if (!token) return;
    try {
      let url = "";

      if (role === "Owner") {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getPatients?hospitalId=${hospitalId}`;
      } else if (role === "Doctor") {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getDoctorPatients?hospitalId=${hospitalId}`;
      } else {
        setPatients([]);
        return;
      }

      const res = await fetch(url, 
        { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      if (res.ok) {
        setPatients(data.patients);
      } else {
        toast.error(data.message || "Failed to fetch patients");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role && authorized) fetchPatients();
  }, [token, role, authorized]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-5">
        <div className="flex items-center gap-2">
          <FileText size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">
            Patient Medical History
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm font-semibold shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr
                  key={p.patient_id}
                  className="border border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-6 py-3">{p.age}</td>
                  <td className="px-6 py-3">{p.gender}</td>
                  <td className="px-6 py-3">{p.contact}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/${hospitalId}/MedicalHistory/${p.patient_id}`)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <FileText size={16} /> View Profile
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
