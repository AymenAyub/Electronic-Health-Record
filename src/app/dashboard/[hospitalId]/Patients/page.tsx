"use client";

import { useState, useEffect } from "react";
import { Pen, Trash2, UserPlus, User, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import AddPatientModal from "@/app/components/AddPatientModal"; 
import DeleteModal from "@/app/components/Admin/DeleteModal";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userStr, setUserStr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        router.push("/Login");
        return;
      }

      setToken(storedToken);
      setUserStr(storedUser);
      setAuthorized(true);
      setLoading(false);

      fetchPatients(storedToken);
    }
  }, [router]);

  const fetchPatients = async (authToken: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/getPatients?hospitalId=${hospitalId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      if (res.ok) setPatients(data.patients);
      else toast.error(data.message || "Failed to fetch patients");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching patients");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/deletePatient/${id}?hospitalId=${hospitalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Patient deleted successfully");
        fetchPatients(token);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete patient");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setDeletePatientId(null);
    }
  };

  const handleSavePatient = async (patientData: any) => {
    if (!token) return;
    try {
      const url = editingPatient
        ? `http://localhost:5000/api/patients/updatePatient/${editingPatient.patient_id}?hospitalId=${hospitalId}`
        : `http://localhost:5000/api/patients/addPatient?hospitalId=${hospitalId}`;
      const method = editingPatient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      });

      const data = await res.json();
      if (res.ok) {
        fetchPatients(token);
        setIsModalOpen(false);
        setEditingPatient(null);
        toast.success("Patient saved successfully");
      } else {
        toast.error(data.message || "Failed to save patient");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving patient");
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!authorized) return null;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2 mb-3 md:mb-0">
    <User size={28} className="text-blue-600" />
    <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-3xl font-bold text-blue-600 tracking-tight">
              Manage Patients
            </h1>
            <p className="text-sm text-gray-500">
              Overview and manage all hospital's patients
            </p>
          </div>
  </div>
  
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold">
          <UserPlus size={18} />
          Add Patient
        </button>
      </div>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm font-semibold shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
          />
          {/* Icon inside input */}
           <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(p => (
                <tr key={p.patient_id} className="border border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">{p.name}</td>
                  <td className="px-6 py-3">{p.age}</td>
                  <td className="px-6 py-3">{p.gender}</td>
                  <td className="px-6 py-3">{p.contact}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setEditingPatient(p)}
                        onMouseEnter={() => setHoveredIcon(`edit-${p.patient_id}`)}
                        onMouseLeave={() => setHoveredIcon(null)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Pen size={18} className="text-blue-600" />
                      </button>
                      {hoveredIcon === `edit-${p.patient_id}` && (
                        <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                          Edit
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setDeletePatientId(p.patient_id)}
                        onMouseEnter={() => setHoveredIcon(`delete-${p.patient_id}`)}
                        onMouseLeave={() => setHoveredIcon(null)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                      {hoveredIcon === `delete-${p.patient_id}` && (
                        <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                          Delete
                        </div>
                      )}
                    </div>
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

      {(isModalOpen || editingPatient) && (
        <AddPatientModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingPatient(null);
          }}
          patient={editingPatient}
          onSave={handleSavePatient}
        />
      )}

      <DeleteModal
        isOpen={!!deletePatientId}
        onClose={() => setDeletePatientId(null)}
        
        onConfirm={() => handleDelete(deletePatientId!)}
       itemName="this patient"
      />
    </div>
  );
}
