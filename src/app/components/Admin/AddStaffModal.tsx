"use client";

import { useState, useEffect } from "react";
import { User, Briefcase, Phone, Mail, Key } from "lucide-react";
import { redirect } from "next/navigation";

export default function AddStaffModal({ onClose, onSave, staff }: any) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    contact: "",
    email: "",
    password: "",
  });

  
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    redirect("/Login");
  }

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        password: "", 
        designation: staff.designation || "",
        contact: staff.contact || "",
      });
    }
  }, [staff]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, designation, contact, email, password } = formData;
    if (!name || !contact || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await onSave(formData, staff); 
      onClose(); 
    } catch (err) {
      console.error(err);
      alert("Failed to save staff member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl max-w-3xl w-full p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        {staff ? "Edit Staff" : "Add New Staff"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Name and Designation */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter staff name"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Designation</label>
              <Briefcase className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter staff designation"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Email and Password */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <Mail className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <Key className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <Phone className="absolute left-3 top-10 text-gray-400" size={18} />
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-blue-500 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm"
            >
               {staff ? "Save Changes" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
