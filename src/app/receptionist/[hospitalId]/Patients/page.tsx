"use client";

import { useState, useEffect } from "react";
import { Pen, Trash2, UserPlus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import AddPatientModal from "@/app/components/AddPatientModal"; 
import DeleteModal from "@/app/components/Admin/DeleteModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const params = useParams();
  const hospitalId = params?.hospitalId;

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const router = useRouter();

  const fetchPatients = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/getPatients?hospital_id=${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPatients(data.patients);
      else alert(data.message || "Failed to fetch patients");
    } catch (err) {
      console.error(err);
      alert("Error fetching patients");
    }
  };

  useEffect(() => {
    if (!token || !userStr) {
      router.push("/Login");
    }
    setAuthorized(true);
    fetchPatients();
  }, [router]);

  if (!authorized) return null;

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/deletePatient/${id}?hospital_id=${hospitalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Patient deleted successfully");
        fetchPatients();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete patient");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setDeletePatientId(null);
    }
  };

  const handleSavePatient = async (patientData: any) => {
    try {
      const url = editingPatient
        ? `http://localhost:5000/api/patients/updatePatient/${editingPatient.patient_id}`
        : "http://localhost:5000/api/patients/addPatient";
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
        fetchPatients();
        setIsModalOpen(false);
        setEditingPatient(null);
      } else {
        alert(data.message || "Failed to save patient");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving patient");
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Add Patient
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
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
      />
    </div>
  );
}
