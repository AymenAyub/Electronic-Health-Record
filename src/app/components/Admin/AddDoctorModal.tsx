"use client";

import { useState, useEffect } from "react";
import { User, Stethoscope, Phone, Mail, Key } from "lucide-react";
import { redirect } from "next/navigation";

export default function AddDoctorModal({ onClose, onSave, doctor }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    contact: "",
    bio: "",
  });

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    redirect("/login");
  }

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        password: "", 
        specialty: doctor.specialty || "",
        contact: doctor.contact || "",
        bio: doctor.bio || "",
      });
    }
  }, [doctor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.specialty || !formData.contact || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await onSave(formData, doctor); 
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save doctor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl max-w-3xl w-full p-8 border border-gray-200 shadow-lg shadow-gray-300/40 z-50">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {doctor ? "Edit Doctor" : "Add New Doctor"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Name and Specialty */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Doctor Name</label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="name"
                type="text"
                placeholder="Enter doctor name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Specialty</label>
              <Stethoscope className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="specialty"
                type="text"
                placeholder="Enter specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Email + Password (hide password if editing) */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <Mail className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {!doctor && (
              <div className="relative flex-1">
                <label className="block text-gray-700 font-medium mb-1">Password</label>
                <Key className="absolute left-3 top-10 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
            <Phone className="absolute left-3 top-10 text-gray-400" size={18} />
            <input
              name="contact"
              type="tel"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Bio */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              placeholder="Enter bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full pl-3 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-blue-500 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition"
              type="button"
            >
              {doctor ? "Save Changes" : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
