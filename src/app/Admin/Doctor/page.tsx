"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/app/components/Admin/DoctorCard";
import AddDoctorModal from "@/app/components/Admin/AddDoctorModal";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]); // initially empty
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

  useEffect(() => {
    

    if (!token || !userStr) {
      router.push("/Login");
      
     }

     setAuthorized(true);
  
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getDoctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDoctors(data.doctors);
        else alert(data.message || "Failed to fetch doctors");
      } catch (err) {
        console.error(err);
        alert("Error fetching doctors");
      }
    };
  
    fetchDoctors();
  }, [router]);
  


  if (!authorized) {
    return null; 
  }

  

  const handleAddDoctor = async (doctorData: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/addDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData),
      });

      const data = await res.json();

      if (res.ok) {
        setDoctors([...doctors, data.doctor]);
      } else {
        alert(data.message || "Failed to add doctor");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding doctor");
    }
  };

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    return matchesName && matchesSpecialty;
  });

  return (
    <div className="p-4">
     
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Add Doctor
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        <select
          name="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full md:w-56 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.user_id} doctor={doctor} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No doctors found.</p>
        )}
      </div>

      {/* Add Doctor Modal */}
      {isModalOpen && (
        <AddDoctorModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddDoctor} // backend call ke liye
        />
      )}
    </div>
  );
}
