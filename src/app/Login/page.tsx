
"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // test
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setMessage("Login successful! Redirecting to your dashboard...")
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("hospitals", JSON.stringify(data.hospitals));
        localStorage.setItem(
          "role",
         JSON.stringify(data.role)
        );

          const currentHospital = data.hospitals.find(
              (h:any) => h.hospital_id === data.defaultHospitalId
            );
            localStorage.setItem(
              "permissions",
              JSON.stringify(data.permissions || [])
            );
         
        const defaultHospitalId =
          data.defaultHospitalId ?? data.hospitals?.[0]?.hospital?.id ?? null;

        if (defaultHospitalId) {
          localStorage.setItem("lastHospitalId", defaultHospitalId);
          router.push(`/dashboard/${defaultHospitalId}`);
        }
        else{
            router.push(`/dashboard`);
        }
       
      } else if (data.message === "User not found") {
        setMessage("User with this email doesn't exist.");
      } else if (data.message === "Incorrect password") {
        setMessage("The password you entered is incorrect.");
      } else {
        setMessage("Login failed!");
      }
    } catch (error) {
      setMessage("Something went wrong. Try Again!");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4 py-10 overflow-auto pt-20">
        <div className="absolute w-60 h-60 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-16 left-8"></div>
        <div className="absolute w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-16 right-8"></div>

        <div className="bg-white rounded-xl w-full max-w-lg p-8 border border-gray-200 z-10 mt-16 mb-20 sm:mt-24 sm:mb-24 shadow-lg shadow-gray-300/40">
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-4">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Please log in to your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                htmlFor="password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // 👈 disable button when loading
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
