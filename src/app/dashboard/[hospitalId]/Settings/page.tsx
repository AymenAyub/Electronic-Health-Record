"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Role = "admin" | "doctor" | "staff" | null;

export default function SettingsPage() {
  const params = useParams();
  const hospitalId = Array.isArray(params?.hospitalId) ? params?.hospitalId[0] : params?.hospitalId;

  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  // Account Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [newMessageAlert, setNewMessageAlert] = useState(true);

  // Hospital info (admin only)
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as Role;
    if (storedRole) setRole(storedRole);
    setLoading(false);

    // Optionally, fetch user & hospital info from API here
    // fetchUserInfo();
    // fetchHospitalInfo();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const handleSaveAccount = () => {
    console.log({ name, email, phone });
    alert("Account info saved (mock)");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");
    console.log({ currentPassword, newPassword });
    alert("Password updated (mock)");
  };

  const handleSaveNotifications = () => {
    console.log({ appointmentReminder, newMessageAlert });
    alert("Notifications saved (mock)");
  };

  const handleSaveHospital = () => {
    console.log({ hospitalName, hospitalAddress });
    alert("Hospital info saved (mock)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Account Info */}
      <section className="bg-white shadow p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Account Info</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleSaveAccount}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </section>

      {/* Password & Security */}
      <section className="bg-white shadow p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Password & Security</h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white shadow p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={appointmentReminder}
              onChange={(e) => setAppointmentReminder(e.target.checked)}
            />
            Appointment reminders
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newMessageAlert}
              onChange={(e) => setNewMessageAlert(e.target.checked)}
            />
            New message alerts
          </label>
          <button
            onClick={handleSaveNotifications}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </section>

      {/* Hospital Info (Admin only) */}
      {role === "admin" && (
        <section className="bg-white shadow p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Hospital Info</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleSaveHospital}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
