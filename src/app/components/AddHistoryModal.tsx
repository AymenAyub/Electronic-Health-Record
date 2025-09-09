"use client";

import { useState , useEffect} from "react";
import { FileText, Activity, Pill } from "lucide-react";
import { redirect, useParams } from "next/navigation";

export default function AddHistoryModal({ onClose, onSave , history}: any) {
  const params = useParams();
  const hospitalId = params?.hospitalId;

    const [formData, setFormData] = useState({
    diagnosis: "",
    past_illnesses: "",
    prescriptions: "",

  });

  const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
  
    if (!token || !userStr) {
      redirect("/Login");
    }
  
useEffect(() => {
if (history) {
    setFormData({
        diagnosis:history.diagnosis || "",
        past_illnesses:history.past_illnesses || "",
        prescriptions:history.prescriptions || ""    });
} else {
    setFormData(prev => ({ ...prev }));
}
}, [history]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save history");
    }
  };


  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Add Medical History
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Diagnosis */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Diagnosis
            </label>
            <FileText
              className="absolute left-3 top-10 text-gray-400"
              size={18}
            />
            <input
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Past Illnesses */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Past Illnesses
            </label>
            <Activity
              className="absolute left-3 top-10 text-gray-400"
              size={18}
            />
            <textarea
              name="past_illnesses"
              value={formData.past_illnesses}
              onChange={handleChange}
              placeholder="Enter past illnesses"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
            />
          </div>

          {/* Prescriptions */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Prescriptions
            </label>
            <Pill className="absolute left-3 top-10 text-gray-400" size={18} />
            <textarea
              name="prescriptions"
              value={formData.prescriptions}
              onChange={handleChange}
              placeholder="Enter prescriptions"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 text-sm"
            >
              Save History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
