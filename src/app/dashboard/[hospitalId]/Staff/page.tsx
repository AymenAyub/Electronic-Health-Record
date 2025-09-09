"use client";

import { useState, useEffect } from "react";
import {  Pen, Trash2, User, UserPlus, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import AddStaffModal from "@/app/components/Admin/AddStaffModal";
import DeleteModal from "@/app/components/Admin/DeleteModal";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const params = useParams();
  const hospitalId = params?.hospitalId;

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
    
  const router = useRouter();
 
  const fetchStaff = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/getStaff?hospital_id=${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStaff(data.staff);
      else alert(data.message || "Failed to fetch staff");
    } catch (err) {
      console.error(err);
      alert("Error fetching staff");
    }
  };

      useEffect(() => {
      if (!token || !userStr) {
      router.push("/Login");
      return;

      } else {
      setLoading(false);
      setAuthorized(true);
      fetchStaff(); 
      }
      }, [router]);

    if (!authorized) 
    return null;


  const handleDelete = async (id: string) => {
  
    try {
      const res = await fetch(`http://localhost:5000/api/admin/deleteUser/${id}?hospital_id=${hospitalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        alert("Staff deleted successfully");
        fetchStaff(); 
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete staff");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
    finally {
      setDeleteStaffId(null); 
    }
  };

  const handleSaveStaff = async (staffData: any) => {
    try {
      const url = editingStaff
        ? `http://localhost:5000/api/admin/updateUser/${editingStaff.user_id}`
        : "http://localhost:5000/api/admin/addStaff";
  
      const method = editingStaff ? "PUT" : "POST";
  
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(staffData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setStaff([...staff, data.staff]);
        fetchStaff();
        setIsModalOpen(false);
        setEditingStaff(null);
      } else {
        alert(data.message || "Failed to save staff");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving staff");
    }
  };

  const designations = Array.from(new Set(staff.map(s => s.designation)));

  const filteredStaff = staff.filter(s => {
    const matchesName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation = selectedRole ? s.designation === selectedRole : true;
    return matchesName && matchesDesignation;
  });

  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-4">
       <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
      <User size={28} className="text-blue-600" />
      <h1 className="text-3xl md:text-3xl font-bold text-blue-600 tracking-tight">
        Manage Staff      </h1>
    </div>
              <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold"
        >
          <UserPlus size={20} />
          Add Staff
        </button>
        </div>

      {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search staff by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700">
              <Search size={20} />
            </span>
          </div>

          {/* Role Dropdown */}
          <div className="relative w-full md:w-56">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none w-full border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <option value="">All Designations</option>
              {designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>
        </div>


      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left ">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map(s => (
                <tr key={s.user_id} className="border border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">{s.name}</td>
                  <td className="px-6 py-3">{s.designation}</td>
                  <td className="px-6 py-3">{s.email}</td>
                  <td className="px-6 py-3">{s.contact}</td>
                  <td className="px-6 py-3 flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setEditingStaff(s)}
                      onMouseEnter={() => setHoveredIcon(`edit-${s.user_id}`)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Pen size={18} className="text-blue-600" />
                    </button>
                    {hoveredIcon === `edit-${s.user_id}` && (
                      <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                        Edit
                      </div>
                    )}
                  </div>

                  
                  <div className="relative">
                    <button
                      onClick={() => setDeleteStaffId(s.user_id)}
                      onMouseEnter={() => setHoveredIcon(`delete-${s.user_id}`)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                    {hoveredIcon === `delete-${s.user_id}` && (
                      <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                        Delete
                      </div>
                    )}
                  </div>
                </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

          {(isModalOpen || editingStaff) && (
      <AddStaffModal
        isOpen={isModalOpen || !!editingStaff}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />
    )}


    <DeleteModal
        isOpen={!!deleteStaffId}
        onClose={() => setDeleteStaffId(null)}
        onConfirm={() => handleDelete(deleteStaffId!)}
         itemName="this staff member"
      />
        </div>
  );
}
