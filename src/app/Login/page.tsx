"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { log } from "console";

export default function LoginPage() {
  const [message, setMessage] = useState("");
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
    if(!formData.email || !formData.password){
      setMessage("Please fill in all required fields.");
      return;
  
      }
       
  
       try{
        const res = await fetch('http://localhost:5000/api/login',{
          method :"POST",
          headers :{
            "Content-Type": "application/json"
  
          },
          body : JSON.stringify(formData)
        });
        const data=await res.json();
        console.log(data);
        console.log(data.message);
        console.log(data.user.role);
        
  
         if(res.ok){
          
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("hospitals", JSON.stringify(data.hospitals));

          console.log("res is ok");
          

          if (data.user.role === "admin") {
            router.push("/SelectHospital");
          } 
          else if (data.user.role === "staff" && data.user.designation === "Receptionist") {
            console.log(data.user.role);
            
            const receptionistHospital = data.hospitals?.[0]; 
            console.log(receptionistHospital);
            
            if (receptionistHospital) {
               router.push(`/receptionist/${receptionistHospital.hospital.id}`);
            } else {
              setMessage("No hospital assigned to this receptionist.");
            }
          } 
          else if (data.user.role === "doctor") {
            console.log(data.user.role);
            
            const doctorHospital = data.hospitals?.[0]; 
            console.log(doctorHospital);
            
            if (doctorHospital) {
               router.push(`/doctor/${doctorHospital.hospital.id}`);
            } else {
              setMessage("No hospital assigned to this receptionist.");
            }
          } 
          // router.push('/SelectHospital');
          
        }
        
        else if(data.message === "User not found") {
           setMessage("User with this email doesn't exist.");
        } 
        else if (data.message === "Incorrect password") {
          setMessage("The password you entered is incorrect.");
        } 
        else {
          setMessage("Login failed!");
        }
      
      
     
       }
       catch(error){
        setMessage("Something went wrong. Try Again!");
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

    
        <div
          className="bg-white rounded-xl w-full max-w-lg p-8 border border-gray-200 z-10 mt-16 mb-20 sm:mt-24 sm:mb-24 shadow-lg shadow-gray-300/40"
        >
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-4">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Please log in to your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
           
            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
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
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
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
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm"
            >
              Login
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
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline cursor-pointer">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
