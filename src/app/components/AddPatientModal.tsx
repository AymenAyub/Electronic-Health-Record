"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Phone, 
  Calendar, 
  Home, 
  AlertTriangle, 
  Users, 
  CreditCard, 
  UserCheck 
} from "lucide-react";
import { redirect, useParams } from "next/navigation";

export default function AddPatientModal({ onClose, onSave, patient }: any) {
  const params = useParams();
  const hospitalId = params?.hospitalId;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    CNIC: "",
    guardian_info: "",
    address: "",
    emergency_contact: "",
    hospital_id: hospitalId,
  });

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    redirect("/Login");
  }

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        age: patient.age || "",
        gender: patient.gender || "",
        contact: patient.contact || "",
        CNIC: patient.CNIC || "",
        guardian_info: patient.guardian_info || "",
        address: patient.address || "",
        emergency_contact: patient.emergency_contact || "",
        hospital_id: hospitalId,
      });
    } else {
      setFormData(prev => ({ ...prev, hospital_id: hospitalId || "" }));
    }
  }, [patient, hospitalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, contact } = formData;
    if (!name || !contact) {
      alert("Please fill at least Name and Contact");
      return;
    }

    try {
      await onSave(formData, patient);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save patient");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl max-w-3xl w-full p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {patient ? "Edit Patient" : "Add New Patient"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

          {/* Name & Age */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Age</label>
              <UserCheck className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Gender & Contact */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <Users className="absolute left-3 top-10 text-gray-400" size={18} />
              <select
              title="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Contact</label>
              <Phone className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* CNIC & Guardian Info */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">CNIC</label>
              <CreditCard className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="CNIC"
                value={formData.CNIC}
                onChange={handleChange}
                placeholder="Enter CNIC"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Guardian Info</label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="guardian_info"
                value={formData.guardian_info}
                onChange={handleChange}
                placeholder="Enter guardian info"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Address & Emergency Contact */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <Home className="absolute left-3 top-10 text-gray-400" size={18} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
              />
            </div>

            <div className="relative flex-1">
              <label className="block text-gray-700 font-medium mb-1">Emergency Contact</label>
              <AlertTriangle className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Enter emergency contact"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
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
              {patient ? "Save Changes" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

