"use client";

import { useState, useEffect } from "react";
import { User, Building2, Lock, Edit3, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Hospital {
  id: string;
  name: string;
  subdomain?: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  role: string;
  hospitals: Hospital[];
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [passwordMode, setPasswordMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/getMe`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
      setFormData({ name: data.name, email: data.email, phone: data.phone || "" });
    } catch (err) {
      console.error(err);
    }
  };
  fetchUser();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSaveProfile = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/updateMe`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update profile");
      return;
    }
    setUser((prev) => prev ? { ...prev, ...formData } : null);
    setEditMode(false);
    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while updating profile.");
  }
};

  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
   toast.error("New password and confirm password do not match!");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/changePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to change password");
      return;
    }

    toast.success("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMode(false);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while changing password.");
  }
};

  if (!user)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User size={20} /> User Info
          </h2>
          <button
            onClick={() => (editMode ? handleSaveProfile() : setEditMode(true))}
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            {editMode ? <Save size={16} /> : <Edit3 size={16} />}
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                editMode ? "focus:ring-2 focus:ring-blue-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                editMode ? "focus:ring-2 focus:ring-blue-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                editMode ? "focus:ring-2 focus:ring-blue-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Building2 size={20} /> Hospitals
        </h2>
        {user.hospitals.length > 0 ? (
          <ul className="space-y-2">
            {user.hospitals.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 border px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                <Building2 size={16} className="text-gray-500" />
                <span className="font-medium">{h.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You are not assigned to any hospitals yet.</p>
        )}
      </div>

     
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Lock size={20} /> Password
        </h2>

        <h3
          className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 flex items-center gap-2"
          onClick={() => setPasswordMode(!passwordMode)}
        >
          <Lock size={16} /> Change Password
        </h3>

        {passwordMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="col-span-full flex gap-2 mt-2">
              <button
                className="text-green-600 font-medium"
                onClick={handleChangePassword}
              >
                Save
              </button>
              <button
                className="text-red-600 font-medium"
                onClick={() => setPasswordMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
