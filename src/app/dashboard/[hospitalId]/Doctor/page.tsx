"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/app/components/Admin/DoctorCard";
import AddDoctorModal from "@/app/components/Admin/AddDoctorModal";
import DeleteModal from "@/app/components/Admin/DeleteModal";
import { Stethoscope, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState<string | null>(null);
  const [userStr, setUserStr] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const hospitalId = params?.hospitalId;

  
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

      // Fetch doctors after token is loaded
      fetchDoctors(storedToken);
    }
  }, [router]);

  const fetchDoctors = async (authToken: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getDoctors?hospitalId=${hospitalId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      if (res.ok) setDoctors(data.doctors);
      else alert(data.message || "Failed to fetch doctors");
    } catch (err) {
      console.error(err);
      alert("Error fetching doctors");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/deleteUser/${id}?hospitalId=${hospitalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Doctor deleted successfully");
        fetchDoctors(token);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete doctor");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    } finally {
      setDeleteDoctorId(null);
    }
  };

  const handleSaveDoctor = async (doctorData: any) => {
    if (!token) return;
    try {
      const url = editingDoctor
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateUser/${editingDoctor.user_id}?hospitalId=${hospitalId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/addDoctor`;

      const method = editingDoctor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData),
      });

      const data = await res.json();

      if (res.ok) {
        fetchDoctors(token);
        setIsModalOpen(false);
        setEditingDoctor(null);
      } else {
        alert(data.message || "Failed to save doctor");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving doctor");
    }
  };

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = (doctor.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty
      ? doctor.specialty === selectedSpecialty
      : true;
    return matchesName && matchesSpecialty;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!authorized) return null;

  return (
    <div className="p-4">
    <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 mb-3 md:mb-0">
          <Stethoscope size={28} className="text-blue-600" />
          <h1 className="text-3xl md:text-3xl font-bold text-blue-600 tracking-tight">
          Manage Doctors
          </h1>
        </div>
            </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700">
            <Search size={20} />
          </span>
        </div>

        <select
         title="speciality"
          name="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full md:w-56 border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 hover:shadow-md"
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard 
            key={doctor.user_id} 
            doctor={doctor}
            onEdit={() => setEditingDoctor(doctor)} 
            onDelete={() => setDeleteDoctorId(doctor.user_id)} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No doctors found.</p>
        )}
      </div>

      {(isModalOpen || editingDoctor) && (
   <AddDoctorModal
    isOpen={isModalOpen || !!editingDoctor}
    onClose={() => {
      setIsModalOpen(false);
      setEditingDoctor(null);
    }}
    doctor={editingDoctor}
    onSave={handleSaveDoctor}
  />
  )}

<DeleteModal
    isOpen={!!deleteDoctorId}
    onClose={() => setDeleteDoctorId(null)}
    onConfirm={() => handleDelete(deleteDoctorId!)}
     itemName="this doctor"
  />
    </div>
  );
}
