"use client";

import { useState } from "react";
import {
  Home,
  UserPlus,
  Users,
  CalendarCheck,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  User,
  X,
  LayoutDashboard,
  Search,
  Bell,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { key: "doctors", label: "Doctors", icon: <UserPlus size={20} /> },
    { key: "staff", label: "Staff", icon: <Users size={20} /> },
    { key: "patients", label: "Patients", icon: <User size={20} /> },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} /> },
    { key: "payments", label: "Payments & Billing", icon: <CreditCard size={20} /> },
    { key: "reports", label: "Reports & Analytics", icon: <BarChart2 size={20} /> },
    { key: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold text-black">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col flex-grow mt-2 text-[15px]">
          {menuItems.map(({ key, label, icon }) => (
            <a
              key={key}
              onClick={() => setActiveMenu(key)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-100 focus:outline-none transition-colors ${
                activeMenu === key
                  ? "bg-blue-100 font-semibold text-blue-600"
                  : ""
              }`}
            >
              {icon}
              {sidebarOpen && <span>{label}</span>}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-gray-200 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0"
            title="Admin User"
          >
            A
          </div>
          {sidebarOpen && <span>Admin User</span>}
          {sidebarOpen && (
            <a
              aria-label="Logout"
              className="ml-auto text-red-600 hover:text-red-800 focus:outline-none"
            >
              <LogOut size={20} />
            </a>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col bg-gray-50">
        
        {/* Top Navbar */}
        <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Dashboard</h2>
          
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100  hover:bg-blue-50 rounded-lg px-3 py-2 w-80">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <a className="relative">
              <Bell size={20} className="text-gray-600 hover:text-blue-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </a>
            <a>
              <Settings size={20} className="text-gray-600 hover:text-blue-600" />
            </a>
            <img
              src="placeholder.jfif"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 overflow-auto bg-white">
          {activeMenu === "dashboard" ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Active Doctors", value: 24 },
                  { label: "Registered Staff", value: 42 },
                  { label: "Total Patients", value: 1275 },
                  { label: "Appointments Today", value: 18 },
                  { label: "Revenue Collected", value: "$12,450" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-100 rounded-md shadow-sm p-4 flex flex-col items-center justify-center min-h-[90px] border border-gray-200  hover:text-blue-700 hover:bg-blue-50"
                  >
                    <span className="text-lg font-bold">
                      {value}
                    </span>
                    <span className="text-xs text-gray-600 mt-1">{label}</span>
                  </div>
                ))}
              </div>

              {/* Recent Activities Table */}
              <section className="mb-8 max-w-6xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Doctor</th>
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          time: "09:00 AM",
                          type: "Appointment booked",
                          doctor: "Dr. Smith",
                          patient: "John Doe",
                          notes: "Follow-up visit",
                        },
                        {
                          time: "10:30 AM",
                          type: "Payment received",
                          doctor: "-",
                          patient: "-",
                          notes: "Invoice #12345",
                        },
                        {
                          time: "11:15 AM",
                          type: "Patient registered",
                          doctor: "-",
                          patient: "Mary Johnson",
                          notes: "New patient",
                        },
                        {
                          time: "01:00 PM",
                          type: "Appointment cancelled",
                          doctor: "Dr. Lee",
                          patient: "Jane Doe",
                          notes: "Rescheduled",
                        },
                      ].map(({ time, type, doctor, patient, notes }, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">{time}</td>
                          <td className="px-4 py-3">{type}</td>
                          <td className="px-4 py-3">{doctor}</td>
                          <td className="px-4 py-3">{patient}</td>
                          <td className="px-4 py-3">{notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            <div className="text-gray-500 text-center py-20 text-xl">
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)} page coming soon...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
