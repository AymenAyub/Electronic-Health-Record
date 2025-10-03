
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Phone, Globe, MapPin, Mail } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

type Availability = null | boolean;

export default function RegisterHospital() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const router = useRouter();


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!token) {
      setLoading(true);
      router.push("/Login");

    } else {
      setLoading(false); 
    }
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login as admin first.");
        router.push("/Login");
        return;
      }

      const payload = {...formData};

      const res = await fetch(
        "http://localhost:5000/api/hospital/registerHospital",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), 
        }
      );

      const data = await res.json();

      if (res.ok && data.hospital) {
        setMessage("Hospital registered successfully!");
        const existingHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
        const updatedHospitals = [...existingHospitals,  { hospital: data.hospital }];
        localStorage.setItem(
        "hospitals",
       JSON.stringify(updatedHospitals)
  );

      setTimeout(() => router.push(`/dashboard/${data.hospital.id}`), 1200);

      } else {
        setMessage(data.message || "Failed to register hospital");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4 py-10 overflow-auto">
        <div className="bg-white rounded-xl w-full max-w-lg p-8 border border-gray-200 z-10 mt-16 mb-20 sm:mt-24 sm:mb-24 shadow-lg shadow-gray-300/40">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Register Your Hospital
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
           
            <div className="relative">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Hospital Name
              </label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter hospital name"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

           
            <div className="relative">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Hospital Email
              </label>
              <Mail className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter hospital email"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

           
            <div className="relative">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <Phone className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

            <div className="relative">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                Full Address
              </label>
              <MapPin className="absolute left-3 top-10 text-gray-400" size={18} />
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                required
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm disabled:opacity-50"
            >
              {loading ? "Registering..." : "Add Hospital"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
