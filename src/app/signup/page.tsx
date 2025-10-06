"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Mail, Phone,Lock, Contact, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/Login"); 
        }, 1500);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Something went wrong");
    }
    finally {
      setLoading(false); 
    }
    
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4 py-10 overflow-auto">
        {/* Background Blur Circles */}
        <div className="absolute w-60 h-60 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-16 left-8"></div>
        <div className="absolute w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-16 right-8"></div>

        {/* White Card */}
        <div
         className="bg-white rounded-xl w-full max-w-lg p-8 border border-gray-200 z-10 mt-16 mb-20 sm:mt-24 sm:mb-24 shadow-lg shadow-gray-300/40 "
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Create Account
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Please fill in your details below
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Your Name
              </label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Address
              </label>
              <Mail className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

             {/* Password */}
            <div className="relative">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <Lock className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>


            {/* Phone */}
            <div className="relative">
              <label
                htmlFor="contact"
                className="block text-gray-700 font-medium mb-1"
              >
                Phone Number
              </label>
              <Phone className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                id="contact"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm"
            >
               {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                 Creating Your Account
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

           {/* Message */}
           {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/Login" className="text-blue-600 hover:underline cursor-pointer">
              Sign In
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
