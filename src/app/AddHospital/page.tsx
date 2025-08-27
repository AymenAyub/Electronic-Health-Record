
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
    subdomain: "",
    phone: "",
    address: "",
  });

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<Availability>(null);
  const [normalized, setNormalized] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    if (name === "subdomain") {
      value = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      redirect("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const value = formData.subdomain;

    if (!value) {
      setAvailable(null);
      setNormalized("");
      return;
    }
    if (value.length < 3) {
      setAvailable(null);
      setNormalized(value);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/hospital/check-subdomain/${encodeURIComponent(
            value
          )}`
        );
        const data = await res.json();
        setAvailable(Boolean(data.available));
        setNormalized(data.normalized || value);
      } catch (err) {
        console.error(err);
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.subdomain]);

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

      if (available === false) {
        setMessage("Please choose another subdomain.");
        return;
      }
  
      const sanitizedSubdomain = formData.subdomain
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      if (sanitizedSubdomain.length < 3) {
        setMessage("Invalid subdomain. Min length is 3.");
        return;
      }

      const payload = { ...formData, subdomain: sanitizedSubdomain };

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
        setFormData({ name: "", email: "", subdomain: "", phone: "", address: "" });
        setMessage("Hospital registered successfully!");
        const existingHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
        const updatedHospitals = [...existingHospitals,  { hospital: data.hospital }];
        localStorage.setItem(
        "hospitals",
       JSON.stringify(updatedHospitals)
  );
        setTimeout(() => router.push("/SelectHospital"), 1200);
      } else {
        setMessage(data.message || "Failed to register hospital");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }``
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4 py-10 overflow-auto">
        <div className="bg-white rounded-xl w-full max-w-lg p-8 border border-gray-200 z-10 mt-16 mb-20 sm:mt-24 sm:mb-24 shadow-lg shadow-gray-300/40">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Register Your Hospital
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
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

            {/* Email */}
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

            {/* Subdomain */}
            <div className="relative">
              <label htmlFor="subdomain" className="block text-gray-700 font-medium mb-1">
                Hospital Subdomain
              </label>
              <Globe className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="subdomain"
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="e.g. city-care"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers and hyphens. Min 3 chars.
              </p>

              {formData.subdomain.length > 0 && formData.subdomain.length < 3 && (
              <p className="text-xs text-red-600 mt-1">
               Subdomain must be at least 3 characters.
              </p>
  )}

              {/* Real-time status */}
              {checking && <p className="text-xs text-gray-500 mt-1">Checking availability…</p>}
              {!checking && available === true && (
                <p className="text-xs text-green-600 mt-1">
                  Available {normalized ? `(${normalized})` : ""}
                </p>
              )}
              {!checking && available === false && (
                <p className="text-xs text-red-600 mt-1"> Already taken. Try another.</p>
              )}
            </div>

            {/* Phone */}
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

            {/* Address */}
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
              disabled={loading || checking || available === false || formData.subdomain.length < 3}
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
